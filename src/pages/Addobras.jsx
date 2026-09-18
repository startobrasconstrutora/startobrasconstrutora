import React, { useState, useRef, useEffect } from 'react';
import * as S from './Addobras.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone } from './mascaras';

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
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [tamanhoTerreno, setTamanhoTerreno] = useState('');
  const [areaConstruida, setAreaConstruida] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');

  const [etapas, setEtapas] = useState(ETAPAS_PADRAO);

  const [descricao, setDescricao] = useState('');

  const [atualizacoes, setAtualizacoes] = useState([novaAtualizacaoVazia()]);

  const [selecionados, setSelecionados] = useState([]);
  const [cadastrando, setCadastrando] = useState(false);

  const [notificacao, setNotificacao] = useState(null); 
  const notificacaoTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(notificacaoTimeoutRef.current);
  }, []);

  const etapasConcluidas = etapas.filter((e) => e.concluida).length;
  const percentualConcluido = Math.round((etapasConcluidas / etapas.length) * 100);

  // Validar código de obra (apenas números, exatamente 10 dígitos)
function validarCodigoObra(codigo) {
  const apenasNumeros = codigo.replace(/\D/g, '');
  if (apenasNumeros.length < 4 || apenasNumeros.length > 10) {
    setErroCodigoObra('O código deve conter entre 4 e 10 dígitos numéricos');
    return false;
  }
  setErroCodigoObra('');
  return true;
}

function handleCodigoObraChange(e) {
  let valor = e.target.value.replace(/\D/g, '');
  if (valor.length > 10) valor = valor.slice(0, 10);
  setCodigoObraPersonalizado(valor);

  if (valor.length >= 4 && valor.length <= 10) {
    setErroCodigoObra('');
  }
}

  function toggleEtapa(id) {
    setEtapas((prev) =>
      prev.map((etapa) =>
        etapa.id === id ? { ...etapa, concluida: !etapa.concluida } : etapa
      )
    );
  }

  function adicionarAtualizacao() {
    setAtualizacoes((prev) => [...prev, novaAtualizacaoVazia()]);
  }

  function removerAtualizacao(id) {
    setAtualizacoes((prev) => {
      const item = prev.find((i) => i.id === id);
      item?.fotos.forEach((foto) => URL.revokeObjectURL(foto.previewUrl));
      return prev.filter((i) => i.id !== id);
    });
  }

  function atualizarCampoAtualizacao(id, campo, valor) {
    setAtualizacoes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  }

  function adicionarFotoAtualizacao(id, file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      alert(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
      return;
    }

    const novaFoto = {
      id: crypto.randomUUID(),
      arquivo: file,
      previewUrl: URL.createObjectURL(file),
    };

    setAtualizacoes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, fotos: [...item.fotos, novaFoto] } : item
      )
    );
  }

  function removerFotoAtualizacao(idAtualizacao, idFoto) {
    setAtualizacoes((prev) =>
      prev.map((item) => {
        if (item.id !== idAtualizacao) return item;
        const foto = item.fotos.find((f) => f.id === idFoto);
        if (foto) URL.revokeObjectURL(foto.previewUrl);
        return { ...item, fotos: item.fotos.filter((f) => f.id !== idFoto) };
      })
    );
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleCadastrar() {
    // Validar código de obra
if (!codigoObraPersonalizado.trim()) {
  alert('Preencha o código da obra (4 a 10 dígitos).');
  return;
}

if (!validarCodigoObra(codigoObraPersonalizado)) {
  alert('O código deve conter entre 4 e 10 dígitos numéricos.');
  return;
}

    if (!nomeObra.trim()) {
      alert('Preencha o nome da obra.');
      return;
    }

    const atualizacoesComFoto = atualizacoes.filter((item) => item.fotos.length > 0);
    if (atualizacoesComFoto.length === 0) {
      alert('Adicione pelo menos uma foto de atualização.');
      return;
    }
    if (atualizacoesComFoto.some((item) => !item.descricao.trim())) {
      alert('Toda atualização precisa de uma descrição contando o que foi feito.');
      return;
    }

    setCadastrando(true);
    try {

      const atualizacoesFinal = [];

      for (const item of atualizacoesComFoto) {
        const urlsDaAtualizacao = [];

        for (const foto of item.fotos) {
          const extensao = foto.arquivo.name.split('.').pop();
          const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;
          const caminho = `obrasandamento/${nomeArquivo}`;

          const { error: erroUpload } = await supabase.storage
            .from('obras')
            .upload(caminho, foto.arquivo);

          if (erroUpload) throw erroUpload;

          const { data: urlData } = supabase.storage
            .from('obras')
            .getPublicUrl(caminho);

          urlsDaAtualizacao.push(urlData.publicUrl);
        }

        atualizacoesFinal.push({
          urls: urlsDaAtualizacao,
          descricao: item.descricao.trim(),
          data: item.data || hojeISO(),
        });
      }

      const imagensResumo = atualizacoesFinal.flatMap((item) => item.urls);

      const { data, error: erroInsert } = await supabase
        .from('obras')
        .insert({
          codigo_obra: codigoObraPersonalizado, // Usar código personalizado
          nome_obra: nomeObra,
          tipo_obra: tipoObra,
          nome_proprietario: nomeProprietario,
          cpf_proprietario: cpfProprietario,
          telefone_proprietario: telefoneProprietario,
          endereco,
          bairro,
          cidade,
          descricao,
          tamanho_terreno: tamanhoTerreno || null,
          area_construida: areaConstruida || null,
          previsao_entrega: previsaoEntrega || null,
          etapas,
          atualizacoes: atualizacoesFinal,
          imagens: imagensResumo,
          oculta_da_home: ocultarPrecos,
        })
        .select();

      if (erroInsert) throw erroInsert;

      const obraCriada = data?.[0];
      if (obraCriada) {
        setNotificacao(codigoObraPersonalizado);
        window.clearTimeout(notificacaoTimeoutRef.current);
        notificacaoTimeoutRef.current = window.setTimeout(() => {
          setNotificacao(null);
        }, 6000);
      }

      onCadastrar?.(data);

      // Limpar formulário
      setCodigoObraPersonalizado('');
      setNomeObra('');
      setTipoObra('construcao');
      setNomeProprietario('');
      setCpfProprietario('');
      setTelefoneProprietario('');
      setEndereco('');
      setBairro('');
      setCidade('');
      setTamanhoTerreno('');
      setAreaConstruida('');
      setPrevisaoEntrega('');
      setDescricao('');
      setEtapas(ETAPAS_PADRAO.map((e) => ({ ...e })));
      atualizacoes.forEach((item) => {
        item.fotos.forEach((foto) => URL.revokeObjectURL(foto.previewUrl));
      });
      setAtualizacoes([novaAtualizacaoVazia()]);
    } catch (erro) {
      console.error('Erro ao cadastrar obra:', erro);
      alert('Erro ao cadastrar obra. Veja o console para detalhes.');
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <S.Painel>
      {notificacao && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            background: '#1e1e1e',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            maxWidth: 340,
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}>
            <strong>Obra {notificacao} cadastrada!</strong>
            <br />
            Pode ser revisada na sessão de admin.
          </div>
          <button
            type="button"
            onClick={() => setNotificacao(null)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <S.TopoAcoes>
        <S.BotaoAcao type="button" onClick={onAtualizarLista}>
          🔄 Atualizar Lista
        </S.BotaoAcao>
        <S.BotaoAcao type="button" onClick={() => onExcluirSelecionados?.(selecionados)}>
          🗑️ Excluir Seleção ({selecionados.length})
        </S.BotaoAcao>
      </S.TopoAcoes>

      <S.TituloPainel>OBRA</S.TituloPainel>

      <S.BlocoConfiguracoes>
        <strong>Configurações gerais:</strong>
        <S.LabelCheckbox>
          <input
            type="checkbox"
            checked={ocultarPrecos}
            onChange={(e) => setOcultarPrecos(e.target.checked)}
          />
          Ocultar obra da página principal
        </S.LabelCheckbox>
      </S.BlocoConfiguracoes>

      <S.Formulario onSubmit={(e) => e.preventDefault()}>
        <S.Secao>
          <S.TituloSecao>Identificação</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="codigoObra">Código da Obra (10 dígitos)</S.Label>
              <S.Input
                id="codigoObra"
                type="text"
                inputMode="numeric"
                maxLength="10"
                placeholder="1234567890"
                value={codigoObraPersonalizado}
                onChange={handleCodigoObraChange}
                style={{
                  borderColor: erroCodigoObra ? '#b3453d' : 'inherit',
                }}
              />
              {erroCodigoObra && (
                <div style={{ color: '#b3453d', fontSize: 12, marginTop: 4 }}>
                  {erroCodigoObra}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#6e7178', marginTop: 6 }}>
                {codigoObraPersonalizado.length}/10 dígitos
              </div>
            </S.Campo>

            <S.Camponomeobra>
              <S.Label htmlFor="nomeObra">Nome da Obra</S.Label>
              <S.Input
                id="nomeObra"
                type="text"
                placeholder="Nome da Obra"
                value={nomeObra}
                onChange={(e) => setNomeObra(e.target.value)}
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label>Tipo</S.Label>
              <S.LinhaOpcoes>
                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={tipoObra === 'construcao'}
                    onChange={() => setTipoObra('construcao')}
                  />
                  Construção
                </S.LabelCheckbox>
                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={tipoObra === 'reforma'}
                    onChange={() => setTipoObra('reforma')}
                  />
                  Reforma
                </S.LabelCheckbox>
              </S.LinhaOpcoes>
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Proprietário</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="nomeProprietario">Nome do Proprietário</S.Label>
              <S.Input
                id="nomeProprietario"
                type="text"
                placeholder="Nome do Proprietário"
                value={nomeProprietario}
                onChange={(e) => setNomeProprietario(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cpfProprietario">CPF do Proprietário</S.Label>
              <S.Input
                id="cpfProprietario"
                type="text"
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                value={cpfProprietario}
                onChange={(e) => setCpfProprietario(mascaraCPF(e.target.value))}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="telefoneProprietario">Telefone de Contato</S.Label>
              <S.Input
                id="telefoneProprietario"
                type="text"
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                maxLength={15}
                value={telefoneProprietario}
                onChange={(e) => setTelefoneProprietario(mascaraTelefone(e.target.value))}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Localização</S.TituloSecao>
          <S.Info>
            <S.Camponomeobra>
              <S.Label htmlFor="endereco">Endereço</S.Label>
              <S.Input
                id="endereco"
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label htmlFor="bairro">Bairro</S.Label>
              <S.Input
                id="bairro"
                type="text"
                placeholder="Bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cidade">Cidade</S.Label>
              <S.Input
                id="cidade"
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Dados da Obra</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="tamanhoTerreno">Tamanho do Terreno (m²)</S.Label>
              <S.Input
                id="tamanhoTerreno"
                type="number"
                min="0"
                placeholder="Ex: 360"
                value={tamanhoTerreno}
                onChange={(e) => setTamanhoTerreno(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="areaConstruida">Área Construída (m²)</S.Label>
              <S.Input
                id="areaConstruida"
                type="number"
                min="0"
                placeholder="Ex: 180"
                value={areaConstruida}
                onChange={(e) => setAreaConstruida(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="previsaoEntrega">Previsão de Entrega</S.Label>
              <S.Input
                id="previsaoEntrega"
                type="date"
                value={previsaoEntrega}
                onChange={(e) => setPrevisaoEntrega(e.target.value)}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Etapas da Obra</S.TituloSecao>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span>Progresso</span>
              <span>{percentualConcluido}%</span>
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
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {etapas.map((etapa) => (
              <label
                key={etapa.id}
                style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}
              >
                <input
                  type="checkbox"
                  checked={etapa.concluida}
                  onChange={() => toggleEtapa(etapa.id)}
                />
                {etapa.nome}
              </label>
            ))}
          </div>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Descrição Geral</S.TituloSecao>
          <S.Campo>
            <S.ContadorTexto>{descricao.length}/2000</S.ContadorTexto>
            <S.TextArea
              id="descricao"
              maxLength={2000}
              rows={6}
              placeholder="Descrição detalhada"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </S.Campo>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Atualizações da Obra</S.TituloSecao>
          <S.DicaImagem>
            Cada atualização pode ter uma ou mais fotos com uma descrição do que foi feito.
            O cliente vê essas postagens em ordem cronológica, como um diário da obra.
          </S.DicaImagem>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {atualizacoes.map((item, index) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e6e3da',
                  borderRadius: 12,
                  padding: 18,
                  background: '#fbfaf8',
                  boxShadow: '0 2px 8px rgba(30, 30, 30, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 10,
                    borderBottom: '1px solid #e6e3da',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: '#ffb83c',
                        flexShrink: 0,
                      }}
                    />
                    <strong style={{ fontSize: 14 }}>Atualização {index + 1}</strong>
                  </div>
                  {atualizacoes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerAtualizacao(item.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#b3453d',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px 8px',
                      }}
                    >
                      ✕ Remover
                    </button>
                  )}
                </div>

                <div>
                  <S.Label>Fotos</S.Label>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginTop: 6,
                    }}
                  >
                    {item.fotos.map((foto) => (
                      <div
                        key={foto.id}
                        style={{
                          position: 'relative',
                          width: 110,
                          height: 110,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: '1px solid #d9d6cf',
                          background: `url(${foto.previewUrl}) center / cover no-repeat`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => removerFotoAtualizacao(item.id, foto.id)}
                          title="Remover foto"
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(30, 30, 30, 0.7)',
                            color: '#fff',
                            fontSize: 12,
                            lineHeight: 1,
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <label
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 8,
                        border: '1px dashed #d9d6cf',
                        background: '#f3f1eb',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        color: '#6e7178',
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      <span style={{ fontSize: 22 }}>＋</span>
                      Adicionar Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          adicionarFotoAtualizacao(item.id, e.target.files[0]);
                          e.target.value = '';
                        }}
                        style={{
                          position: 'absolute',
                          width: 1,
                          height: 1,
                          overflow: 'hidden',
                          opacity: 0,
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ width: 200 }}>
                  <S.Label>Data da atualização</S.Label>
                  <S.Input
                    type="date"
                    value={item.data}
                    onChange={(e) =>
                      atualizarCampoAtualizacao(item.id, 'data', e.target.value)
                    }
                  />
                </div>

                <div>
                  <S.Label>O que foi feito?</S.Label>
                  <S.TextArea
                    rows={2}
                    maxLength={500}
                    placeholder="Ex: Concluída a fundação e iniciado o levantamento das paredes"
                    value={item.descricao}
                    onChange={(e) =>
                      atualizarCampoAtualizacao(item.id, 'descricao', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarAtualizacao}
              style={{
                border: '2px dashed #ffb83c',
                background: 'transparent',
                color: '#1e1e1e',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Adicionar Atualização
            </button>
          </div>
        </S.Secao>

        <S.BotaoEnviar type="button" onClick={handleCadastrar} disabled={cadastrando}>
          {cadastrando ? 'Cadastrando...' : 'Cadastrar Obra'}
        </S.BotaoEnviar>
      </S.Formulario>

      <S.ContainerLista>
        {itens.map((item) => (
          <S.LabelCheckbox key={item.id}>
            <input
              type="checkbox"
              checked={selecionados.includes(item.id)}
              onChange={() => toggleSelecionado(item.id)}
            />
            {item.nome}
          </S.LabelCheckbox>
        ))}
      </S.ContainerLista>
    </S.Painel>
  );
}