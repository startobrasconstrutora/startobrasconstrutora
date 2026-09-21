import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import * as S from './ObraModal.styles.jsx'

const rotuloTipoObra = {
  construcao: 'Construção',
  reforma: 'Reforma'
}

function formatarData(data) {
  if (!data) return null
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function ObraModal({ id, onFechar }) {
  const [obra, setObra] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [imagemZoomAtiva, setImagemZoomAtiva] = useState(null)
  const [nivelZoom, setNivelZoom] = useState(100)

  useEffect(() => {
    if (!id) return
    buscarObra()
  }, [id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const buscarObra = async () => {
    setCarregando(true)
    setImagemAtiva(0)
    try {
      const { data, error } = await supabase
        .from('obras_concluidas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setObra(data)
    } catch (err) {
      console.error('Erro ao carregar obra:', err.message)
    } finally {
      setCarregando(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onFechar()
  }

  const handleZoomOverlayClick = (e) => {
    if (e.target === e.currentTarget) setImagemZoomAtiva(null)
  }

  const aumentarZoom = () => {
    setNivelZoom((prev) => Math.min(prev + 25, 300))
  }

  const diminuirZoom = () => {
    setNivelZoom((prev) => Math.max(prev - 25, 100))
  }

  const fotos = obra
    ? (obra.galeria_fotos && obra.galeria_fotos.length > 0
        ? obra.galeria_fotos
        : (obra.foto_capa ? [obra.foto_capa] : []))
    : []

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Modal>
        <S.BotaoFechar onClick={onFechar} aria-label="Fechar">✕</S.BotaoFechar>

        {carregando || !obra ? (
          <S.Carregando>Carregando obra...</S.Carregando>
        ) : (
          <>
            <S.Cabecalho>
              {obra.tipo_obra && <span>{rotuloTipoObra[obra.tipo_obra] || obra.tipo_obra}</span>}
              <h1>{obra.nome_obra}</h1>
            </S.Cabecalho>

            {fotos.length > 0 && (
              <>
                <S.ImagemPrincipal onClick={() => setImagemZoomAtiva(imagemAtiva)}>
                  <img src={fotos[imagemAtiva]} alt={obra.nome_obra} />
                </S.ImagemPrincipal>

                {fotos.length > 1 && (
                  <S.GridMiniaturas>
                    {fotos.map((url, idx) => (
                      <S.Miniatura
                        key={idx}
                        $ativa={idx === imagemAtiva}
                        onClick={() => setImagemAtiva(idx)}
                      >
                        <img src={url} alt={`${obra.nome_obra} - foto ${idx + 1}`} />
                      </S.Miniatura>
                    ))}
                  </S.GridMiniaturas>
                )}
              </>
            )}

            <S.Corpo>
              <S.Descricao>
                {obra.descricao && (
                  <>
                    <h3>Sobre a obra</h3>
                    <p>{obra.descricao}</p>
                  </>
                )}

                {obra.destaques && obra.destaques.length > 0 && (
                  <S.ListaDestaques>
                    {obra.destaques.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </S.ListaDestaques>
                )}

                {obra.depoimento_cliente && (
                  <S.Depoimento>"{obra.depoimento_cliente}"</S.Depoimento>
                )}
              </S.Descricao>

              <S.InfoBox>
                <h3>Detalhes da obra</h3>

                {obra.cidade && (
                  <S.LinhaInfo>
                    <strong>Localização</strong>
                    <span>{[obra.bairro, obra.cidade].filter(Boolean).join(', ')}</span>
                  </S.LinhaInfo>
                )}

                {obra.area_construida && (
                  <S.LinhaInfo>
                    <strong>Área construída</strong>
                    <span>{obra.area_construida} m²</span>
                  </S.LinhaInfo>
                )}

                {obra.tamanho_terreno && (
                  <S.LinhaInfo>
                    <strong>Terreno</strong>
                    <span>{obra.tamanho_terreno} m²</span>
                  </S.LinhaInfo>
                )}

                {obra.tempo_execucao && (
                  <S.LinhaInfo>
                    <strong>Tempo de execução</strong>
                    <span>{obra.tempo_execucao}</span>
                  </S.LinhaInfo>
                )}

                {obra.data_inicio && (
                  <S.LinhaInfo>
                    <strong>Início</strong>
                    <span>{formatarData(obra.data_inicio)}</span>
                  </S.LinhaInfo>
                )}

                {obra.data_conclusao && (
                  <S.LinhaInfo>
                    <strong>Conclusão</strong>
                    <span>{formatarData(obra.data_conclusao)}</span>
                  </S.LinhaInfo>
                )}
              </S.InfoBox>
            </S.Corpo>
          </>
        )}
      </S.Modal>

   {imagemZoomAtiva !== null && (
  <S.OverlayZoom onClick={handleZoomOverlayClick}>
    <S.BotaoFecharZoom onClick={() => setImagemZoomAtiva(null)} aria-label="Fechar zoom">
      ✕
    </S.BotaoFecharZoom>

    <S.ContainerImagemZoom>
      {fotos.length > 1 && (
        <S.BotaoNavegacao
          $esquerda
          onClick={() => setImagemZoomAtiva((prev) => (prev - 1 + fotos.length) % fotos.length)}
          aria-label="Foto anterior"
        >
          ‹
        </S.BotaoNavegacao>
      )}

      <S.ImagemZoom 
        src={fotos[imagemZoomAtiva]} 
        alt={obra.nome_obra}
        style={{ scale: `${nivelZoom}%` }}
      />

      {fotos.length > 1 && (
        <S.BotaoNavegacao
          $direita
          onClick={() => setImagemZoomAtiva((prev) => (prev + 1) % fotos.length)}
          aria-label="Próxima foto"
        >
          ›
        </S.BotaoNavegacao>
      )}
    </S.ContainerImagemZoom>

    <S.BarraControlesZoom>
      <S.BotaoZoomMenos
        onClick={diminuirZoom}
        disabled={nivelZoom <= 100}
        aria-label="Diminuir zoom"
      >
        −
      </S.BotaoZoomMenos>

      <S.ContadorNivelZoom>{nivelZoom}%</S.ContadorNivelZoom>

      <S.BotaoZoomMais
        onClick={aumentarZoom}
        disabled={nivelZoom >= 300}
        aria-label="Aumentar zoom"
      >
        +
      </S.BotaoZoomMais>
    </S.BarraControlesZoom>

    {fotos.length > 1 && (
      <S.ContadorZoom>
        {imagemZoomAtiva + 1} / {fotos.length}
      </S.ContadorZoom>
    )}
  </S.OverlayZoom>
)}
    </S.Overlay>
  )
}

export default ObraModal