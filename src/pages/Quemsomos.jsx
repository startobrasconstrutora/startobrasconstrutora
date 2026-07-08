import * as S from './Quemsomos.styles.jsx'
import heroImg from "../assets/img/capacete.png"

const VALORES = [
  {
    id: "missao",
    label: "Missão",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Miss%C3%A3o",
    texto:
      "Executar obras e reformas com qualidade, segurança e compromisso, entregando cada projeto no prazo combinado e com atenção aos detalhes que fazem a diferença.",
    align: "left",
  },
  {
    id: "visao",
    label: "Visão",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Vis%C3%A3o",
    texto:
      "Ser referência em construção e reforma na região, reconhecida pela solidez das obras entregues e pela confiança conquistada com cada cliente.",
    align: "right",
  },
  {
    id: "valores",
    label: "Valores",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Valores",
    texto: "Compromisso, honestidade, qualidade, pontualidade.",
    align: "left",
  },
]

// =============================================================
//  Componente
// =============================================================

function QuemSomos() {
  return (
    <S.Page>
   <S.HeroWrapper>
  <S.HeroImage>
    <img src={heroImg} alt="Obra Start Obras" />
  </S.HeroImage>
  <S.HeroBadge>QUEM SOMOS</S.HeroBadge>
</S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
        <p>
            A Start Obras é uma empresa especializada em construção e reforma, atuando com
            dedicação e compromisso em cada projeto. Contamos com uma equipe qualificada e
            experiente, pronta para transformar ideias em realidade com qualidade, agilidade e
            atenção aos detalhes.
          </p>
          <p>
            Atuamos em obras residenciais e comerciais, do planejamento à entrega final, sempre
            priorizando a satisfação do cliente. Nosso compromisso é entregar resultados que unem
            solidez, acabamento e confiança, cuidando de cada etapa da obra como se fosse a nossa
            própria casa.
          </p>
          <S.CtaButton>nossa estrutura</S.CtaButton>
        </S.IntroContent>
      </S.IntroSection>

      <S.ValoresSection>
        {VALORES.map((v) => (
          <S.ValorRow key={v.id} $align={v.align}>
            <S.ValorImg>
              <img src={v.img} alt={`Ícone ${v.label}`} />
            </S.ValorImg>
            <S.ValorTexto $align={v.align}>
              <h2>{v.label}</h2>
              <p>{v.texto}</p>
            </S.ValorTexto>
          </S.ValorRow>
        ))}
      </S.ValoresSection>
    </S.Page>
  )
}

export default QuemSomos