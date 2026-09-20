import { useState, useEffect } from 'react'
import * as S from './home.styles.jsx'
import DivComum from '../components/DivComum.jsx'
import SwiperMod from '../components/SwiperPrincipal.jsx'
import BannerFull from '../components/BannerFull.jsx'
import BannerImagemFull from '../components/BannerImagemFull.jsx'
import SwiperObras from '../components/SwiperObras.jsx'
import ObraModal from '../components/ObraModal.jsx'
import { supabase } from '../supabaseClient'
import slide1 from "../assets/img/slide1.png"
import slide2 from "../assets/img/slide2.png"
import texto_imagem from "../assets/img/capacete.png"
import texto_imagem2 from "../assets/img/caixa.png"
import { Content } from '../components/DivComum.styles.jsx'
import { Link } from 'react-router-dom'
import { Faixa } from '../components/faixa.jsx'
import { Reveal } from '../components/Reveal.jsx'
import MateriasHome from '../components/MateriasHome.jsx'

function Home() {
  const [obrasConcluidas, setObrasConcluidas] = useState([])
  const [obraSelecionadaId, setObraSelecionadaId] = useState(null)

  useEffect(() => {
    buscarObrasConcluidas()
  }, [])

  const buscarObrasConcluidas = async () => {
    try {
      const { data, error } = await supabase
        .from('obras_concluidas')
        .select('*')
        .eq('oculta_da_home', false)
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error

      const obrasFormatadas = (data || [])
        .filter((obra) => obra.foto_capa || (obra.galeria_fotos && obra.galeria_fotos[0]))
        .map((obra) => ({
          id: obra.id,
          src: obra.foto_capa || obra.galeria_fotos[0],
          titulo: obra.nome_obra
        }))

      setObrasConcluidas(obrasFormatadas)
    } catch (err) {
      console.error('Erro ao carregar obras concluídas:', err.message)
    }
  }

  return (
    <>
      <S.ContainerSwiper>
        <SwiperMod
          slides={[
            { src: slide1, titulo: '', descricao: '' },
             { src: slide2, titulo: '', descricao: '' },
          ]}
        />

        <S.SvgOverlay>
          <svg viewBox="-10 0 700 113" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10 72 C120 58, 280 85, 440 68 S600 52, 690 75" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
            <path d="M-10 82 C100 68, 260 95, 420 78 S580 62, 690 85" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
            <path d="M-10 95 C140 78, 300 108, 460 90 S620 68, 690 97 L690 200 L-10 200 Z" fill="rgb(218, 217, 217)" stroke="none"/>
          </svg>
        </S.SvgOverlay>
      </S.ContainerSwiper>

      <div className="Subpagina">
        <S.Container>

          <S.DivCentro>
            <Reveal>
            <S.CardsRow>
              <S.Card>
                <S.CardImg>
                  <img src={texto_imagem} alt="Obra em andamento" />
                </S.CardImg>
                <S.CardTexto>
                  <h2>Construção civil em Bauru e Região</h2>
                  <ul>
                    <li>Construção residencial</li>
                    <li>Construção comercial</li>
                    <li>Reformas e ampliações</li>
                    <li>Gerenciamento de obras</li>
                  </ul>
                </S.CardTexto>
              </S.Card>

              <S.Card>
                <S.CardImg>
                  <img src={texto_imagem2} alt="Obra em andamento" />
                </S.CardImg>
                <S.CardTexto>
                  <h2>Do terreno às chaves da sua casa</h2>
                  <ul>
                    Escolha seu terreno e Cuidamos da documentação, do financiamento habitacional <br/>
                    e da construção para você.
                    <strong> Financiamento pela Caixa econômica Federal</strong>
                  </ul>
                </S.CardTexto>
              </S.Card>
            </S.CardsRow>
            </Reveal>
          </S.DivCentro>

<Reveal delay={0.1}>
          <S.StatsBar>
            <S.StatItem>
              <strong>Confiança que se constrói</strong>
              <span>Construir é um compromisso que não aceita atalhos. Nossa equipe própria acompanha sua obra do início ao fim, garantindo qualidade, 
                segurança e o cuidado que sua família e seu investimento merecem.</span>
            </S.StatItem>
          </S.StatsBar>
          </Reveal>

          <br />

{obrasConcluidas.length > 0 && (
<Reveal delay={0.2}>
          <S.ObrasSection>
            <h2>Obras prontas</h2>
            <SwiperObras obras={obrasConcluidas} onSelecionar={setObraSelecionadaId} />
          </S.ObrasSection>
</Reveal>
)}

<Reveal delay={0.3}>
          <MateriasHome />
</Reveal>

        </S.Container>
      </div>

      {obraSelecionadaId && (
        <ObraModal id={obraSelecionadaId} onFechar={() => setObraSelecionadaId(null)} />
      )}
    </>
  )
}

export default Home