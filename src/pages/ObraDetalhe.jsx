import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import * as S from './ObraDetalhe.styles.jsx'

const rotuloTipoObra = {
  construcao: 'Construção',
  reforma: 'Reforma'
}

function formatarData(data) {
  if (!data) return null
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function ObraDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [obra, setObra] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrada, setNaoEncontrada] = useState(false)
  const [imagemAtiva, setImagemAtiva] = useState(0)

  useEffect(() => {
    buscarObra()
    window.scrollTo(0, 0)
  }, [id])

  const buscarObra = async () => {
    setCarregando(true)
    setNaoEncontrada(false)
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
      setNaoEncontrada(true)
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return (
      <S.Wrapper>
        <S.Carregando>Carregando obra...</S.Carregando>
      </S.Wrapper>
    )
  }

  if (naoEncontrada || !obra) {
    return (
      <S.Wrapper>
        <S.NaoEncontrada>
          <p>Obra não encontrada.</p>
          <Link to="/">Voltar para a página inicial</Link>
        </S.NaoEncontrada>
      </S.Wrapper>
    )
  }

  const fotos = obra.galeria_fotos && obra.galeria_fotos.length > 0
    ? obra.galeria_fotos
    : (obra.foto_capa ? [obra.foto_capa] : [])

  return (
    <S.Wrapper>
      <S.BotaoVoltar onClick={() => navigate(-1)}>
        ← Voltar
      </S.BotaoVoltar>

      <S.Cabecalho>
        {obra.tipo_obra && <span>{rotuloTipoObra[obra.tipo_obra] || obra.tipo_obra}</span>}
        <h1>{obra.nome_obra}</h1>
      </S.Cabecalho>

      {fotos.length > 0 && (
        <>
          <S.ImagemPrincipal onClick={() => setImagemAtiva((prev) => (prev + 1) % fotos.length)}>
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
            <S.Depoimento>“{obra.depoimento_cliente}”</S.Depoimento>
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
    </S.Wrapper>
  )
}

export default ObraDetalhe