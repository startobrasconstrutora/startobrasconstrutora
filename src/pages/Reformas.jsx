import React from 'react'
import * as S from './Reformas.styles.jsx'
import heroImg from "../assets/img/reforma1.png"

const PROFISSIONAIS = [
  {
    id: "hidraulica",
    label: "Hidráulica",
    descricao: "Encanadores para vazamentos, troca de tubulação e reparos em geral.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    )
  },
  {
    id: "eletrica",
    label: "Elétrica",
    descricao: "Eletricistas para quadros de força, fiação, iluminação e curtos.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  },
  {
    id: "gesso",
    label: "Gesso & Drywall",
    descricao: "Especialistas em sancas, rebaixamentos, divisórias e placas de gesso.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    )
  },
  {
    id: "carpintaria",
    label: "Carpintaria",
    descricao: "Carpinteiros para portas, telhados, estruturas e decks de madeira.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14 6 7 7-4 4-7-7" />
        <path d="m3 21 8-8" />
        <path d="m3 13 8 8" />
      </svg>
    )
  },
  {
    id: "pintura",
    label: "Pintura",
    descricao: "Pintores para acabamento fino, massamento, fachadas e interiores.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
        <path d="m5 2 5 5" />
        <path d="M2 13h15" />
        <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
      </svg>
    )
  },
  {
    id: "alvenaria",
    label: "Alvenaria",
    descricao: "Pedreiros para construção, demolição, assentamento de pisos e estrutura.",
    svg: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22h20" />
        <path d="M12 6V2" />
        <path d="M7 10h10" />
        <path d="M5 14h14" />
        <path d="M3 18h18" />
        <path d="M10 6 7 10" />
        <path d="m14 6 3 10" />
      </svg>
    )
  }
]

const DIFERENCIAIS = [
  {
    id: "gestao",
    label: "Gestão Profissional",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Gest%C3%A3o",
    texto:
      "Acompanhamento técnico rigoroso em todas as etapas da reforma, garantindo o cumprimento do cronograma e orçamento transparente sem custos ocultos.",
    align: "left",
  },
  {
    id: "qualidade",
    label: "Mão de Obra Qualificada",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Equipe",
    texto:
      "Equipe fixa e especializada para cada etapa do projeto, mantendo o canteiro limpo, organizado e focado no padrão de acabamento refinado.",
    align: "right",
  },
]

function Reformas() {
  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Reformas e Manutenções Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>REFORMAS E MANUTENÇÕES</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <h2>Transforme e valorize seu imóvel com segurança e sem surpresas</h2>
          <p>
            Renovar um ambiente exige planejamento e acompanhamento técnico para evitar custos desnecessários. Na <strong>Start Obras</strong>, aplicamos toda a nossa expertise em engenharia e execução para renovar casas, apartamentos e espaços comerciais.
          </p>
          <p>
            Gerenciamos cada etapa com uma equipe multidisciplinar qualificada, cuidando da escolha de materiais de alta qualidade, cumprimento de prazos e organização do canteiro de obras.
          </p>
          <div style={{ textAlign: "center" }}>
            <S.CtaButton
              href="https://wa.me/5514997749710?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20reforma."
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar Orçamento
            </S.CtaButton>
          </div>
        </S.IntroContent>
      </S.IntroSection>

      <S.EspecialidadesSection>
        <S.EspecialidadesContainer>
          <h2>Equipe Especializada para Qualquer Porte de Obra</h2>
          <p className="subtitulo">
            Atendemos desde <strong>pequenos reparos e manutenções pontuais</strong> até <strong>grandes reformas estruturais</strong> com profissionais qualificados para cada etapa.
          </p>
          <S.EspecialidadesGrid>
            {PROFISSIONAIS.map((prof) => (
              <S.EspecialidadeCard key={prof.id}>
                <S.EspecialidadeIcon>{prof.svg}</S.EspecialidadeIcon>
                <h3>{prof.label}</h3>
                <p>{prof.descricao}</p>
              </S.EspecialidadeCard>
            ))}
          </S.EspecialidadesGrid>
        </S.EspecialidadesContainer>
      </S.EspecialidadesSection>

      <S.ValoresSection>
        <S.ValoresTitle>Por que reformar com a Start Obras?</S.ValoresTitle>
        {DIFERENCIAIS.map((d) => (
          <S.ValorRow key={d.id} $align={d.align}>
            <S.ValorImg>
              <img src={d.img} alt={`Ícone ${d.label}`} />
            </S.ValorImg>
            <S.ValorTexto $align={d.align}>
              <h2>{d.label}</h2>
              <p>{d.texto}</p>
            </S.ValorTexto>
          </S.ValorRow>
        ))}
      </S.ValoresSection>
    </S.Page>
  )
}

export default Reformas