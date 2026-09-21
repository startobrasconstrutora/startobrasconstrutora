import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import heroImg from "../assets/img/capacete.png";
import * as S from './Consultaobra.styles';
import {
  formatarCodigoObra,
  extrairDigitosDoCodigo,
} from './mascaras';
import {
  showLoading,
  hideLoading,
  showError,
  toastError,
} from '../utils/alert.js';

function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')     .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

export default function ConsultaObra() {
  // Quando a rota é /obra/:codigo, esse parâmetro vem preenchido
  // (sempre só os dígitos, ex: "2606001"). Quando a rota é
  // /consultaobra (busca "do zero"), vem undefined.
  const { codigo: codigoDaUrl } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Se chegamos aqui logo depois de uma busca bem-sucedida (via navigate),
  // a obra já vem pronta no state, evitando bater no banco de novo.
  // Se a pessoa abriu o link direto (compartilhado), location.state é null
  // e o CPF precisa ser digitado normalmente — o código sozinho na URL
  // nunca é suficiente para ver os dados.
  const obraViaNavegacao = location.state?.obra || null;

  const modoLink = Boolean(codigoDaUrl);

  const [codigo, setCodigo] = useState(modoLink ? codigoDaUrl.replace(/\D/g, '') : '');
  const [cpf, setCpf] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);
  const [obra, setObra] = useState(obraViaNavegacao);
  const [visualizacao, setVisualizacao] = useState(null); // { urls: string[], index: number }

  async function handleConsultar(e) {
    e.preventDefault();
    setErro(null);

    const valorDigitado = modoLink ? codigoDaUrl : codigo;
    const digitosCodigo = extrairDigitosDoCodigo(valorDigitado);

    if (!digitosCodigo) {
      const msg = 'Código inválido. Confira o código informado.';
      setErro(msg);
      toastError(msg);
      return;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      const msg = 'Informe um CPF válido.';
      setErro(msg);
      toastError(msg);
      return;
    }

    setBuscando(true);
    setObra(null);
    showLoading('Consultando obra...');

    try {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('codigo_obra', digitosCodigo)
        .eq('cpf_proprietario', cpf)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const msg = 'Não encontramos nenhuma obra com esse código e CPF. Confira os dados e tente novamente.';
        setErro(msg);
        showError('Obra não encontrada', msg);
        return;
      }

      setObra(data);

      // Só atualiza a URL quando a busca partiu do formulário genérico
      // (/consultaobra). Se já estava em /obra/:codigo, a URL já está certa.
      if (!modoLink) {
        navigate(`/obra/${digitosCodigo}`, { state: { obra: data } });
      }
    } catch (err) {
      console.error('Erro ao consultar obra:', err);
      const msg = 'Não foi possível consultar a obra agora. Tente novamente em instantes.';
      setErro(msg);
      showError('Erro na consulta', msg);
    } finally {
      hideLoading();
      setBuscando(false);
    }
  }

  function novaConsulta() {
    setObra(null);
    setErro(null);
    setCpf('');
    if (modoLink) {
      // Sai do link direto e volta pro formulário "do zero"
      navigate('/consultaobra');
    } else {
      setCodigo('');
    }
  }

  function fecharVisualizacao() {
    setVisualizacao(null);
  }

  function fotoAnterior() {
    setVisualizacao((prev) => {
      if (!prev) return prev;
      const novoIndex = (prev.index - 1 + prev.urls.length) % prev.urls.length;
      return { ...prev, index: novoIndex };
    });
  }

  function proximaFoto() {
    setVisualizacao((prev) => {
      if (!prev) return prev;
      const novoIndex = (prev.index + 1) % prev.urls.length;
      return { ...prev, index: novoIndex };
    });
  }

  useEffect(() => {
    if (!visualizacao) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') fecharVisualizacao();
      if (e.key === 'ArrowLeft') fotoAnterior();
      if (e.key === 'ArrowRight') proximaFoto();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visualizacao]);

  const etapas = obra?.etapas || [];
  const etapasConcluidas = etapas.filter((e) => e.concluida).length;
  const percentual = etapas.length
    ? Math.round((etapasConcluidas / etapas.length) * 100)
    : 0;

  const atualizacoes = [...(obra?.atualizacoes || [])].sort((a, b) =>
    (b.data || '').localeCompare(a.data || '')
  );

  return (
    <S.Pagina>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>CONSULTAR OBRA</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        {!obra ? (
          <>
            <S.Subtitulo>
              {modoLink
                ? `Confirme o CPF do proprietário para acompanhar a obra ${codigoDaUrl.replace(/\D/g, '')}.`
                : 'Digite o código da obra e o CPF do proprietário para acompanhar o andamento.'}
            </S.Subtitulo>

            <S.Formulario onSubmit={handleConsultar}>
              {!modoLink && (
                <div>
                  <S.Label htmlFor="codigoObra">Código da Obra</S.Label>
                  <S.Input
                    id="codigoObra"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="de 4 a 10 dígitos"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              )}

              <div>
                <S.Label htmlFor="cpfConsulta">CPF do Proprietário</S.Label>
                <S.Input
                  id="cpfConsulta"
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                />
              </div>

              {erro && <S.Erro>{erro}</S.Erro>}

              <S.Botao type="submit" disabled={buscando}>
                {buscando ? 'Consultando...' : 'Consultar'}
              </S.Botao>
            </S.Formulario>
          </>
        ) : (
          <div>
            <S.BotaoVoltar onClick={novaConsulta}>
              ← Nova consulta
            </S.BotaoVoltar>

            <S.CabecalhoObra>
              <S.CodigoObra>{formatarCodigoObra(obra)}</S.CodigoObra>
              <S.Titulo>{obra.nome_obra || '(sem nome)'}</S.Titulo>
              <S.Subtitulo>
                {[obra.bairro, obra.cidade].filter(Boolean).join(' - ')}
                {obra.tipo_obra && ` · ${obra.tipo_obra === 'reforma' ? 'Reforma' : 'Construção'}`}
              </S.Subtitulo>
            </S.CabecalhoObra>

            {obra.imagens?.[0] && (
              <S.ImagemCapa
                src={obra.imagens[0]}
                alt={obra.nome_obra}
                style={{ cursor: 'zoom-in' }}
                onClick={() => setVisualizacao({ urls: [obra.imagens[0]], index: 0 })}
              />
            )}

            <S.BlocoProgresso>
              <S.LinhaProgresso>
                <strong>Progresso da obra</strong>
                <span>{percentual}%</span>
              </S.LinhaProgresso>
              <S.BarraFundo>
                <S.BarraPreenchida style={{ width: `${percentual}%` }} />
              </S.BarraFundo>

              <S.GridEtapas>
                {etapas.map((etapa) => (
                  <S.ItemEtapa key={etapa.id}>
                    <span>{etapa.concluida ? '✅' : '⬜'}</span>
                    {etapa.nome}
                  </S.ItemEtapa>
                ))}
              </S.GridEtapas>
            </S.BlocoProgresso>

            {obra.descricao && (
              <S.BlocoTexto>
                <S.TituloSecao>Sobre a obra</S.TituloSecao>
                <S.Paragrafo>{obra.descricao}</S.Paragrafo>
              </S.BlocoTexto>
            )}

            <S.BlocoTexto>
              <S.TituloSecao>Diário da Obra</S.TituloSecao>

              {atualizacoes.length === 0 && (
                <S.Paragrafo>Ainda não há atualizações postadas.</S.Paragrafo>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {atualizacoes.map((item, index) => (
                  <S.CardAtualizacao key={index}>
                    <S.DataAtualizacao>{formatarData(item.data)}</S.DataAtualizacao>
                    <S.Paragrafo>{item.descricao}</S.Paragrafo>
                    {item.urls?.length > 0 && (
                      <S.GridFotos>
                        {item.urls.map((url, indexFoto) => (
                          <S.FotoAtualizacao
                            key={url}
                            style={{ backgroundImage: `url(${url})`, cursor: 'zoom-in' }}
                            onClick={() => setVisualizacao({ urls: item.urls, index: indexFoto })}
                          />
                        ))}
                      </S.GridFotos>
                    )}
                  </S.CardAtualizacao>
                ))}
              </div>
            </S.BlocoTexto>
          </div>
        )}
      </S.Container>

      {visualizacao && (
        <div
          onClick={fecharVisualizacao}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'zoom-out',
            padding: 20,
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={fecharVisualizacao}
            aria-label="Fechar"
            style={{
              position: 'fixed',
              top: 20,
              right: 24,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: 20,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          {visualizacao.urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fotoAnterior();
              }}
              aria-label="Foto anterior"
              style={{
                position: 'fixed',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 24,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ‹
            </button>
          )}

          <img
            src={visualizacao.urls[visualizacao.index]}
            alt="Foto ampliada"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          />

          {visualizacao.urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                proximaFoto();
              }}
              aria-label="Próxima foto"
              style={{
                position: 'fixed',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 24,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ›
            </button>
          )}

          {visualizacao.urls.length > 1 && (
            <div
              style={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                fontSize: 13,
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '4px 12px',
                borderRadius: 12,
              }}
            >
              {visualizacao.index + 1} / {visualizacao.urls.length}
            </div>
          )}
        </div>
      )}
    </S.Pagina>
  );
}