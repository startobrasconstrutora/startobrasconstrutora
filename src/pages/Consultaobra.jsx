import { useState } from 'react';
import { supabase } from '../supabaseClient';
import heroImg from "../assets/img/capacete.png";
import * as S from './Consultaobra.styles';

function formatarCodigoObra(id) {
  return `#${String(id).padStart(4, '0')}`;
}

function extrairIdDoCodigo(valor) {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return null;
  return parseInt(digitos, 10);
}

function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

export default function ConsultaObra() {
  const [codigo, setCodigo] = useState('');
  const [cpf, setCpf] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);
  const [obra, setObra] = useState(null);

  async function handleConsultar(e) {
    e.preventDefault();
    setErro(null);

    const idObra = extrairIdDoCodigo(codigo);
    if (!idObra) {
      setErro('Informe o código da obra (ex: #0020).');
      return;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      setErro('Informe um CPF válido.');
      return;
    }

    setBuscando(true);
    setObra(null);
    try {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('id', idObra)
        .eq('cpf_proprietario', cpf)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErro('Não encontramos nenhuma obra com esse código e CPF. Confira os dados e tente novamente.');
        return;
      }

      setObra(data);
    } catch (err) {
      console.error('Erro ao consultar obra:', err);
      setErro('Não foi possível consultar a obra agora. Tente novamente em instantes.');
    } finally {
      setBuscando(false);
    }
  }

  function novaConsulta() {
    setObra(null);
    setErro(null);
    setCodigo('');
    setCpf('');
  }

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
              Digite o código da obra e o CPF do proprietário para acompanhar o andamento.
            </S.Subtitulo>

            <S.Formulario onSubmit={handleConsultar}>
              <div>
                <S.Label htmlFor="codigoObra">Código da Obra</S.Label>
                <S.Input
                  id="codigoObra"
                  type="text"
                  placeholder="Ex: #0020"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

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
              <S.CodigoObra>{formatarCodigoObra(obra.id)}</S.CodigoObra>
              <S.Titulo>{obra.nome_obra || '(sem nome)'}</S.Titulo>
              <S.Subtitulo>
                {[obra.bairro, obra.cidade].filter(Boolean).join(' - ')}
                {obra.tipo_obra && ` · ${obra.tipo_obra === 'reforma' ? 'Reforma' : 'Construção'}`}
              </S.Subtitulo>
            </S.CabecalhoObra>

            {obra.imagens?.[0] && (
              <S.ImagemCapa src={obra.imagens[0]} alt={obra.nome_obra} />
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
                        {item.urls.map((url) => (
                          <S.FotoAtualizacao
                            key={url}
                            style={{ backgroundImage: `url(${url})` }}
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
    </S.Pagina>
  );
}