import * as S from './Construcao.styles.jsx'
import heroImg from "../assets/img/construcao.png"

const ETAPAS = [
  {
    passo: "01",
    titulo: "Aprovação de Crédito",
    texto: "Analisamos sua documentação e aprovamos seu crédito na Caixa em 24h a 48h. Atendemos tanto profissionais registrados (CLT) quanto autônomos."
  },
  {
    passo: "02",
    titulo: "Escolha do Terreno",
    texto: "Com o crédito aprovado, ajudamos na escolha do lote ideal através de nossa imobiliária parceira. O terreno é financiado junto com a construção."
  },
  {
    passo: "03",
    titulo: "Projeto Sob Medida",
    texto: "Elaboramos o projeto arquitetônico personalizado para as necessidades da sua família, respeitando o orçamento do financiamento."
  },
  {
    passo: "04",
    titulo: "Burocracia & Prefeitura",
    texto: "Resolvemos todas as etapas burocráticas: aprovação do projeto na prefeitura, alvarás de construção e trâmites de cartório."
  },
  {
    passo: "05",
    titulo: "Execução da Obra",
    texto: "Nossa equipe multidisciplinar (engenharia, pedreiros, eletricistas, encanadores e pintores) executa a obra no prazo de 6 a 10 meses."
  },
  {
    passo: "06",
    titulo: "Entrega do Habite-se",
    texto: "Entregamos a casa pronta para morar com a documentação 100% regularizada e o Habite-se finalizado."
  }
]

const DIFERENCIAIS = [
  {
    titulo: "Financiamento Completo",
    desc: "Financie terreno e construção em uma única operação pelo programa Minha Casa Minha Vida, utilizando seu FGTS e subsídios do governo."
  },
  {
    titulo: "Parcelamento Próprio",
    desc: "Se faltar recurso para a entrada ou para expandir a obra, oferecemos crédito e parcelamento direto com a construtora."
  },
  {
    titulo: "Zero Preocupação com a Caixa",
    desc: "Conduzimos todo o processo direto com a Caixa Econômica Federal. Você não precisa ir ao banco resolver burocracias."
  },
  {
    titulo: "Acompanhamento da Obra",
    desc: "Transparência total na execução com relatórios de evolução e visitas agendadas para você acompanhar de perto o seu imóvel."
  }
]

function Construcao() {
  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Construção do zero Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>CONSTRUÇÃO DO ZERO</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <h2>Construímos a sua casa própria do jeito que você sempre sonhou</h2>
          <p>
            Na <strong>Start Obras</strong>, nosso foco principal é a <strong>construção residencial do zero</strong>. Especialistas no programa <strong>Minha Casa Minha Vida</strong>, oferecemos a solução no modelo "chave na mão": cuidamos de absolutamente tudo, desde a aprovação do seu crédito até a entrega da casa pronta para morar.
          </p>
          <p>
            Você não precisa nem ter um terreno comprado. Financiamos a aquisição do lote junto com a construção na mesma operação com a Caixa Econômica Federal, garantindo taxas acessíveis e facilidade no pagamento.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.EtapasSection>
        <S.SectionTitle>Como funciona o processo de construção</S.SectionTitle>
        <S.GridEtapas>
          {ETAPAS.map((item) => (
            <S.EtapaCard key={item.passo}>
              <span className="numero">{item.passo}</span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </S.EtapaCard>
          ))}
        </S.GridEtapas>
      </S.EtapasSection>

      <S.DiferenciaisSection>
        <S.SectionTitle>Por que construir com a Start Obras?</S.SectionTitle>
        <S.GridDiferenciais>
          {DIFERENCIAIS.map((item, idx) => (
            <S.DiferencialCard key={idx}>
              <h4>{item.titulo}</h4>
              <p>{item.desc}</p>
            </S.DiferencialCard>
          ))}
        </S.GridDiferenciais>

        <S.CtaWrapper>
          <S.CtaButton href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
            Solicitar Simulação Gratuita
          </S.CtaButton>
        </S.CtaWrapper>
      </S.DiferenciaisSection>
    </S.Page>
  )
}

export default Construcao