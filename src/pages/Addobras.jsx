import React, { useState, useEffect, useRef } from 'react';
import * as S from './Addobras.styles.jsx';
import { mascaraCPF, mascaraTelefone } from './mascaras.jsx';
import { supabase } from '../supabaseClient';
import {
  toastSuccess,
  toastError,
  toastWarning,
  showError,
  showLoading,
  hideLoading,
} from '../utils/alert.js';

const ETAPAS_PADRAO = [
  'Fundação',
  'Estrutura',
  'Alvenaria',
  'Cobertura',
  'Instalações Elétricas e Hidráulicas',
  'Reboco / Acabamento',
  'Pintura',
  'Limpeza Final / Entrega',
].map((nome, index) => ({ id: `etapa-${index}`, nome, concluida: false }));

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function novaAtualizacaoVazia() {
  return {
    id: crypto.randomUUID(),
    fotos: [],
    descricao: '',
    data: hojeISO(),
  };
}

/*
 * ============================================================
 * COMPRESSÃO AUTOMÁTICA DE IMAGENS
 * ============================================================
 *
 * Regras:
 * - Máximo de 2000px no maior lado
 * - Mantém a proporção original
 * - Converte para JPEG
 * - Tamanho máximo de 1 MB
 * - Reduz a qualidade automaticamente se necessário
 * - Se mesmo assim passar de 1 MB, reduz as dimensões
 *
 * O usuário não precisa fazer nada.
 */
const MAX_DIMENSAO = 2000;
const MAX_TAMANHO_BYTES = 1024 * 1024; // 1 MB

function carregarImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler a imagem.'));
    };

    img.src = url;
  });
}

function canvasParaBlob(canvas, qualidade) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Não foi possível gerar a imagem comprimida.'));
        }
      },
      'image/jpeg',
      qualidade
    );
  });
}

async function comprimirImagem(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('O arquivo selecionado não é uma imagem válida.');
  }

  const imagem = await carregarImagem(file);

  let largura = imagem.naturalWidth || imagem.width;
  let altura = imagem.naturalHeight || imagem.height;

  /*
   * Mantém a proporção original.
   * Só reduz se alguma dimensão passar de 2000px.
   */
  if (largura > MAX_DIMENSAO || altura > MAX_DIMENSAO) {
    const escala = Math.min(
      MAX_DIMENSAO / largura,
      MAX_DIMENSAO / altura
    );

    largura = Math.round(largura * escala);
    altura = Math.round(altura * escala);
  }

  /*
   * Canvas com fundo branco.
   *
   * Isso evita que imagens PNG com transparência
   * fiquem com fundo preto ao serem convertidas para JPEG.
   */
  const canvas = document.createElement('canvas');
  const contexto = canvas.getContext('2d');

  if (!contexto) {
    throw new Error('Seu navegador não conseguiu preparar a imagem.');
  }

  /*
   * Faz várias tentativas de qualidade.
   * Primeiro tenta uma qualidade alta.
   */
  let qualidade = 0.88;
  let blob = null;

  for (let tentativa = 0; tentativa < 8; tentativa++) {
    canvas.width = largura;
    canvas.height = altura;

    contexto.clearRect(0, 0, largura, altura);

    contexto.fillStyle = '#ffffff';
    contexto.fillRect(0, 0, largura, altura);

    contexto.imageSmoothingEnabled = true;
    contexto.imageSmoothingQuality = 'high';

    contexto.drawImage(
      imagem,
      0,
      0,
      largura,
      altura
    );

    blob = await canvasParaBlob(canvas, qualidade);

    if (blob.size <= MAX_TAMANHO_BYTES) {
      break;
    }

    qualidade -= 0.08;

    if (qualidade < 0.32) {
      qualidade = 0.32;
      break;
    }
  }

  /*
   * Se ainda estiver acima de 1 MB, reduz as dimensões
   * gradualmente até conseguir atingir o limite.
   *
   * Isso garante que o arquivo final não ultrapasse 1 MB.
   */
  while (blob && blob.size > MAX_TAMANHO_BYTES) {
    const novaLargura = Math.max(
      800,
      Math.round(largura * 0.88)
    );

    const novaAltura = Math.max(
      800,
      Math.round(altura * 0.88)
    );

    if (
      novaLargura === largura &&
      novaAltura === altura
    ) {
      break;
    }

    largura = novaLargura;
    altura = novaAltura;

    canvas.width = largura;
    canvas.height = altura;

    contexto.clearRect(0, 0, largura, altura);

    contexto.fillStyle = '#ffffff';
    contexto.fillRect(0, 0, largura, altura);

    contexto.imageSmoothingEnabled = true;
    contexto.imageSmoothingQuality = 'high';

    contexto.drawImage(
      imagem,
      0,
      0,
      largura,
      altura
    );

    blob = await canvasParaBlob(canvas, qualidade);

    /*
     * Se ainda estiver grande, continua reduzindo.
     * A qualidade também pode cair um pouco para garantir
     * que o arquivo fique dentro do limite.
     */
    if (blob.size > MAX_TAMANHO_BYTES && qualidade > 0.28) {
      qualidade = Math.max(0.28, qualidade - 0.04);
    }
  }

  if (!blob) {
    throw new Error('Não foi possível comprimir a imagem.');
  }

  /*
   * Segurança extra:
   * se por algum motivo ainda passar de 1 MB,
   * fazemos uma última compressão.
   */
  if (blob.size > MAX_TAMANHO_BYTES) {
    const qualidadeFinal = 0.22;

    blob = await canvasParaBlob(canvas, qualidadeFinal);
  }

  /*
   * Cria um novo File.
   *
   * O nome termina em .jpg porque o conteúdo agora é JPEG.
   */
  const nomeOriginal = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  const arquivoComprimido = new File(
    [blob],
    `${nomeOriginal}.jpg`,
    {
      type: 'image/jpeg',
      lastModified: Date.now(),
    }
  );

  /*
   * Verificação final.
   *
   * Em condições normais, nunca deve chegar aqui.
   * Mas evita mandar algo maior que 1 MB para o Storage.
   */
  if (arquivoComprimido.size > MAX_TAMANHO_BYTES) {
    throw new Error(
      'Não foi possível reduzir a imagem para menos de 1 MB.'
    );
  }

  return arquivoComprimido;
}

export default function PainelProdutos({
  onAtualizarLista,
  onExcluirSelecionados,
  onFechar,
  onCadastrar,
  itens = [],
}) {
  const [ocultarPrecos, setOcultarPrecos] = useState(false);

  const [codigoObraPersonalizado, setCodigoObraPersonalizado] = useState('');
  const [erroCodigoObra, setErroCodigoObra] = useState('');

  const [nomeObra, setNomeObra] = useState('');
  const [tipoObra, setTipoObra] = useState('construcao');
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cpfProprietario, setCpfProprietario] = useState('');
  const [telefoneProprietario, setTelefoneProprietario] = useState('');

  // Localização
  const [cep, setCep] = useState('');
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Bauru');

  // Autocomplete de Ruas (Nominatim / OSM)
  const [sugestoesRuas, setSugestoesRuas] = useState([]);
  const [carregandoRuas, setCarregandoRuas] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const dropdownRef = useRef(null);

  const [tamanhoTerreno, setTamanhoTerreno] = useState('');
  const [areaConstruida, setAreaConstruida] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');

  const [etapas, setEtapas] = useState(ETAPAS_PADRAO);
  const [descricao, setDescricao] = useState('');
  const [atualizacoes, setAtualizacoes] = useState([
    novaAtualizacaoVazia(),
  ]);

  const [selecionados, setSelecionados] = useState([]);
  const [cadastrando, setCadastrando] = useState(false);

  // Fecha o menu de sugestões de rua se o usuário clicar fora dele
  useEffect(() => {
    function handleClickFora(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMostrarSugestoes(false);
      }
    }

    document.addEventListener('mousedown', handleClickFora);

    return () =>
      document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Busca automática via ViaCEP
  async function buscarCep(valorCep) {
    const cepLimpo = valorCep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    setCarregandoCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await response.json();

      if (!data.erro) {
        if (data.logradouro) {
          setEndereco(data.logradouro);
        }

        if (data.bairro) {
          setBairro(data.bairro);
        }

        if (data.localidade) {
          setCidade(data.localidade);
        }
      } else {
        toastWarning('CEP não encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setCarregandoCep(false);
    }
  }

  function handleCepChange(e) {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.length > 8) {
      valor = valor.slice(0, 8);
    }

    const cepFormatado =
      valor.length > 5
        ? `${valor.slice(0, 5)}-${valor.slice(5)}`
        : valor;

    setCep(cepFormatado);

    if (valor.length === 8) {
      buscarCep(valor);
    }
  }

  // Effect para buscar logradouros via Nominatim com Debounce (400ms)
  useEffect(() => {
    if (
      !endereco ||
      endereco.trim().length < 3 ||
      !mostrarSugestoes
    ) {
      setSugestoesRuas([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCarregandoRuas(true);

      try {
        const url =
          `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(
            endereco
          )}&city=Bauru&state=Sao+Paulo&country=Brazil&format=json&addressdetails=1`;

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'GestaoObrasApp/1.0',
          },
        });

        const data = await response.json();

        setSugestoesRuas(data || []);
      } catch (err) {
        console.error('Erro ao buscar endereços:', err);
      } finally {
        setCarregandoRuas(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [endereco, mostrarSugestoes]);

  function selecionarEndereco(item) {
    const nomeRua =
      item.address.road ||
      item.display_name.split(',')[0];

    const nomeBairro =
      item.address.suburb ||
      item.address.neighbourhood ||
      item.address.residential ||
      '';

    const nomeCidade =
      item.address.city ||
      item.address.town ||
      'Bauru';

    setEndereco(nomeRua);

    if (nomeBairro) {
      setBairro(nomeBairro);
    }

    if (nomeCidade) {
      setCidade(nomeCidade);
    }

    setMostrarSugestoes(false);
    setSugestoesRuas([]);
  }

  const etapasConcluidas = etapas.filter(
    (e) => e.concluida
  ).length;

  const percentualConcluido = Math.round(
    (etapasConcluidas / etapas.length) * 100
  );

  function validarCodigoObra(codigo) {
    const apenasNumeros = codigo.replace(/\D/g, '');

    if (
      apenasNumeros.length < 4 ||
      apenasNumeros.length > 10
    ) {
      setErroCodigoObra(
        'O código deve conter entre 4 e 10 dígitos numéricos'
      );

      return false;
    }

    setErroCodigoObra('');

    return true;
  }

  function handleCodigoObraChange(e) {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.length > 10) {
      valor = valor.slice(0, 10);
    }

    setCodigoObraPersonalizado(valor);

    if (
      valor.length >= 4 &&
      valor.length <= 10
    ) {
      setErroCodigoObra('');
    }
  }

  function toggleEtapa(id) {
    setEtapas((prev) =>
      prev.map((etapa) =>
        etapa.id === id
          ? {
              ...etapa,
              concluida: !etapa.concluida,
            }
          : etapa
      )
    );
  }

  function adicionarAtualizacao() {
    setAtualizacoes((prev) => [
      ...prev,
      novaAtualizacaoVazia(),
    ]);
  }

  function removerAtualizacao(id) {
    setAtualizacoes((prev) => {
      const item = prev.find((i) => i.id === id);

      item?.fotos.forEach((foto) => {
        URL.revokeObjectURL(foto.previewUrl);
      });

      return prev.filter((i) => i.id !== id);
    });
  }

  function atualizarCampoAtualizacao(
    id,
    campo,
    valor
  ) {
    setAtualizacoes((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    );
  }

  /*
   * ============================================================
   * ADICIONAR FOTO
   * ============================================================
   *
   * Agora a imagem passa pela compressão antes de ser colocada
   * no estado.
   */
  async function adicionarFotoAtualizacao(id, file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Selecione um arquivo de imagem válido.');
      return;
    }

    try {
      showLoading('Preparando imagem...');

      /*
       * Aqui acontece toda a mágica:
       *
       * - máximo 2000px
       * - mantém proporção
       * - máximo 1 MB
       * - JPEG otimizado
       */
      const arquivoComprimido =
        await comprimirImagem(file);

      const tamanhoMB =
        arquivoComprimido.size / (1024 * 1024);

      console.log(
        `Imagem otimizada: ${tamanhoMB.toFixed(2)} MB`
      );

      const novaFoto = {
        id: crypto.randomUUID(),
        arquivo: arquivoComprimido,
        previewUrl:
          URL.createObjectURL(arquivoComprimido),
      };

      setAtualizacoes((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                fotos: [
                  ...item.fotos,
                  novaFoto,
                ],
              }
            : item
        )
      );

      hideLoading();
    } catch (erro) {
      hideLoading();

      console.error(
        'Erro ao preparar imagem:',
        erro
      );

      toastError(
        erro?.message ||
          'Não foi possível preparar a imagem.'
      );
    }
  }

  function removerFotoAtualizacao(
    idAtualizacao,
    idFoto
  ) {
    setAtualizacoes((prev) =>
      prev.map((item) => {
        if (item.id !== idAtualizacao) {
          return item;
        }

        const foto = item.fotos.find(
          (f) => f.id === idFoto
        );

        if (foto) {
          URL.revokeObjectURL(
            foto.previewUrl
          );
        }

        return {
          ...item,
          fotos: item.fotos.filter(
            (f) => f.id !== idFoto
          ),
        };
      })
    );
  }

  async function handleCadastrar() {
    if (!codigoObraPersonalizado.trim()) {
      toastError(
        'Preencha o código da obra (4 a 10 dígitos)'
      );

      return;
    }

    if (
      !validarCodigoObra(
        codigoObraPersonalizado
      )
    ) {
      toastError(
        'O código deve conter entre 4 e 10 dígitos numéricos'
      );

      return;
    }

    if (!nomeObra.trim()) {
      toastError('Preencha o nome da obra');
      return;
    }

    const atualizacoesComFoto =
      atualizacoes.filter(
        (item) => item.fotos.length > 0
      );

    if (atualizacoesComFoto.length === 0) {
      toastError(
        'Adicione pelo menos uma foto de atualização'
      );

      return;
    }

    if (
      atualizacoesComFoto.some(
        (item) => !item.descricao.trim()
      )
    ) {
      toastWarning(
        'Toda atualização precisa de uma descrição'
      );

      return;
    }

    setCadastrando(true);

    showLoading('Cadastrando obra...');

    try {
      const atualizacoesFinal = [];

      for (const item of atualizacoesComFoto) {
        const urlsDaAtualizacao = [];

        for (const foto of item.fotos) {
          /*
           * O arquivo já foi comprimido no momento da seleção.
           * Portanto, aqui estamos enviando diretamente o JPEG
           * otimizado para o Supabase.
           */
          const nomeArquivo =
            `${crypto.randomUUID()}.jpg`;

          const caminho =
            `obrasandamento/${nomeArquivo}`;

          const {
            error: erroUpload,
          } = await supabase.storage
            .from('obras')
            .upload(
              caminho,
              foto.arquivo,
              {
                contentType: 'image/jpeg',
                cacheControl: '31536000',
                upsert: false,
              }
            );

          if (erroUpload) {
            throw erroUpload;
          }

          const {
            data: urlData,
          } = supabase.storage
            .from('obras')
            .getPublicUrl(caminho);

          urlsDaAtualizacao.push(
            urlData.publicUrl
          );
        }

        atualizacoesFinal.push({
          urls: urlsDaAtualizacao,
          descricao: item.descricao.trim(),
          data:
            item.data || hojeISO(),
        });
      }

      const imagensResumo =
        atualizacoesFinal.flatMap(
          (item) => item.urls
        );

      const {
        data,
        error: erroInsert,
      } = await supabase
        .from('obras')
        .insert({
          codigo_obra:
            codigoObraPersonalizado,
          nome_obra: nomeObra,
          tipo_obra: tipoObra,
          nome_proprietario:
            nomeProprietario,
          cpf_proprietario:
            cpfProprietario,
          telefone_proprietario:
            telefoneProprietario,
          cep,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          descricao,
          tamanho_terreno:
            tamanhoTerreno || null,
          area_construida:
            areaConstruida || null,
          previsao_entrega:
            previsaoEntrega || null,
          etapas,
          atualizacoes:
            atualizacoesFinal,
          imagens:
            imagensResumo,
          oculta_da_home:
            ocultarPrecos,
        })
        .select();

      if (erroInsert) {
        throw erroInsert;
      }

      hideLoading();

      const obraCriada = data?.[0];

      if (obraCriada) {
        toastSuccess(
          `Obra ${codigoObraPersonalizado} cadastrada com sucesso!`
        );
      }

      onCadastrar?.(data);

      // Reseta os campos do formulário
      setCodigoObraPersonalizado('');
      setNomeObra('');
      setTipoObra('construcao');
      setNomeProprietario('');
      setCpfProprietario('');
      setTelefoneProprietario('');
      setCep('');
      setEndereco('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('Bauru');
      setTamanhoTerreno('');
      setAreaConstruida('');
      setPrevisaoEntrega('');
      setDescricao('');
      setEtapas(
        ETAPAS_PADRAO.map((e) => ({
          ...e,
        }))
      );

      atualizacoes.forEach((item) => {
        item.fotos.forEach((foto) => {
          URL.revokeObjectURL(
            foto.previewUrl
          );
        });
      });

      setAtualizacoes([
        novaAtualizacaoVazia(),
      ]);
    } catch (erro) {
      hideLoading();

      console.error(
        'Erro ao cadastrar obra:',
        erro
      );

      showError(
        'Erro ao cadastrar',
        'Verifique o console para detalhes'
      );
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <S.Painel>
      <S.TopoAcoes>
        <S.BotaoAcao
          type="button"
          onClick={onAtualizarLista}
        >
          🔄 Atualizar Lista
        </S.BotaoAcao>

        <S.BotaoAcao
          type="button"
          onClick={() =>
            onExcluirSelecionados?.(
              selecionados
            )
          }
        >
          🗑️ Excluir Seleção (
          {selecionados.length})
        </S.BotaoAcao>
      </S.TopoAcoes>

      <S.TituloPainel>
        OBRA
      </S.TituloPainel>

      <S.BlocoConfiguracoes>
        <strong>
          Configurações gerais:
        </strong>

        <S.LabelCheckbox>
          <input
            type="checkbox"
            checked={ocultarPrecos}
            onChange={(e) =>
              setOcultarPrecos(
                e.target.checked
              )
            }
          />

          Ocultar obra da página principal
        </S.LabelCheckbox>
      </S.BlocoConfiguracoes>

      <S.Formulario
        onSubmit={(e) =>
          e.preventDefault()
        }
      >
        <S.Secao>
          <S.TituloSecao>
            Identificação
          </S.TituloSecao>

          <S.Info>
            <S.Campo>
              <S.Label htmlFor="codigoObra">
                Código da Obra (de 4 a 10
                dígitos)
              </S.Label>

              <S.Input
                id="codigoObra"
                type="text"
                inputMode="numeric"
                maxLength="10"
                placeholder="1234567890"
                value={
                  codigoObraPersonalizado
                }
                onChange={
                  handleCodigoObraChange
                }
                style={{
                  borderColor:
                    erroCodigoObra
                      ? '#b3453d'
                      : 'inherit',
                }}
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
                  marginTop: 6,
                }}
              >
                {
                  codigoObraPersonalizado.length
                }
                /10 dígitos
              </div>
            </S.Campo>

            <S.Camponomeobra>
              <S.Label htmlFor="nomeObra">
                Nome da Obra
              </S.Label>

              <S.Input
                id="nomeObra"
                type="text"
                placeholder="Nome da Obra"
                value={nomeObra}
                onChange={(e) =>
                  setNomeObra(
                    e.target.value
                  )
                }
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label>
                Tipo
              </S.Label>

              <S.LinhaOpcoes>
                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={
                      tipoObra ===
                      'construcao'
                    }
                    onChange={() =>
                      setTipoObra(
                        'construcao'
                      )
                    }
                  />

                  Construção
                </S.LabelCheckbox>

                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={
                      tipoObra === 'reforma'
                    }
                    onChange={() =>
                      setTipoObra(
                        'reforma'
                      )
                    }
                  />

                  Reforma
                </S.LabelCheckbox>
              </S.LinhaOpcoes>
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Proprietário
          </S.TituloSecao>

          <S.Info>
            <S.Campo>
              <S.Label htmlFor="nomeProprietario">
                Nome do Proprietário
              </S.Label>

              <S.Input
                id="nomeProprietario"
                type="text"
                placeholder="Nome do Proprietário"
                value={
                  nomeProprietario
                }
                onChange={(e) =>
                  setNomeProprietario(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cpfProprietario">
                CPF do Proprietário
              </S.Label>

              <S.Input
                id="cpfProprietario"
                type="text"
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                value={
                  cpfProprietario
                }
               onChange={(e) =>
  setCpfProprietario(
    mascaraCPF(e.target.value)
  )
}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="telefoneProprietario">
                Telefone de Contato
              </S.Label>

              <S.Input
                id="telefoneProprietario"
                type="text"
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                maxLength={15}
                value={
                  telefoneProprietario
                }
              onChange={(e) =>
  setTelefoneProprietario(
    mascaraTelefone(e.target.value)
  )
}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Localização
          </S.TituloSecao>

          <S.Info>
            <S.Campo>
              <S.Label htmlFor="cep">
                CEP
              </S.Label>

              <S.Input
                id="cep"
                type="text"
                inputMode="numeric"
                placeholder="17000-000"
                maxLength={9}
                value={cep}
                onChange={
                  handleCepChange
                }
              />

              {carregandoCep && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#ffb83c',
                    marginTop: 4,
                  }}
                >
                  🔍 Buscando CEP...
                </div>
              )}
            </S.Campo>

            {/* Campo Endereço com Autocomplete OSM e Wrapper Ref */}
            <S.Camponomeobra
              style={{
                position: 'relative',
              }}
              ref={dropdownRef}
            >
              <S.Label htmlFor="endereco">
                Endereço (Rua / Av)
              </S.Label>

              <S.Input
                id="endereco"
                type="text"
                placeholder="Digite o nome da rua..."
                value={endereco}
                onChange={(e) => {
                  setEndereco(
                    e.target.value
                  );
                  setMostrarSugestoes(
                    true
                  );
                }}
                onFocus={() =>
                  setMostrarSugestoes(
                    true
                  )
                }
                autoComplete="off"
              />

              {carregandoRuas && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#ffb83c',
                    marginTop: 4,
                  }}
                >
                  🔍 Buscando logradouros
                  em Bauru...
                </div>
              )}

              {/* Lista Flutuante de Sugestões */}
              {mostrarSugestoes &&
                sugestoesRuas.length >
                  0 && (
                  <ul
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#fff',
                      border:
                        '1px solid #d9d6cf',
                      borderRadius: 6,
                      maxHeight: 180,
                      overflowY: 'auto',
                      zIndex: 999,
                      listStyle: 'none',
                      margin:
                        '4px 0 0 0',
                      padding: 0,
                      boxShadow:
                        '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {sugestoesRuas.map(
                      (item) => {
                        const rua =
                          item.address
                            .road ||
                          item.display_name.split(
                            ','
                          )[0];

                        const bairroSugestao =
                          item.address
                            .suburb ||
                          item.address
                            .neighbourhood ||
                          item.address
                            .residential ||
                          '';

                        return (
                          <li
                            key={
                              item.place_id
                            }
                            onClick={() =>
                              selecionarEndereco(
                                item
                              )
                            }
                            style={{
                              padding:
                                '10px 12px',
                              cursor:
                                'pointer',
                              borderBottom:
                                '1px solid #f0f0f0',
                              fontSize: 13,
                              color:
                                '#23262b',
                            }}
                          >
                            <strong>
                              {rua}
                            </strong>

                            {bairroSugestao && (
                              <span
                                style={{
                                  color:
                                    '#6e7178',
                                  marginLeft: 6,
                                }}
                              >
                                -{' '}
                                {
                                  bairroSugestao
                                }
                              </span>
                            )}
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
            </S.Camponomeobra>

            <S.Campo>
              <S.Label htmlFor="numero">
                Número
              </S.Label>

              <S.Input
                id="numero"
                type="text"
                placeholder="Ex: 12-34 ou S/N"
                value={numero}
                onChange={(e) =>
                  setNumero(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="complemento">
                Complemento
              </S.Label>

              <S.Input
                id="complemento"
                type="text"
                placeholder="Ex: Apt 12 / Quadra 5 Lote 10"
                value={complemento}
                onChange={(e) =>
                  setComplemento(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="bairro">
                Bairro
              </S.Label>

              <S.Input
                id="bairro"
                type="text"
                placeholder="Bairro"
                value={bairro}
                onChange={(e) =>
                  setBairro(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cidade">
                Cidade
              </S.Label>

              <S.Input
                id="cidade"
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) =>
                  setCidade(
                    e.target.value
                  )
                }
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Dados da Obra
          </S.TituloSecao>

          <S.Info>
            <S.Campo>
              <S.Label htmlFor="tamanhoTerreno">
                Tamanho do Terreno (m²)
              </S.Label>

              <S.Input
                id="tamanhoTerreno"
                type="number"
                min="0"
                placeholder="Ex: 360"
                value={
                  tamanhoTerreno
                }
                onChange={(e) =>
                  setTamanhoTerreno(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="areaConstruida">
                Área Construída (m²)
              </S.Label>

              <S.Input
                id="areaConstruida"
                type="number"
                min="0"
                placeholder="Ex: 180"
                value={
                  areaConstruida
                }
                onChange={(e) =>
                  setAreaConstruida(
                    e.target.value
                  )
                }
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="previsaoEntrega">
                Previsão de Entrega
              </S.Label>

              <S.Input
                id="previsaoEntrega"
                type="date"
                value={
                  previsaoEntrega
                }
                onChange={(e) =>
                  setPrevisaoEntrega(
                    e.target.value
                  )
                }
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Etapas da Obra
          </S.TituloSecao>

          <div
            style={{
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span>
                Progresso
              </span>

              <span>
                {percentualConcluido}%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: 10,
                borderRadius: 6,
                background: '#e6e3da',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percentualConcluido}%`,
                  height: '100%',
                  background: '#ffb83c',
                  transition:
                    'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {etapas.map((etapa) => (
              <label
                key={etapa.id}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems:
                    'center',
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    etapa.concluida
                  }
                  onChange={() =>
                    toggleEtapa(
                      etapa.id
                    )
                  }
                />

                {etapa.nome}
              </label>
            ))}
          </div>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Descrição Geral
          </S.TituloSecao>

          <S.Campo>
            <S.ContadorTexto>
              {descricao.length}/2000
            </S.ContadorTexto>

            <S.TextArea
              id="descricao"
              maxLength={2000}
              rows={6}
              placeholder="Descrição detalhada"
              value={descricao}
              onChange={(e) =>
                setDescricao(
                  e.target.value
                )
              }
            />
          </S.Campo>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>
            Atualizações da Obra
          </S.TituloSecao>

          <S.DicaImagem>
            Cada atualização pode ter uma
            ou mais fotos com uma descrição
            do que foi feito. O cliente vê
            essas postagens em ordem
            cronológica, como um diário da
            obra.
          </S.DicaImagem>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {atualizacoes.map(
              (item, index) => (
                <div
                  key={item.id}
                  style={{
                    border:
                      '1px solid #e6e3da',
                    borderRadius: 12,
                    padding: 18,
                    background:
                      '#fbfaf8',
                    boxShadow:
                      '0 2px 8px rgba(30, 30, 30, 0.05)',
                    display: 'flex',
                    flexDirection:
                      'column',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      paddingBottom: 10,
                      borderBottom:
                        '1px solid #e6e3da',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems:
                          'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background:
                            '#ffb83c',
                          flexShrink: 0,
                        }}
                      />

                      <strong
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Atualização{' '}
                        {index + 1}
                      </strong>
                    </div>

                    {atualizacoes.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removerAtualizacao(
                            item.id
                          )
                        }
                        style={{
                          border:
                            'none',
                          background:
                            'transparent',
                          color:
                            '#b3453d',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor:
                            'pointer',
                          padding:
                            '4px 8px',
                        }}
                      >
                        ✕ Remover
                      </button>
                    )}
                  </div>

                  <div>
                    <S.Label>
                      Fotos
                    </S.Label>

                    <div
                      style={{
                        display:
                          'flex',
                        flexWrap:
                          'wrap',
                        gap: 10,
                        marginTop: 6,
                      }}
                    >
                      {item.fotos.map(
                        (foto) => (
                          <div
                            key={
                              foto.id
                            }
                            style={{
                              position:
                                'relative',
                              width: 110,
                              height: 110,
                              borderRadius:
                                8,
                              overflow:
                                'hidden',
                              border:
                                '1px solid #d9d6cf',
                              background:
                                `url(${foto.previewUrl}) center / cover no-repeat`,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removerFotoAtualizacao(
                                  item.id,
                                  foto.id
                                )
                              }
                              style={{
                                position:
                                  'absolute',
                                top: 4,
                                right: 4,
                                background:
                                  'rgba(0,0,0,0.6)',
                                color:
                                  '#fff',
                                border:
                                  'none',
                                borderRadius:
                                  '50%',
                                width: 22,
                                height: 22,
                                cursor:
                                  'pointer',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                fontSize: 12,
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )
                      )}

                      <label
                        style={{
                          width: 110,
                          height: 110,
                          border:
                            '2px dashed #d9d6cf',
                          borderRadius: 8,
                          display:
                            'flex',
                          flexDirection:
                            'column',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          cursor:
                            'pointer',
                          fontSize: 12,
                          color:
                            '#6e7178',
                          background:
                            '#fff',
                        }}
                      >
                        📷 Adicionar

                        <input
                          type="file"
                          accept="image/*"
                          style={{
                            display:
                              'none',
                          }}
                          onChange={(
                            e
                          ) => {
                            const file =
                              e.target
                                .files?.[0];

                            if (file) {
                              adicionarFotoAtualizacao(
                                item.id,
                                file
                              );
                            }

                            e.target.value =
                              '';
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <S.Campo>
                    <S.Label>
                      Data da Atualização
                    </S.Label>

                    <S.Input
                      type="date"
                      value={
                        item.data
                      }
                      onChange={(e) =>
                        atualizarCampoAtualizacao(
                          item.id,
                          'data',
                          e.target.value
                        )
                      }
                    />
                  </S.Campo>

                  <S.Campo>
                    <S.Label>
                      Descrição do que foi
                      realizado
                    </S.Label>

                    <S.TextArea
                      rows={3}
                      placeholder="Ex: Finalizada a concretagem da laje e iniciado o alvenaria..."
                      value={
                        item.descricao
                      }
                      onChange={(e) =>
                        atualizarCampoAtualizacao(
                          item.id,
                          'descricao',
                          e.target.value
                        )
                      }
                    />
                  </S.Campo>
                </div>
              )
            )}

            <button
              type="button"
              onClick={
                adicionarAtualizacao
              }
              style={{
                padding: '12px 16px',
                border:
                  '1px dashed #ffb83c',
                borderRadius: 8,
                background:
                  '#fff8ea',
                color: '#b37700',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              + Adicionar Nova Atualização
            </button>
          </div>
        </S.Secao>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 24,
            justifyContent:
              'flex-end',
          }}
        >
          {onFechar && (
            <S.BotaoAcao
              type="button"
              onClick={onFechar}
            >
              Cancelar
            </S.BotaoAcao>
          )}

          <S.BotaoAcao
            type="button"
            disabled={cadastrando}
            onClick={handleCadastrar}
            style={{
              background: '#ffb83c',
              borderColor: '#e69d19',
              color: '#23262b',
              fontWeight: 'bold',
            }}
          >
            {cadastrando
              ? 'Cadastrando...'
              : 'Cadastrar Obra'}
          </S.BotaoAcao>
        </div>
      </S.Formulario>
    </S.Painel>
  );
}