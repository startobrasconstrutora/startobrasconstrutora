import React, { useState, useEffect } from 'react';
import * as S from './admobras.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone, caminhoDoStorage } from './mascaras';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  confirmDelete,
  showError,
} from '../utils/alert.js';

const CAMPOS_VAZIOS = {
  codigo_obra: '',
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

  const [atualizacoesParaRemover, setAtualizacoesParaRemover] = useState([]);
  const [fotosAtualizacaoParaRemover, setFotosAtualizacaoParaRemover] = useState([]);

  const [salvando, setSalvando] = useState(false);

  // Estado para controlar a mudança de código_obra
  const [codigoObraAntigo, setCodigoObraAntigo] = useState('');
  const [codigoObraEditando, setCodigoObraEditando] = useState('');
  const [erroCodigoObra, setErroCodigoObra] = useState('');

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

  function iniciarEdicao(obra) {
    setEditandoId(obra.id);
    setFormEdicao({ ...CAMPOS_VAZIOS, ...obra });
    setCodigoObraAntigo(obra.codigo_obra || '');
    setCodigoObraEditando(obra.codigo_obra || '');
    setImagensParaRemover([]);
    setNovasImagens([]);
    setAtualizacoesParaRemover([]);
    setFotosAtualizacaoParaRemover([]);
    setErroCodigoObra('');
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao(CAMPOS_VAZIOS);
    setImagensParaRemover([]);
    setNovasImagens([]);
    setAtualizacoesParaRemover([]);
    setFotosAtualizacaoParaRemover([]);
    setErroCodigoObra('');
  }

  function atualizarCampo(campo, valor) {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  }

  function validarCodigoObra(codigo) {
    const apenasNumeros = codigo.replace(/\D/g, '');
    if (apenasNumeros.length < 4 || apenasNumeros.length > 10) {
      setErroCodigoObra('O código deve conter entre 4 e 10 dígitos numéricos');
      return false;
    }
    setErroCodigoObra('');
    return true;
  }

  function handleCodigoObraChange(valor) {
    let apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length > 10) apenasNumeros = apenasNumeros.slice(0, 10);

    setCodigoObraEditando(apenasNumeros);

    if (apenasNumeros.length >= 4 && apenasNumeros.length <= 10) {
      setErroCodigoObra('');
    }
  }

  async function tentarAlterarCodigo() {
    if (!validarCodigoObra(codigoObraEditando)) {
      return;
    }

    if (codigoObraEditando !== codigoObraAntigo) {
      const res = await confirmDelete(
        `alterar o código da obra de "${codigoObraAntigo}" para "${codigoObraEditando}"`
      );
      if (res.isConfirmed) {
        atualizarCampo('codigo_obra', codigoObraEditando);
        toastSuccess('Código da obra alterado no formulário!');
      } else {
        setCodigoObraEditando(codigoObraAntigo);
      }
    }
  }

  function alternarRemocaoImagem(url) {
    setImagensParaRemover((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  }

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
      toastError(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
      return;
    }
    setNovasImagens((prev) => [...prev, file]);
  }

  function removerNovaImagem(index) {
    setNovasImagens((prev) => prev.filter((_, i) => i !== index));
  }

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
    const atualizacoesInvalidas = (formEdicao.atualizacoes || []).some((item, index) => {
      if (atualizacoesParaRemover.includes(index)) return false;
      const urlsRestantes = (item.urls || []).filter(
        (url) => !fotoDaAtualizacaoMarcada(index, url)
      );
      return urlsRestantes.length === 0;
    });

    if (atualizacoesInvalidas) {
      showError(
        'Atenção',
        'Uma atualização ficaria sem nenhuma foto. Restaure uma foto ou exclua a atualização inteira.'
      );
      return;
    }

    setSalvando(true);
    showLoading('Salvando alterações...');

    try {
      const urlsNovas = [];
      for (const arquivo of novasImagens) {
        const extensao = arquivo.name.split('.').pop().toLowerCase();
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
          console.error('Erro ao remover imagens do Storage:', erroRemocao);
        }
      }

      const imagensFinal = (formEdicao.imagens || [])
        .filter((url) => !imagensParaRemover.includes(url))
        .concat(urlsNovas);

      const atualizacoesFinal = (formEdicao.atualizacoes || [])
        .map((item, index) => ({ item, index }))
        .filter(({ index }) => !atualizacoesParaRemover.includes(index))
        .map(({ item, index }) => ({
          ...item,
          urls: (item.urls || []).filter((url) => !fotoDaAtualizacaoMarcada(index, url)),
        }));

      const { error: erroUpdate } = await supabase
        .from('obras')
        .update({
          codigo_obra: formEdicao.codigo_obra,
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

      hideLoading();
      toastSuccess('Obra atualizada com sucesso!');
      await buscarObras();
      cancelarEdicao();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao salvar edição:', erro);
      showError('Erro ao salvar', 'Verifique o console para detalhes.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluirObra(obra) {
    const result = await confirmDelete(`a obra "${obra.nome_obra}"`);
    if (!result.isConfirmed) return;

    showLoading('Excluindo obra...');

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

      hideLoading();
      toastSuccess('Obra excluída com sucesso!');
      await buscarObras();
      setSelecionados((prev) => prev.filter((id) => id !== obra.id));
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir obra:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes.');
    }
  }

  async function excluirSelecionados() {
    if (selecionados.length === 0) return;

    const result = await confirmDelete(`${selecionados.length} obra(s)`);
    if (!result.isConfirmed) return;

    setExcluindoSelecao(true);
    showLoading('Excluindo obras...');

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

      hideLoading();
      toastSuccess(`${selecionados.length} obra(s) excluída(s) com sucesso!`);
      setSelecionados([]);
      await buscarObras();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir selecionados:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes.');
    } finally {
      setExcluindoSelecao(false);
    }
  }

  const obraSendoEditada = obras.find((o) => o.id === editandoId);

  return (
    <S.Wrapper>
      {!editandoId && (
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
              🗑️ Excluir Itens Selecionados ({selecionados.length})
            </S.BotaoPequeno>
          </S.AcoesLista>
        </S.CabecalhoLista>
      )}

      {erro && <S.Aviso $erro>{erro}</S.Aviso>}
      {carregando && <S.Aviso>Carregando obras...</S.Aviso>}

      {!carregando && obras.length === 0 && !erro && (
        <S.VazioLista>Nenhuma obra cadastrada ainda.</S.VazioLista>
      )}

      {editandoId && obraSendoEditada ? (
        <FormularioEdicao
          obra={obraSendoEditada}
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
          onSalvar={() => salvarEdicao(obraSendoEditada.id)}
          onCancelar={cancelarEdicao}
          codigoObraEditando={codigoObraEditando}
          handleCodigoObraChange={handleCodigoObraChange}
          tentarAlterarCodigo={tentarAlterarCodigo}
          codigoObraAntigo={codigoObraAntigo}
          erroCodigoObra={erroCodigoObra}
        />
      ) : (
        !carregando && (
          <S.Grid>
            {obras.map((obra) => (
              <CardObra
                key={obra.id}
                obra={obra}
                selecionado={selecionados.includes(obra.id)}
                onToggleSelecionado={() => toggleSelecionado(obra.id)}
                onEditar={() => iniciarEdicao(obra)}
                onExcluir={() => excluirObra(obra)}
              />
            ))}
          </S.Grid>
        )
      )}
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
            {obra.codigo_obra || 'N/A'}
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
  codigoObraEditando,
  handleCodigoObraChange,
  tentarAlterarCodigo,
  codigoObraAntigo,
  erroCodigoObra,
}) {
  const [indiceArrastando, setIndiceArrastando] = useState(null);
  const [indiceSobre, setIndiceSobre] = useState(null);

  function handleDragStart(index) {
    setIndiceArrastando(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
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
        {obra.codigo_obra} — Editando: {obra.nome_obra || '(sem nome)'}
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
              Código da Obra (10 dígitos)
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <div style={{ flex: 1 }}>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: erroCodigoObra ? '#b3453d' : 'inherit',
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength="10"
                  disabled={salvando}
                  value={codigoObraEditando}
                  onChange={(e) => handleCodigoObraChange(e.target.value)}
                  placeholder="1234567890"
                />
                {erroCodigoObra && (
                  <div style={{ color: '#b3453d', fontSize: 12, marginTop: 4 }}>
                    {erroCodigoObra}
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#6e7178', marginTop: 4 }}>
                  {codigoObraEditando.length}/10 dígitos
                </div>
              </div>
              <button
                type="button"
                onClick={tentarAlterarCodigo}
                disabled={salvando}
                style={{
                  padding: '10px 16px',
                  background: codigoObraEditando !== codigoObraAntigo ? '#ffb83c' : '#e6e3da',
                  border: 'none',
                  borderRadius: 6,
                  cursor: codigoObraEditando !== codigoObraAntigo ? 'pointer' : 'default',
                  fontSize: 14,
                  fontWeight: 600,
                  color: codigoObraEditando !== codigoObraAntigo ? '#fff' : '#a7a49c',
                  alignSelf: 'flex-start',
                  marginTop: 6,
                }}
              >
                Alterar
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
              Nome da Obra
            </label>
            <input
              style={inputStyle}
              type="text"
              disabled={salvando}
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
                  disabled={salvando}
                  checked={formEdicao.tipo_obra === 'construcao'}
                  onChange={() => atualizarCampo('tipo_obra', 'construcao')}
                />
                Construção
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="radio"
                  disabled={salvando}
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
              disabled={salvando}
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
              disabled={salvando}
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
              disabled={salvando}
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
              disabled={salvando}
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
              disabled={salvando}
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
              disabled={salvando}
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
          disabled={salvando}
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
                $src={url}$marcada={marcada}
                $arrastando={indiceArrastando === index}$sobre={indiceSobre === index && indiceArrastando !== index}
                draggable={!marcada && !salvando}
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
                  disabled={salvando}
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
              <button type="button" disabled={salvando} onClick={() => removerNovaImagem(index)}>
                Remover
              </button>
            </div>
          ))}
          <input
            type="file"
            accept="image/*"
            disabled={salvando}
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
                    disabled={salvando}
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
                        disabled={salvando}
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
                        disabled={salvando}
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
                            <S.MiniaturaExistente key={url} $src={url}$marcada={marcada}>
                              <S.BotaoRemoverImagem
                                type="button"
                                $marcada={marcada}
                                disabled={salvando}
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