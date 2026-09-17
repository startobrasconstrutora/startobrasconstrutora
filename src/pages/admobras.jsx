import React, { useEffect, useState } from 'react';
import * as S from './admobras.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone, caminhoDoStorage, formatarCodigoObra } from './mascaras';

const CAMPOS_VAZIOS = {
  nome_obra: '',
  tipo_obra: 'construcao',
  nome_proprietario: '',
  cpf_proprietario: '',
  telefone_proprietario: '',
  endereco: '',
  bairro: '',
  cidade: '',
  descricao: '',
  imagens: [],
  atualizacoes: [],
};

export default function PainelGerenciarObras() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [selecionados, setSelecionados] = useState([]);
  const [excluindoSelecao, setExcluindoSelecao] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState(CAMPOS_VAZIOS);
  const [imagensParaRemover, setImagensParaRemover] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);

  // NOVO: controle de edição das atualizações da obra (fotos+descrição+data)
  const [atualizacoesParaRemover, setAtualizacoesParaRemover] = useState([]); // índices marcados p/ excluir a atualização inteira
  const [fotosAtualizacaoParaRemover, setFotosAtualizacaoParaRemover] = useState([]); // { atualizacaoIndex, url }

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarObras();
  }, []);

  async function buscarObras() {
    setCarregando(true);
    setErro(null);
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setErro('Não foi possível carregar as obras. Tente atualizar a lista.');
      console.error('Erro ao buscar obras:', error);
    } else {
      setObras(data || []);
    }
    setCarregando(false);
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // ---------- Edição ----------

  function iniciarEdicao(obra) {
    setEditandoId(obra.id);
    setFormEdicao({ ...CAMPOS_VAZIOS, ...obra });
    setImagensParaRemover([]);
    setNovasImagens([]);
    setAtualizacoesParaRemover([]);
    setFotosAtualizacaoParaRemover([]);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao(CAMPOS_VAZIOS);
    setImagensParaRemover([]);
    setNovasImagens([]);
    setAtualizacoesParaRemover([]);
    setFotosAtualizacaoParaRemover([]);
  }

  function atualizarCampo(campo, valor) {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  }

  function alternarRemocaoImagem(url) {
    setImagensParaRemover((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  }

  // Reordena o array de imagens via arrastar e soltar.
  // A posição 0 do array continua sendo a capa/imagem principal.
  function reordenarImagens(indiceOrigem, indiceDestino) {
    setFormEdicao((prev) => {
      const imagens = [...(prev.imagens || [])];
      const [movida] = imagens.splice(indiceOrigem, 1);
      imagens.splice(indiceDestino, 0, movida);
      return { ...prev, imagens };
    });
  }

  function adicionarNovaImagem(file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      alert(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
      return;
    }
    setNovasImagens((prev) => [...prev, file]);
  }

  function removerNovaImagem(index) {
    setNovasImagens((prev) => prev.filter((_, i) => i !== index));
  }

  // ---------- Atualizações da obra (fotos + descrição + data) ----------

  function atualizarCampoAtualizacao(index, campo, valor) {
    setFormEdicao((prev) => {
      const atualizacoes = [...(prev.atualizacoes || [])];
      atualizacoes[index] = { ...atualizacoes[index], [campo]: valor };
      return { ...prev, atualizacoes };
    });
  }

  function alternarRemocaoAtualizacao(index) {
    setAtualizacoesParaRemover((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  function alternarRemocaoFotoAtualizacao(atualizacaoIndex, url) {
    setFotosAtualizacaoParaRemover((prev) => {
      const jaMarcada = prev.some(
        (item) => item.atualizacaoIndex === atualizacaoIndex && item.url === url
      );
      if (jaMarcada) {
        return prev.filter(
          (item) => !(item.atualizacaoIndex === atualizacaoIndex && item.url === url)
        );
      }
      return [...prev, { atualizacaoIndex, url }];
    });
  }

  function fotoDaAtualizacaoMarcada(atualizacaoIndex, url) {
    return fotosAtualizacaoParaRemover.some(
      (item) => item.atualizacaoIndex === atualizacaoIndex && item.url === url
    );
  }

  async function salvarEdicao(id) {
    // Validação: nenhuma atualização (que não vá ser excluída inteira) pode ficar sem foto nenhuma
    const atualizacoesInvalidas = (formEdicao.atualizacoes || []).some((item, index) => {
      if (atualizacoesParaRemover.includes(index)) return false;
      const urlsRestantes = (item.urls || []).filter(
        (url) => !fotoDaAtualizacaoMarcada(index, url)
      );
      return urlsRestantes.length === 0;
    });
    if (atualizacoesInvalidas) {
      alert(
        'Uma atualização ficaria sem nenhuma foto. Restaure uma foto ou exclua a atualização inteira.'
      );
      return;
    }

    setSalvando(true);
    try {
      // 1. Envia as imagens novas pro Storage
      const urlsNovas = [];
      for (const arquivo of novasImagens) {
        const extensao = arquivo.name.split('.').pop();
        const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;
        const caminho = `obrasandamento/${nomeArquivo}`;

        const { error: erroUpload } = await supabase.storage
          .from('obras')
          .upload(caminho, arquivo);
        if (erroUpload) throw erroUpload;

        const { data: urlData } = supabase.storage
          .from('obras')
          .getPublicUrl(caminho);
        urlsNovas.push(urlData.publicUrl);
      }

      // 2. Junta todas as fotos que precisam sumir do Storage: imagens removidas +
      // fotos de atualizações removidas individualmente + fotos de atualizações excluídas inteiras
      const urlsDeAtualizacoesExcluidas = (formEdicao.atualizacoes || [])
        .filter((_, index) => atualizacoesParaRemover.includes(index))
        .flatMap((item) => item.urls || []);

      const urlsDeFotosRemovidas = fotosAtualizacaoParaRemover.map((item) => item.url);

      const caminhosParaApagar = [
        ...imagensParaRemover,
        ...urlsDeAtualizacoesExcluidas,
        ...urlsDeFotosRemovidas,
      ]
        .map((url) => caminhoDoStorage(url))
        .filter(Boolean);

      if (caminhosParaApagar.length > 0) {
        const { error: erroRemocao } = await supabase.storage
          .from('obras')
          .remove(caminhosParaApagar);
        if (erroRemocao) {
          // Não interrompe o salvamento por causa disso, só avisa no console
          console.error('Erro ao remover imagens do Storage:', erroRemocao);
        }
      }

      // 3. Monta o array final de imagens (mantidas, já na ordem escolhida + novas no fim)
      const imagensFinal = (formEdicao.imagens || [])
        .filter((url) => !imagensParaRemover.includes(url))
        .concat(urlsNovas);

      // 4. Monta o array final de atualizações: remove as excluídas inteiras e,
      // dentro das que ficam, remove as fotos marcadas individualmente
      const atualizacoesFinal = (formEdicao.atualizacoes || [])
        .filter((_, index) => !atualizacoesParaRemover.includes(index))
        .map((item, index) => ({
          ...item,
          urls: (item.urls || []).filter((url) => !fotoDaAtualizacaoMarcada(index, url)),
        }));

      // 5. Atualiza a linha na tabela
      const { error: erroUpdate } = await supabase
        .from('obras')
        .update({
          nome_obra: formEdicao.nome_obra,
          tipo_obra: formEdicao.tipo_obra,
          nome_proprietario: formEdicao.nome_proprietario,
          cpf_proprietario: formEdicao.cpf_proprietario,
          telefone_proprietario: formEdicao.telefone_proprietario,
          endereco: formEdicao.endereco,
          bairro: formEdicao.bairro,
          cidade: formEdicao.cidade,
          descricao: formEdicao.descricao,
          imagens: imagensFinal,
          atualizacoes: atualizacoesFinal,
        })
        .eq('id', id);

      if (erroUpdate) throw erroUpdate;

      await buscarObras();
      cancelarEdicao();
    } catch (erro) {
      console.error('Erro ao salvar edição:', erro);
      alert('Erro ao salvar as alterações. Veja o console para detalhes.');
    } finally {
      setSalvando(false);
    }
  }

  // ---------- Exclusão ----------

  async function excluirObra(obra) {
    const confirmar = window.confirm(
      `Excluir a obra "${obra.nome_obra}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmar) return;

    try {
      const urlsDasAtualizacoes = (obra.atualizacoes || []).flatMap((item) => item.urls || []);
      const caminhos = [...(obra.imagens || []), ...urlsDasAtualizacoes]
        .map((url) => caminhoDoStorage(url))
        .filter(Boolean);

      if (caminhos.length > 0) {
        const { error: erroRemocao } = await supabase.storage
          .from('obras')
          .remove(caminhos);
        if (erroRemocao) console.error('Erro ao remover imagens:', erroRemocao);
      }

      const { error } = await supabase.from('obras').delete().eq('id', obra.id);
      if (error) throw error;

      await buscarObras();
      setSelecionados((prev) => prev.filter((id) => id !== obra.id));
    } catch (erro) {
      console.error('Erro ao excluir obra:', erro);
      alert('Erro ao excluir a obra. Veja o console para detalhes.');
    }
  }

  async function excluirSelecionados() {
    if (selecionados.length === 0) return;
    const confirmar = window.confirm(
      `Excluir ${selecionados.length} obra(s) selecionada(s)? Essa ação não pode ser desfeita.`
    );
    if (!confirmar) return;

    setExcluindoSelecao(true);
    try {
      const obrasSelecionadas = obras.filter((o) => selecionados.includes(o.id));

      const todosCaminhos = obrasSelecionadas
        .flatMap((o) => [...(o.imagens || []), ...(o.atualizacoes || []).flatMap((item) => item.urls || [])])
        .map((url) => caminhoDoStorage(url))
        .filter(Boolean);

      if (todosCaminhos.length > 0) {
        const { error: erroRemocao } = await supabase.storage
          .from('obras')
          .remove(todosCaminhos);
        if (erroRemocao) console.error('Erro ao remover imagens:', erroRemocao);
      }

      const { error } = await supabase
        .from('obras')
        .delete()
        .in('id', selecionados);
      if (error) throw error;

      setSelecionados([]);
      await buscarObras();
    } catch (erro) {
      console.error('Erro ao excluir selecionados:', erro);
      alert('Erro ao excluir as obras selecionadas. Veja o console para detalhes.');
    } finally {
      setExcluindoSelecao(false);
    }
  }

  // ---------- Render ----------

  return (
    <S.Wrapper>
      <S.CabecalhoLista>
        <S.TituloLista>Gerenciar Obras</S.TituloLista>
        <S.AcoesLista>
          <S.BotaoPequeno as="button" onClick={buscarObras} style={{ flex: 'none' }}>
            🔄 Atualizar
          </S.BotaoPequeno>
          <S.BotaoPequeno
            $perigo
            as="button"
            style={{ flex: 'none' }}
            disabled={selecionados.length === 0 || excluindoSelecao}
            onClick={excluirSelecionados}
          >
            🗑️ Excluir seleção ({selecionados.length})
          </S.BotaoPequeno>
        </S.AcoesLista>
      </S.CabecalhoLista>

      {erro && <S.Aviso $erro>{erro}</S.Aviso>}
      {carregando && <S.Aviso>Carregando obras...</S.Aviso>}

      {!carregando && obras.length === 0 && !erro && (
        <S.VazioLista>Nenhuma obra cadastrada ainda.</S.VazioLista>
      )}

      <S.Grid>
        {obras.map((obra) =>
          editandoId === obra.id ? (
            <FormularioEdicao
              key={obra.id}
              obra={obra}
              formEdicao={formEdicao}
              atualizarCampo={atualizarCampo}
              imagensParaRemover={imagensParaRemover}
              alternarRemocaoImagem={alternarRemocaoImagem}
              reordenarImagens={reordenarImagens}
              novasImagens={novasImagens}
              adicionarNovaImagem={adicionarNovaImagem}
              removerNovaImagem={removerNovaImagem}
              atualizacoesParaRemover={atualizacoesParaRemover}
              alternarRemocaoAtualizacao={alternarRemocaoAtualizacao}
              fotoDaAtualizacaoMarcada={fotoDaAtualizacaoMarcada}
              alternarRemocaoFotoAtualizacao={alternarRemocaoFotoAtualizacao}
              atualizarCampoAtualizacao={atualizarCampoAtualizacao}
              salvando={salvando}
              onSalvar={() => salvarEdicao(obra.id)}
              onCancelar={cancelarEdicao}
            />
          ) : (
            <CardObra
              key={obra.id}
              obra={obra}
              selecionado={selecionados.includes(obra.id)}
              onToggleSelecionado={() => toggleSelecionado(obra.id)}
              onEditar={() => iniciarEdicao(obra)}
              onExcluir={() => excluirObra(obra)}
            />
          )
        )}
      </S.Grid>
    </S.Wrapper>
  );
}

function CardObra({ obra, selecionado, onToggleSelecionado, onEditar, onExcluir }) {
  const capa = (obra.imagens || [])[0];

  return (
    <S.Card>
      <S.Thumb $src={capa}>
        {!capa && 'Sem imagem'}
        <S.SeloTipo>
          {obra.tipo_obra === 'reforma' ? 'Reforma' : 'Construção'}
        </S.SeloTipo>
        <S.CaixaSelecao>
          <input
            type="checkbox"
            checked={selecionado}
            onChange={onToggleSelecionado}
          />
        </S.CaixaSelecao>
      </S.Thumb>
      <S.CardCorpo>
        <S.NomeObra>
          <span style={{ opacity: 0.6, fontWeight: 600, marginRight: 6 }}>
            {formatarCodigoObra(obra)}
          </span>
          {obra.nome_obra || '(sem nome)'}
        </S.NomeObra>
        <S.LinhaSecundaria>{obra.nome_proprietario}</S.LinhaSecundaria>
        <S.LinhaSecundaria>
          {[obra.bairro, obra.cidade].filter(Boolean).join(' - ')}
        </S.LinhaSecundaria>
      </S.CardCorpo>
      <S.CardRodape>
        <S.BotaoPequeno onClick={onEditar}>Editar</S.BotaoPequeno>
        <S.BotaoPequeno $perigo onClick={onExcluir}>
          Excluir
        </S.BotaoPequeno>
      </S.CardRodape>
    </S.Card>
  );
}

function FormularioEdicao({
  obra,
  formEdicao,
  atualizarCampo,
  imagensParaRemover,
  alternarRemocaoImagem,
  reordenarImagens,
  novasImagens,
  adicionarNovaImagem,
  removerNovaImagem,
  atualizacoesParaRemover,
  alternarRemocaoAtualizacao,
  fotoDaAtualizacaoMarcada,
  alternarRemocaoFotoAtualizacao,
  atualizarCampoAtualizacao,
  salvando,
  onSalvar,
  onCancelar,
}) {
  // Estado local só do drag-and-drop das miniaturas de imagens
  const [indiceArrastando, setIndiceArrastando] = useState(null);
  const [indiceSobre, setIndiceSobre] = useState(null);

  function handleDragStart(index) {
    setIndiceArrastando(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault(); // necessário pra permitir o drop
    if (index !== indiceSobre) setIndiceSobre(index);
  }

  function handleDrop(index) {
    if (indiceArrastando !== null && indiceArrastando !== index) {
      reordenarImagens(indiceArrastando, index);
    }
    setIndiceArrastando(null);
    setIndiceSobre(null);
  }

  function handleDragEnd() {
    setIndiceArrastando(null);
    setIndiceSobre(null);
  }

  return (
    <S.PainelEdicao>
      <S.TituloLista style={{ fontSize: 18 }}>
        {formatarCodigoObra(obra)} — Editando: {obra.nome_obra || '(sem nome)'}
      </S.TituloLista>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Identificação
        </S.TituloLista>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}
        >
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Código da Obra
            </label>
            <input
              style={{
                ...inputStyle,
                background: '#eeece5',
                color: '#6e7178',
                cursor: 'not-allowed',
              }}
              type="text"
              value={formatarCodigoObra(obra)}
              disabled
              readOnly
              title="O código é definido automaticamente e não pode ser alterado."
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Nome da Obra
            </label>
            <input
              style={inputStyle}
              type="text"
              value={formEdicao.nome_obra}
              onChange={(e) => atualizarCampo('nome_obra', e.target.value)}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Tipo
            </label>
            <div style={{ display: 'flex', gap: 16, paddingTop: 10 }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="radio"
                  checked={formEdicao.tipo_obra === 'construcao'}
                  onChange={() => atualizarCampo('tipo_obra', 'construcao')}
                />
                Construção
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="radio"
                  checked={formEdicao.tipo_obra === 'reforma'}
                  onChange={() => atualizarCampo('tipo_obra', 'reforma')}
                />
                Reforma
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Proprietário
        </S.TituloLista>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}
        >
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Nome do Proprietário
            </label>
            <input
              style={inputStyle}
              type="text"
              value={formEdicao.nome_proprietario}
              onChange={(e) => atualizarCampo('nome_proprietario', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              CPF
            </label>
            <input
              style={inputStyle}
              type="text"
              maxLength={14}
              value={formEdicao.cpf_proprietario}
              onChange={(e) =>
                atualizarCampo('cpf_proprietario', mascaraCPF(e.target.value))
              }
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Telefone
            </label>
            <input
              style={inputStyle}
              type="text"
              maxLength={15}
              value={formEdicao.telefone_proprietario}
              onChange={(e) =>
                atualizarCampo('telefone_proprietario', mascaraTelefone(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Localização
        </S.TituloLista>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}
        >
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Endereço
            </label>
            <input
              style={inputStyle}
              type="text"
              value={formEdicao.endereco}
              onChange={(e) => atualizarCampo('endereco', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Bairro
            </label>
            <input
              style={inputStyle}
              type="text"
              value={formEdicao.bairro}
              onChange={(e) => atualizarCampo('bairro', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Cidade
            </label>
            <input
              style={inputStyle}
              type="text"
              value={formEdicao.cidade}
              onChange={(e) => atualizarCampo('cidade', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Descrição
        </S.TituloLista>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          rows={5}
          maxLength={2000}
          value={formEdicao.descricao}
          onChange={(e) => atualizarCampo('descricao', e.target.value)}
        />
      </div>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Imagens (arraste para reordenar — a primeira é a principal)
        </S.TituloLista>

        <S.GridImagensExistentes style={{ marginBottom: 14 }}>
          {(formEdicao.imagens || []).map((url, index) => {
            const marcada = imagensParaRemover.includes(url);
            const ehPrincipal = index === 0 && !marcada;
            return (
              <S.MiniaturaExistente
                key={url}
                $src={url}
                $marcada={marcada}
                $arrastando={indiceArrastando === index}
                $sobre={indiceSobre === index && indiceArrastando !== index}
                draggable={!marcada}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                {ehPrincipal && <S.EtiquetaPrincipal>Principal</S.EtiquetaPrincipal>}
                {!marcada && <S.AlcaArrastar>⠿</S.AlcaArrastar>}

                <S.BotaoRemoverImagem
                  type="button"
                  $marcada={marcada}
                  onClick={() => alternarRemocaoImagem(url)}
                >
                  {marcada ? 'Desfazer' : 'Remover'}
                </S.BotaoRemoverImagem>
              </S.MiniaturaExistente>
            );
          })}
        </S.GridImagensExistentes>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {novasImagens.map((arquivo, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
              }}
            >
              <span>📎 {arquivo.name}</span>
              <button type="button" onClick={() => removerNovaImagem(index)}>
                Remover
              </button>
            </div>
          ))}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              adicionarNovaImagem(e.target.files[0]);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div>
        <S.TituloLista style={{ fontSize: 13, color: '#6e7178', marginBottom: 10 }}>
          Atualizações da Obra (postadas pelo cliente/equipe)
        </S.TituloLista>

        {(formEdicao.atualizacoes || []).length === 0 && (
          <p style={{ fontSize: 13, color: '#a7a49c' }}>Nenhuma atualização postada ainda.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(formEdicao.atualizacoes || []).map((item, index) => {
            const removida = atualizacoesParaRemover.includes(index);
            return (
              <div
                key={index}
                style={{
                  border: '1px solid #e4e1db',
                  borderRadius: 10,
                  padding: 16,
                  background: '#fff',
                  opacity: removida ? 0.45 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ fontSize: 13 }}>Atualização {index + 1}</strong>
                  <button
                    type="button"
                    onClick={() => alternarRemocaoAtualizacao(index)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: removida ? '#23262b' : '#c1473c',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 8px',
                    }}
                  >
                    {removida ? '↺ Desfazer exclusão' : '✕ Excluir atualização'}
                  </button>
                </div>

                {!removida && (
                  <>
                    <div style={{ width: 200 }}>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
                        Data
                      </label>
                      <input
                        style={inputStyle}
                        type="date"
                        value={item.data || ''}
                        onChange={(e) =>
                          atualizarCampoAtualizacao(index, 'data', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
                        O que foi feito?
                      </label>
                      <textarea
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        rows={2}
                        maxLength={500}
                        value={item.descricao || ''}
                        onChange={(e) =>
                          atualizarCampoAtualizacao(index, 'descricao', e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
                        Fotos
                      </label>
                      <S.GridImagensExistentes style={{ marginTop: 6 }}>
                        {(item.urls || []).map((url) => {
                          const marcada = fotoDaAtualizacaoMarcada(index, url);
                          return (
                            <S.MiniaturaExistente key={url} $src={url} $marcada={marcada}>
                              <S.BotaoRemoverImagem
                                type="button"
                                $marcada={marcada}
                                onClick={() => alternarRemocaoFotoAtualizacao(index, url)}
                              >
                                {marcada ? 'Desfazer' : 'Remover'}
                              </S.BotaoRemoverImagem>
                            </S.MiniaturaExistente>
                          );
                        })}
                      </S.GridImagensExistentes>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <S.LinhaBotoesEdicao>
        <S.BotaoCancelar type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </S.BotaoCancelar>
        <S.BotaoSalvar type="button" onClick={onSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </S.BotaoSalvar>
      </S.LinhaBotoesEdicao>
    </S.PainelEdicao>
  );
}

const inputStyle = {
  background: '#fbfaf8',
  color: '#23262b',
  border: '1px solid #d9d6cf',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 6,
};