import React, { useState, useEffect } from 'react';
import * as S from './admobras.styles.jsx';
import { supabase } from '../supabaseClient';
import { otimizarArquivo } from '../utils/otimizarImagem.js';
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
  cep: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
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
  const [novasAtualizacoes, setNovasAtualizacoes] = useState([]);

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
    setNovasAtualizacoes([]);
    setErroCodigoObra('');
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao(CAMPOS_VAZIOS);
    setImagensParaRemover([]);
    setNovasImagens([]);
    setAtualizacoesParaRemover([]);
    setFotosAtualizacaoParaRemover([]);
    setNovasAtualizacoes([]);
    setErroCodigoObra('');
  }

  function atualizarCampo(campo, valor) {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  }

  function validarCodigoObra(codigo) {
    const apenasNumeros = codigo.replace(/\D/g, '');
    if (apenasNumeros.length !== 10) {
      setErroCodigoObra('O código deve conter exatamente 10 dígitos (AAAAMMDD + 2 dígitos)');
      return false;
    }

    const ano = parseInt(apenasNumeros.slice(0, 4), 10);
    const mes = parseInt(apenasNumeros.slice(4, 6), 10);
    const dia = parseInt(apenasNumeros.slice(6, 8), 10);

    if (mes < 1 || mes > 12) {
      setErroCodigoObra('Mês inválido no código da obra');
      return false;
    }

    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) {
      setErroCodigoObra('Dia inválido no código da obra');
      return false;
    }

    setErroCodigoObra('');
    return true;
  }

 function handleCodigoObraChange(valor) {
    let apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length > 10) apenasNumeros = apenasNumeros.slice(0, 10);

    setCodigoObraEditando(apenasNumeros);

    if (apenasNumeros.length === 10) {
      validarCodigoObra(apenasNumeros);
    } else {
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

 async function adicionarNovaImagem(file) {
    if (!file) return;
    const LIMITE_MB = 15;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      toastError(`O arquivo deve ter no máximo ${LIMITE_MB}MB.`);
      return;
    }

    try {
      const arquivoProcessado = await otimizarArquivo(file);
      setNovasImagens((prev) => [...prev, arquivoProcessado]);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      toastError('Erro ao processar a imagem selecionada.');
    }
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

  function adicionarNovaAtualizacao() {
    setNovasAtualizacoes((prev) => [
      ...prev,
      { data: '', descricao: '', arquivos: [] },
    ]);
  }

  function atualizarNovaAtualizacao(index, campo, valor) {
    setNovasAtualizacoes((prev) => {
      const atualizacoes = [...prev];
      atualizacoes[index] = { ...atualizacoes[index], [campo]: valor };
      return atualizacoes;
    });
  }

 async function adicionarFotosNovaAtualizacao(index, files) {
    const arquivos = Array.from(files || []);
    if (arquivos.length === 0) return;

    const LIMITE_MB = 15;
    const validos = arquivos.filter((arquivo) => {
      if (arquivo.size / (1024 * 1024) > LIMITE_MB) {
        toastError(`O arquivo "${arquivo.name}" deve ter no máximo ${LIMITE_MB}MB.`);
        return false;
      }
      return true;
    });

    try {
      const processados = await Promise.all(validos.map((arq) => otimizarArquivo(arq)));
      setNovasAtualizacoes((prev) => {
        const atualizacoes = [...prev];
        atualizacoes[index] = {
          ...atualizacoes[index],
          arquivos: [...(atualizacoes[index].arquivos || []), ...processados],
        };
        return atualizacoes;
      });
    } catch (err) {
      console.error('Erro ao processar arquivos da atualização:', err);
      toastError('Erro ao processar imagens selecionadas.');
    }
  }

  function removerFotoNovaAtualizacao(atualizacaoIndex, fotoIndex) {
    setNovasAtualizacoes((prev) => {
      const atualizacoes = [...prev];
      atualizacoes[atualizacaoIndex] = {
        ...atualizacoes[atualizacaoIndex],
        arquivos: atualizacoes[atualizacaoIndex].arquivos.filter((_, i) => i !== fotoIndex),
      };
      return atualizacoes;
    });
  }

  function removerNovaAtualizacao(index) {
    setNovasAtualizacoes((prev) => prev.filter((_, i) => i !== index));
  }

  async function buscarCep(cepDigitado) {
  const cepLimpo = cepDigitado.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await res.json();

    if (!data.erro) {
      setFormEdicao((prev) => ({
        ...prev,
        cep: cepDigitado,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        uf: data.uf || prev.uf,
      }));
    }
  } catch (err) {
    console.error("Erro ao procurar CEP:", err);
  }
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

    const novaAtualizacaoInvalida = novasAtualizacoes.some(
      (item) => !item.data || !item.descricao?.trim() || !(item.arquivos || []).length
    );

    if (novaAtualizacaoInvalida) {
      showError(
        'Atenção',
        'Preencha a data, a descrição e adicione pelo menos uma foto em todas as novas atualizações.'
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

      const novasAtualizacoesSalvas = [];

      for (const atualizacao of novasAtualizacoes) {
        const urls = [];

        for (const arquivo of atualizacao.arquivos || []) {
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
          urls.push(urlData.publicUrl);
        }

        novasAtualizacoesSalvas.push({
          data: atualizacao.data,
          descricao: atualizacao.descricao.trim(),
          urls,
        });
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

      const atualizacoesExistentesFinal = (formEdicao.atualizacoes || [])
        .map((item, index) => ({ item, index }))
        .filter(({ index }) => !atualizacoesParaRemover.includes(index))
        .map(({ item, index }) => ({
          ...item,
          urls: (item.urls || []).filter((url) => !fotoDaAtualizacaoMarcada(index, url)),
        }));

      const atualizacoesFinal = [
        ...atualizacoesExistentesFinal,
        ...novasAtualizacoesSalvas,
      ];

      const { error: erroUpdate } = await supabase
        .from('obras')
  .update({
    codigo_obra: formEdicao.codigo_obra,
    nome_obra: formEdicao.nome_obra,
    tipo_obra: formEdicao.tipo_obra,
    nome_proprietario: formEdicao.nome_proprietario,
    cpf_proprietario: formEdicao.cpf_proprietario,
    telefone_proprietario: formEdicao.telefone_proprietario,
    cep: formEdicao.cep,
    endereco: formEdicao.endereco,
    numero: formEdicao.numero,
    bairro: formEdicao.bairro,
    cidade: formEdicao.cidade,
    uf: formEdicao.uf,
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
          buscarCep={buscarCep}
          adicionarNovaImagem={adicionarNovaImagem}
          removerNovaImagem={removerNovaImagem}
          atualizacoesParaRemover={atualizacoesParaRemover}
          alternarRemocaoAtualizacao={alternarRemocaoAtualizacao}
          fotoDaAtualizacaoMarcada={fotoDaAtualizacaoMarcada}
          alternarRemocaoFotoAtualizacao={alternarRemocaoFotoAtualizacao}
          atualizarCampoAtualizacao={atualizarCampoAtualizacao}
          novasAtualizacoes={novasAtualizacoes}
          adicionarNovaAtualizacao={adicionarNovaAtualizacao}
          atualizarNovaAtualizacao={atualizarNovaAtualizacao}
          adicionarFotosNovaAtualizacao={adicionarFotosNovaAtualizacao}
          removerFotoNovaAtualizacao={removerFotoNovaAtualizacao}
          removerNovaAtualizacao={removerNovaAtualizacao}
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
  novasAtualizacoes,
  adicionarNovaAtualizacao,
  atualizarNovaAtualizacao,
  adicionarFotosNovaAtualizacao,
  removerFotoNovaAtualizacao,
  removerNovaAtualizacao,
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

  // Controla quais atualizações estão abertas no acordeão.
  const [atualizacoesAbertas, setAtualizacoesAbertas] = useState({});

  function alternarAtualizacaoAberta(chave) {
    setAtualizacoesAbertas((prev) => ({
      ...prev,
      [chave]: !prev[chave],
    }));
  }

  // Controla quais seções principais estão abertas.
  const [secoesAbertas, setSecoesAbertas] = useState({
    identificacao: true,
    proprietario: false,
    localizacao: false,
    descricao: false,
    imagens: false,
    atualizacoes: false,
  });

  function alternarSecao(chave) {
    setSecoesAbertas((prev) => ({
      ...prev,
      [chave]: !prev[chave],
    }));
  }

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
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          disabled={salvando}
          onClick={() => alternarSecao('identificacao')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid #e4e1db',
            borderRadius: secoesAbertas.identificacao
              ? '8px 8px 0 0'
              : 8,
            background: '#f5f4f0',
            color: '#23262b',
            cursor: salvando ? 'default' : 'pointer',
            textAlign: 'left',
          }}
        >
          <span>{secoesAbertas.identificacao ? '▼' : '▶'}</span>

          <strong style={{ flex: 1, fontSize: 13 }}>
            Identificação
          </strong>

          {!secoesAbertas.identificacao && (
            <span
              style={{
                fontSize: 12,
                color: '#8a8780',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}
            >
              {formEdicao.nome_obra || 'Código e tipo da obra'}
            </span>
          )}
        </button>

        {secoesAbertas.identificacao && (
          <div
            style={{
              border: '1px solid #e4e1db',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Código da Obra (10 dígitos: AAAAMMDD + 2 dígitos)
                </label>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <input
                      style={{
                        ...inputStyle,
                        borderColor: erroCodigoObra
                          ? '#b3453d'
                          : 'inherit',
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength="10"
                      disabled={salvando}
                      value={codigoObraEditando}
                      onChange={(e) =>
                        handleCodigoObraChange(e.target.value)
                      }
                      placeholder="Ex: 2026040101"
                    />

                    {erroCodigoObra && (
                      <div
                        style={{
                          color: '#b3453d',
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        {erroCodigoObra}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: 12,
                        color: '#6e7178',
                        marginTop: 4,
                      }}
                    >
                      {codigoObraEditando.length}/10 dígitos
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={tentarAlterarCodigo}
                    disabled={salvando}
                    style={{
                      padding: '10px 16px',
                      background:
                        codigoObraEditando !== codigoObraAntigo
                          ? '#ffb83c'
                          : '#e6e3da',
                      border: 'none',
                      borderRadius: 6,
                      cursor:
                        codigoObraEditando !== codigoObraAntigo
                          ? 'pointer'
                          : 'default',
                      fontSize: 14,
                      fontWeight: 600,
                      color:
                        codigoObraEditando !== codigoObraAntigo
                          ? '#fff'
                          : '#a7a49c',
                      alignSelf: 'flex-start',
                      marginTop: 6,
                    }}
                  >
                    Alterar
                  </button>
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Nome da Obra
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.nome_obra}
                  onChange={(e) =>
                    atualizarCampo('nome_obra', e.target.value)
                  }
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Tipo
                </label>

                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    paddingTop: 10,
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      disabled={salvando}
                      checked={formEdicao.tipo_obra === 'construcao'}
                      onChange={() =>
                        atualizarCampo('tipo_obra', 'construcao')
                      }
                    />
                    Construção
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      disabled={salvando}
                      checked={formEdicao.tipo_obra === 'reforma'}
                      onChange={() =>
                        atualizarCampo('tipo_obra', 'reforma')
                      }
                    />
                    Reforma
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          disabled={salvando}
          onClick={() => alternarSecao('proprietario')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid #e4e1db',
            borderRadius: secoesAbertas.proprietario
              ? '8px 8px 0 0'
              : 8,
            background: '#f5f4f0',
            color: '#23262b',
            cursor: salvando ? 'default' : 'pointer',
            textAlign: 'left',
          }}
        >
          <span>{secoesAbertas.proprietario ? '▼' : '▶'}</span>

          <strong style={{ flex: 1, fontSize: 13 }}>
            Proprietário
          </strong>

          {!secoesAbertas.proprietario && (
            <span
              style={{
                fontSize: 12,
                color: '#8a8780',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}
            >
              {formEdicao.nome_proprietario || 'Dados do proprietário'}
            </span>
          )}
        </button>

        {secoesAbertas.proprietario && (
          <div
            style={{
              border: '1px solid #e4e1db',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Nome do Proprietário
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.nome_proprietario}
                  onChange={(e) =>
                    atualizarCampo('nome_proprietario', e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  CPF
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  maxLength={14}
                  disabled={salvando}
                  value={formEdicao.cpf_proprietario}
                  onChange={(e) =>
                    atualizarCampo(
                      'cpf_proprietario',
                      mascaraCPF(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Telefone
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  maxLength={15}
                  disabled={salvando}
                  value={formEdicao.telefone_proprietario}
                  onChange={(e) =>
                    atualizarCampo(
                      'telefone_proprietario',
                      mascaraTelefone(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

   

      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          disabled={salvando}
          onClick={() => alternarSecao('localizacao')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid #e4e1db',
            borderRadius: secoesAbertas.localizacao
              ? '8px 8px 0 0'
              : 8,
            background: '#f5f4f0',
            color: '#23262b',
            cursor: salvando ? 'default' : 'pointer',
            textAlign: 'left',
          }}
        >
          <span>{secoesAbertas.localizacao ? '▼' : '▶'}</span>

          <strong style={{ flex: 1, fontSize: 13 }}>
            Localização
          </strong>

          {!secoesAbertas.localizacao && (
            <span
              style={{
                fontSize: 12,
                color: '#8a8780',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}
            >
              {[formEdicao.endereco, formEdicao.numero, formEdicao.bairro, formEdicao.cidade]
                .filter(Boolean)
                .join(' - ') || 'Endereço da obra'}
            </span>
          )}
        </button>

        {secoesAbertas.localizacao && (
          <div
            style={{
              border: '1px solid #e4e1db',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
              }}
            >
              {/* CEP */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  CEP
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  maxLength={9}
                  disabled={salvando}
                  value={formEdicao.cep || ''}
                  onChange={(e) =>
                    atualizarCampo('cep', e.target.value)
                  }
                  onBlur={(e) => buscarCep(e.target.value)}
                  placeholder="00000-000"
                />
              </div>

              {/* Rua / Endereço */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Rua / Logradouro
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.endereco || ''}
                  onChange={(e) =>
                    atualizarCampo('endereco', e.target.value)
                  }
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              {/* Número */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Número
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.numero || ''}
                  onChange={(e) =>
                    atualizarCampo('numero', e.target.value)
                  }
                  placeholder="Ex: 123 ou S/N"
                />
              </div>

              {/* Bairro */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Bairro
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.bairro || ''}
                  onChange={(e) =>
                    atualizarCampo('bairro', e.target.value)
                  }
                />
              </div>

              {/* Cidade */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  Cidade
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  disabled={salvando}
                  value={formEdicao.cidade || ''}
                  onChange={(e) =>
                    atualizarCampo('cidade', e.target.value)
                  }
                />
              </div>

              {/* UF */}
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#4b4e54',
                  }}
                >
                  UF
                </label>

                <input
                  style={inputStyle}
                  type="text"
                  maxLength={2}
                  disabled={salvando}
                  value={formEdicao.uf || ''}
                  onChange={(e) =>
                    atualizarCampo('uf', e.target.value.toUpperCase())
                  }
                  placeholder="SP"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
  <button
    type="button"
    disabled={salvando}
    onClick={() => alternarSecao('imagens')}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      border: '1px solid #e4e1db',
      borderRadius: secoesAbertas.imagens
        ? '8px 8px 0 0'
        : 8,
      background: '#f5f4f0',
      color: '#23262b',
      cursor: salvando ? 'default' : 'pointer',
      textAlign: 'left',
    }}
  >
    <span>
      {secoesAbertas.imagens ? '▼' : '▶'}
    </span>

    <strong style={{ flex: 1, fontSize: 13 }}>
      Fotos da Obra
    </strong>

    {!secoesAbertas.imagens && (
      <span
        style={{
          fontSize: 12,
          color: '#8a8780',
        }}
      >
        {(formEdicao.imagens || []).length} foto(s)
      </span>
    )}
  </button>

  {secoesAbertas.imagens && (
    <div
      style={{
        border: '1px solid #e4e1db',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        padding: 14,
      }}
    >
      <div
  style={{
    fontSize: 12,
    color: '#6e7178',
    marginBottom: 12,
  }}
>
  A primeira foto é usada como capa da obra.
  Arraste as fotos para reorganizar e coloque a foto desejada na primeira posição.
</div>

      <S.GridImagensExistentes>
        {(formEdicao.imagens || []).map((url, index) => {
          const marcada = imagensParaRemover.includes(url);
          const ehCapa = index === 0;

          return (
            <div
              key={url}
              draggable={!salvando && !marcada}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              style={{
                position: 'relative',
                border: ehCapa
                  ? '2px solid #ffb83c'
                  : '1px solid #e4e1db',
                borderRadius: 8,
                padding: 5,
                background: '#fff',
                opacity: marcada ? 0.45 : 1,
                cursor: salvando ? 'default' : 'grab',
              }}
            >
              <S.MiniaturaExistente
                $src={url}
                $marcada={marcada}
              />

              {ehCapa && !marcada && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: '#ffb83c',
                    color: '#fff',
                    padding: '4px 7px',
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ★ CAPA
                </div>
              )}

            

              {marcada && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.65)',
                    borderRadius: 8,
                  }}
                >
                  <button
                    type="button"
                    disabled={salvando}
                    onClick={() =>
                      alternarRemocaoImagem(url)
                    }
                    style={{
                      border: 'none',
                      borderRadius: 5,
                      padding: '6px 10px',
                      background: '#23262b',
                      color: '#fff',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Desfazer remoção
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </S.GridImagensExistentes>

      <div style={{ marginTop: 16 }}>
        <label
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: '#4b4e54',
          }}
        >
          Adicionar novas fotos
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          disabled={salvando}
          style={{
            ...inputStyle,
            padding: 8,
          }}
          onChange={(e) => {
            Array.from(e.target.files || []).forEach(
              (file) => adicionarNovaImagem(file)
            );

            e.target.value = '';
          }}
        />
      </div>

      {novasImagens.length > 0 && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: '#6e7178',
          }}
        >
          {novasImagens.length} nova(s) foto(s) aguardando
          para serem salvas.
        </div>
      )}
    </div>
  )}
</div>

      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          disabled={salvando}
          onClick={() => alternarSecao('atualizacoes')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid #e4e1db',
            borderRadius: secoesAbertas.atualizacoes
              ? '8px 8px 0 0'
              : 8,
            background: '#f5f4f0',
            color: '#23262b',
            cursor: salvando ? 'default' : 'pointer',
            textAlign: 'left',
          }}

        >
          <span>{secoesAbertas.atualizacoes ? '▼' : '▶'}</span>

          <strong style={{ flex: 1, fontSize: 13 }}>
            Atualizações da Obra
          </strong>

          {!secoesAbertas.atualizacoes && (
            <span
              style={{
                fontSize: 12,
                color: '#8a8780',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}
            >
              {`${(formEdicao.atualizacoes || []).length} atualização(ões)`}
            </span>
          )}
        </button>

        {secoesAbertas.atualizacoes && (
          <div
            style={{
              border: '1px solid #e4e1db',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: 14,
            }}
          >

                        <div>
              <S.TituloLista
                style={{
                  fontSize: 13,
                  color: '#6e7178',
                  marginBottom: 10,
                }}
              >
                Atualizações da Obra (postadas pelo cliente/equipe)
              </S.TituloLista>

              {(formEdicao.atualizacoes || []).length === 0 && (
                <p
                  style={{
                    fontSize: 13,
                    color: '#a7a49c',
                  }}
                >
                  Nenhuma atualização postada ainda.
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {(formEdicao.atualizacoes || []).map((item, index) => {
                  const removida =
                    atualizacoesParaRemover.includes(index);

                  const chave = `existente-${index}`;

                  const aberta =
                    !!atualizacoesAbertas[chave];

                  const descricaoResumo =
                    (item.descricao || '').trim();

                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid #e4e1db',
                        borderRadius: 10,
                        background: '#fff',
                        opacity: removida ? 0.45 : 1,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 14px',
                        }}
                      >
                        <button
                          type="button"
                          disabled={salvando || removida}
                          onClick={() =>
                            alternarAtualizacaoAberta(chave)
                          }
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: 'none',
                            background: aberta
                              ? '#faf9f6'
                              : 'transparent',
                            borderRadius: 7,
                            padding: '7px 8px',
                            margin: '-7px 0 -7px -8px',
                            textAlign: 'left',
                            cursor:
                              salvando || removida
                                ? 'default'
                                : 'pointer',
                            color: '#23262b',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              width: 18,
                              flex: '0 0 18px',
                              textAlign: 'center',
                              color: '#6e7178',
                            }}
                          >
                            {aberta ? '▼' : '▶'}
                          </span>

                          <strong
                            style={{
                              fontSize: 13,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Atualização {index + 1}
                          </strong>

                          <span
                            style={{
                              fontSize: 12,
                              color: '#6e7178',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.data
                              ? new Date(
                                  `${item.data}T12:00:00`
                                ).toLocaleDateString('pt-BR')
                              : 'Sem data'}
                          </span>

                          {descricaoResumo && (
                            <span
                              style={{
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: 12,
                                color: '#8a8780',
                              }}
                            >
                              — {descricaoResumo}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={salvando}
                          onClick={() =>
                            alternarRemocaoAtualizacao(index)
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: removida
                              ? '#23262b'
                              : '#c1473c',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '4px 8px',
                          }}
                        >
                          {removida
                            ? '↺ Desfazer exclusão'
                            : '✕ Excluir'}
                        </button>
                      </div>

                      {removida && (
                        <div
                          style={{
                            padding: '0 14px 12px 42px',
                            fontSize: 12,
                            color: '#a7a49c',
                          }}
                        >
                          Esta atualização será excluída ao salvar.
                        </div>
                      )}

                      {!removida && aberta && (
                        <div
                          style={{
                            borderTop: '1px solid #eeeae3',
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                          }}
                        >
                          <div style={{ width: 200 }}>
                            <label
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: '#4b4e54',
                              }}
                            >
                              Data
                            </label>

                            <input
                              style={inputStyle}
                              type="date"
                              disabled={salvando}
                              value={item.data || ''}
                              onChange={(e) =>
                                atualizarCampoAtualizacao(
                                  index,
                                  'data',
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: '#4b4e54',
                              }}
                            >
                              O que foi feito?
                            </label>

                            <textarea
                              style={{
                                ...inputStyle,
                                resize: 'vertical',
                                fontFamily: 'inherit',
                              }}
                              rows={2}
                              maxLength={500}
                              disabled={salvando}
                              value={item.descricao || ''}
                              onChange={(e) =>
                                atualizarCampoAtualizacao(
                                  index,
                                  'descricao',
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: '#4b4e54',
                              }}
                            >
                              Fotos
                            </label>

                            <S.GridImagensExistentes
                              style={{ marginTop: 6 }}
                            >
                              {(item.urls || []).map((url) => {
                                const marcada =
                                  fotoDaAtualizacaoMarcada(
                                    index,
                                    url
                                  );

                                return (
                                  <S.MiniaturaExistente
                                    key={url}
                                    $src={url}
                                    $marcada={marcada}
                                  >
                                    <S.BotaoRemoverImagem
                                      type="button"
                                      $marcada={marcada}
                                      disabled={salvando}
                                      onClick={() =>
                                        alternarRemocaoFotoAtualizacao(
                                          index,
                                          url
                                        )
                                      }
                                    >
                                      {marcada
                                        ? 'Desfazer'
                                        : 'Remover'}
                                    </S.BotaoRemoverImagem>
                                  </S.MiniaturaExistente>
                                );
                              })}
                            </S.GridImagensExistentes>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: '1px dashed #d9d6cf',
                }}
              >
                {novasAtualizacoes.map((item, index) => {
                  const chave = `nova-${index}`;

                  const aberta =
                    atualizacoesAbertas[chave] !== false;

                  return (
                    <div
                      key={`nova-atualizacao-${index}`}
                      style={{
                        marginTop: 10,
                        border: '1px solid #d9d6cf',
                        borderRadius: 10,
                        background: '#fbfaf8',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 14px',
                        }}
                      >
                        <button
                          type="button"
                          disabled={salvando}
                          onClick={() =>
                            alternarAtualizacaoAberta(chave)
                          }
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: 'none',
                            background: aberta
                              ? '#f5f4f0'
                              : 'transparent',
                            borderRadius: 7,
                            padding: '7px 8px',
                            margin: '-7px 0 -7px -8px',
                            textAlign: 'left',
                            cursor: salvando
                              ? 'default'
                              : 'pointer',
                            color: '#23262b',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              width: 18,
                              flex: '0 0 18px',
                              textAlign: 'center',
                              color: '#6e7178',
                            }}
                          >
                            {aberta ? '▼' : '▶'}
                          </span>

                          <strong
                            style={{
                              fontSize: 13,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Atualização{' '}
                            {(formEdicao.atualizacoes || []).length +
                              index +
                              1}
                          </strong>

                          <span
                            style={{
                              fontSize: 12,
                              color: '#6e7178',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.data
                              ? new Date(
                                  `${item.data}T12:00:00`
                                ).toLocaleDateString('pt-BR')
                              : 'Nova atualização'}
                          </span>

                          {item.descricao?.trim() && (
                            <span
                              style={{
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: 12,
                                color: '#8a8780',
                              }}
                            >
                              — {item.descricao.trim()}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={salvando}
                          onClick={() =>
                            removerNovaAtualizacao(index)
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#c1473c',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: salvando
                              ? 'default'
                              : 'pointer',
                            padding: '4px 8px',
                          }}
                        >
                          ✕ Remover
                        </button>
                      </div>

                      {aberta && (
                        <div
                          style={{
                            borderTop: '1px solid #e4e1db',
                            padding: 16,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12,
                            }}
                          >
                            <div style={{ width: 200 }}>
                              <label
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: '#4b4e54',
                                }}
                              >
                                Data
                              </label>

                              <input
                                style={inputStyle}
                                type="date"
                                disabled={salvando}
                                value={item.data || ''}
                                onChange={(e) =>
                                  atualizarNovaAtualizacao(
                                    index,
                                    'data',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: '#4b4e54',
                                }}
                              >
                                O que foi feito?
                              </label>

                              <textarea
                                style={{
                                  ...inputStyle,
                                  resize: 'vertical',
                                  fontFamily: 'inherit',
                                }}
                                rows={3}
                                maxLength={500}
                                disabled={salvando}
                                value={item.descricao || ''}
                                onChange={(e) =>
                                  atualizarNovaAtualizacao(
                                    index,
                                    'descricao',
                                    e.target.value
                                  )
                                }
                                placeholder="Descreva o andamento da obra..."
                              />
                            </div>

                            <div>
                              <label
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: '#4b4e54',
                                }}
                              >
                                Fotos
                              </label>

                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={salvando}
                                style={{
                                  ...inputStyle,
                                  padding: 8,
                                }}
                                onChange={(e) => {
                                  adicionarFotosNovaAtualizacao(
                                    index,
                                    e.target.files
                                  );
                                  e.target.value = '';
                                }}
                              />

                              {(item.arquivos || []).length > 0 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 7,
                                    marginTop: 8,
                                  }}
                                >
                                  {item.arquivos.map(
                                    (arquivo, fotoIndex) => (
                                      <div
                                        key={`${arquivo.name}-${arquivo.lastModified}-${fotoIndex}`}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent:
                                            'space-between',
                                          gap: 10,
                                          padding: '7px 9px',
                                          background: '#fff',
                                          border:
                                            '1px solid #e4e1db',
                                          borderRadius: 6,
                                          fontSize: 12,
                                        }}
                                      >
                                        <span
                                          style={{
                                            overflow: 'hidden',
                                            textOverflow:
                                              'ellipsis',
                                          }}
                                        >
                                          📎 {arquivo.name}
                                        </span>

                                        <button
                                          type="button"
                                          disabled={salvando}
                                          onClick={() =>
                                            removerFotoNovaAtualizacao(
                                              index,
                                              fotoIndex
                                            )
                                          }
                                          style={{
                                            border: 'none',
                                            background:
                                              'transparent',
                                            color: '#c1473c',
                                            cursor: salvando
                                              ? 'default'
                                              : 'pointer',
                                          }}
                                        >
                                          Remover
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  disabled={salvando}
                  onClick={adicionarNovaAtualizacao}
                  style={{
                    border: '1px solid #c9c5bb',
                    background: '#fbfaf8',
                    color: '#23262b',
                    borderRadius: 7,
                    padding: '9px 14px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: salvando
                      ? 'default'
                      : 'pointer',
                    marginTop: 10,
                  }}
                >
                  + Adicionar atualização
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <S.LinhaBotoesEdicao>
        <S.BotaoCancelar
          type="button"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </S.BotaoCancelar>

        <S.BotaoSalvar
          type="button"
          onClick={onSalvar}
          disabled={salvando}
        >
          {salvando
            ? 'Salvando...'
            : 'Salvar alterações'}
        </S.BotaoSalvar>
      </S.LinhaBotoesEdicao>
    </S.PainelEdicao>
  );
}