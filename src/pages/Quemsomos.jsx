import * as S from './Quemsomos.styles.jsx'
import heroImg from "../assets/img/capacete.png"

const VALORES = [
  {
    id: "missao",
    label: "Missão",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Miss%C3%A3o",
    texto:
      "Desmistificar o financiamento imobiliário e transformar o sonho da casa própria em realidade, entregando construções de alta qualidade, no prazo e sem burocracia para nossos clientes.",
    align: "left",
  },
  {
    id: "visao",
    label: "Visão",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Vis%C3%A3o",
    texto:
      "Ser a principal referência em construção financiada pelo Minha Casa Minha Vida na região, reconhecida pela transparência, excelência técnica e facilidade no processo.",
    align: "right",
  },
  {
    id: "valores",
    label: "Valores",
    img: "https://placehold.co/300x300/FFA52F/1e1e1e?text=Valores",
    texto: "Transparência, responsabilidade burocrática, excelência técnica, compromisso com prazos e foco nas pessoas.",
    align: "left",
  },
]

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
          <h2>Construindo histórias e facilitando o caminho até a sua casa própria</h2>
          <p>
            Fundada em 2025 por <strong>Andréia Ferreira</strong> e <strong>Elivelton Santos</strong>, a <strong>Start Obras</strong> nasceu com o propósito de simplificar o acesso à construção civil financiada. Somos especialistas no programa <strong>Minha Casa Minha Vida</strong>, atuando desde a conquista do terreno até a entrega final das chaves.
          </p>
          <p>
            Com uma equipe qualificada de <strong>12 colaboradores fixos</strong> e profissionais especializados em todas as etapas — incluindo arquitetura, engenharia, execução de obras e suporte jurídico —, cuidamos de toda a burocracia de aprovação de crédito, projetos, cartórios e prefeitura para que você viva esse momento com tranquilidade.
          </p>
          <p>
            Nossa liderança conta com expertise técnica em edificações, avaliação imobiliária credenciada pelo <strong>COFECI</strong> e acompanhamento rigoroso de cada detalhe da sua obra.
          </p>
          <S.CtaButton>Nossa Estrutura</S.CtaButton>
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