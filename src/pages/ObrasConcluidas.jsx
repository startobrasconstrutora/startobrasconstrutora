import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ObraModal from '../components/ObraModal.jsx'
import heroImg from '../assets/img/capacete.png'
import * as S from './ObrasConcluidas.styles.jsx'

const rotuloTipoObra = {
  construcao: 'Construção',
  reforma: 'Reforma'
}

function ObrasConcluidas() {
  const [obras, setObras] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [obraSelecionadaId, setObraSelecionadaId] = useState(null)

  useEffect(() => {
    buscarObras()
  }, [])

  const buscarObras = async () => {
    setCarregando(true)
    try {
      const { data, error } = await supabase
        .from('obras_concluidas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setObras(data || [])
    } catch (err) {
      console.error('Erro ao carregar obras concluídas:', err.message)
    } finally {
      setCarregando(false)
    }
  }

  const obrasFiltradas = obras.filter((obra) =>
    filtroTipo === 'todas' ? true : obra.tipo_obra === filtroTipo
  )

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obras concluídas" />
        </S.HeroImage>
        <S.HeroBadge>OBRAS CONCLUÍDAS</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <p>
            Confira alguns dos projetos que já entregamos em Bauru e região.
            Clique em uma obra para ver fotos e detalhes completos.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.Filtros>
        <S.BotaoFiltro $ativo={filtroTipo === 'todas'} onClick={() => setFiltroTipo('todas')}>
          Todas
        </S.BotaoFiltro>
        <S.BotaoFiltro $ativo={filtroTipo === 'construcao'} onClick={() => setFiltroTipo('construcao')}>
          Construção
        </S.BotaoFiltro>
        <S.BotaoFiltro $ativo={filtroTipo === 'reforma'} onClick={() => setFiltroTipo('reforma')}>
          Reforma
        </S.BotaoFiltro>
      </S.Filtros>

      {carregando ? (
        <S.VazioLista>Carregando obras...</S.VazioLista>
      ) : obrasFiltradas.length === 0 ? (
        <S.VazioLista>Nenhuma obra encontrada.</S.VazioLista>
      ) : (
        <S.GridSection>
          {obrasFiltradas.map((obra) => {
            const capa = obra.foto_capa || (obra.galeria_fotos && obra.galeria_fotos[0]) || ''
            return (
              <S.ObraCard key={obra.id} onClick={() => setObraSelecionadaId(obra.id)}>
                <S.ObraCardImg>
                  {obra.tipo_obra && (
                    <S.SeloTipo>{rotuloTipoObra[obra.tipo_obra] || obra.tipo_obra}</S.SeloTipo>
                  )}
                  {capa ? (
                    <img src={capa} alt={obra.nome_obra} />
                  ) : null}
                </S.ObraCardImg>
                <S.ObraCardBody>
                  <h3>{obra.nome_obra}</h3>
                  {obra.cidade && <p>{[obra.bairro, obra.cidade].filter(Boolean).join(', ')}</p>}
                </S.ObraCardBody>
              </S.ObraCard>
            )
          })}
        </S.GridSection>
      )}

      {obraSelecionadaId && (
        <ObraModal id={obraSelecionadaId} onFechar={() => setObraSelecionadaId(null)} />
      )}
    </S.Page>
  )
}

export default ObrasConcluidas