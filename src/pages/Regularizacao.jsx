import React from 'react'
import * as S from './Regularizacao.styles.jsx'
import heroImg from "../assets/img/regu.jpg"

const SERVICOS = [
  {
    id: "habite-se",
    label: "Aprovação de Habite-se",
    texto: "Regularização final da construção junto à Prefeitura para emissão da Certidão de Conclusão e Habite-se.",
  },
  {
    id: "averbacao",
    label: "Averbação da Construção",
    texto: "Registro da área construída na matrícula do imóvel no Cartório de Imóveis, garantindo valorização legal.",
  },
  {
    id: "desmembramento",
    label: "Desmembramento & Unificação",
    texto: "Processos de divisão de lotes ou unificação de terrenos com aprovação municipal e cartorária.",
  },
  {
    id: "laudos",
    label: "Laudos & Avaliação Imobiliária",
    texto: "Laudos técnicos de avaliação imobiliária com credenciamento e chancela COFECI para fins jurídicos e bancários.",
  },
  {
    id: "projetos-asbuilt",
    label: "Projetos As-Built",
    texto: "Levantamento arquitetônico detalhado da edificação existente para adequação às normas municipais.",
  },
  {
    id: "suporte-juridico",
    label: "Consultoria Cartorária e Jurídica",
    texto: "Resolução de pendências em escrituras, contratos, certidões e desembaraço burocrático completo.",
  },
]

const DIFERENCIAIS = [
  {
    id: "credenciamento",
    label: "Credenciamento COFECI",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=COFECI",
    texto:
      "Avaliações imobiliárias oficiais e pareceres técnicos elaborados por profissionais credenciados, garantindo total validade legal para regularização e financiamento.",
    align: "left",
  },
  {
    id: "descomplicado",
    label: "Zero Burocracia para Você",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Cart%C3%B3rio",
    texto:
      "Nossa equipe assume todo o trâmite junto a órgãos públicos, prefeitura e cartórios, entregando seu imóvel totalmente regularizado sem você se preocupar com filas ou papelada.",
    align: "right",
  },
]

function Regularizacao() {
  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Regularização de Imóveis Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>REGULARIZAÇÃO DE IMÓVEIS</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <h2>Deixe a burocracia por nossa conta e valorize seu patrimônio</h2>
          <p>
            Um imóvel irregular limita suas possibilidades de venda, financiamento ou valorização de mercado. Na <strong>Start Obras</strong>, cuidamos de cada detalhe técnico e jurídico para deixar sua documentação 100% em dia.
          </p>
          <p>
            Com suporte jurídico especializado e liderança credenciada pelo <strong>COFECI</strong> para avaliações imobiliárias, resolvemos pendências com a prefeitura, cartórios e órgãos ambientais de forma rápida e eficiente.
          </p>
          <div style={{ textAlign: "center" }}>
            <S.CtaButton
              href="https://wa.me/5514997749710?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20a%20regulariza%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar Meu Imóvel
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
        <S.ValoresSectionTitle>Nossos Diferenciais</S.ValoresSectionTitle>
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

export default Regularizacao