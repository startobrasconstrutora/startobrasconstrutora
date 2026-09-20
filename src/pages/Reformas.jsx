import React from 'react'
import * as S from './Reformas.styles.jsx'
import heroImg from "../assets/img/capacete.png"

const SERVICOS = [
  {
    id: "residenciais",
    label: "Residenciais & Comerciais",
    texto: "Reformas completas com redistribuição de layout, modernização de fachadas e acabamentos de alto padrão.",
  },
  {
    id: "manutencao",
    label: "Manutenção Preventiva",
    texto: "Correção de infiltrações, trincas, problemas estruturais e desgaste natural com diagnóstico técnico preciso.",
  },
  {
    id: "eletrica-hidraulica",
    label: "Elétrica & Hidráulica",
    texto: "Substituição de redes antigas, novos pontos de energia, projetos de iluminação e tubulações de água e esgoto.",
  },
  {
    id: "pintura-revestimento",
    label: "Pintura & Revestimentos",
    texto: "Aplicação de tintas premium, efeitos decorativos, assentamento de porcelanatos, pisos laminados e vinílicos.",
  },
  {
    id: "telhados",
    label: "Telhados & Impermeabilização",
    texto: "Revisão e impermeabilização de lajes, calhas e coberturas para eliminação definitiva de vazamentos.",
  },
  {
    id: "gesso-drywall",
    label: "Gesso & Drywall",
    texto: "Rebaixamento de teto, sancas decorativas, divisórias em drywall e fiação pronta para iluminação em LED.",
  },
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

      <S.ServicosSection>
        {SERVICOS.map((servico) => (
          <S.ServicoCard key={servico.id}>
            <h4>{servico.label}</h4>
            <p>{servico.texto}</p>
          </S.ServicoCard>
        ))}
      </S.ServicosSection>

      <S.ValoresSection>
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