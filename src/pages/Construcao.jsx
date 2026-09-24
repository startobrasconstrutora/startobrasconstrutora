import { useState } from 'react'
import * as S from './Construcao.styles.jsx'
import heroImg from "../assets/img/construcao.jpg"

const ETAPAS_CAIXA = [
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
    titulo: "Burocracia Documental",
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

const ETAPAS_PROPRIOS = [
  {
    passo: "01",
    titulo: "Alinhamento & Orçamento",
    texto: "Entendemos suas necessidades e definimos o escopo do projeto de acordo com o seu planejamento financeiro."
  },
  {
    passo: "02",
    titulo: "Escolha do Terreno & Projeto",
    texto: "Auxiliamos na escolha do lote ideal (caso ainda não possua) e criamos um projeto arquitetônico 100% personalizado."
  },
  {
    passo: "03",
    titulo: "Burocracia Documental",
    texto: "Cuidamos de toda a documentação, incluindo aprovações na prefeitura, alvarás de construção e procedimentos de cartório."
  },
  {
    passo: "04",
    titulo: "Cronograma de Pagamento",
    texto: "Estruturamos um plano de pagamentos personalizado por etapas da obra, aceitando dinheiro e/ou permutas."
  },
  {
    passo: "05",
    titulo: "Execução da Obra",
    texto: "Executamos a construção com acompanhamento técnico contínuo, mantendo alto padrão e respeito aos prazos combinados."
  },
  {
    passo: "06",
    titulo: "Chave na Mão",
    texto: "Finalizamos o imóvel com habite-se e regularização completa, pronto para você morar ou investir."
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
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('caixa')

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Construção do zero Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>CONSTRUÇÃO DO ZERO</S.HeroBadge>
      </S.HeroWrapper>

      <S.TabNavWrapper>
        <S.TabButton 
          $active={opcaoSelecionada === 'caixa'} 
          onClick={() => setOpcaoSelecionada('caixa')}
        >
          Construção Financiamento Caixa
        </S.TabButton>
        <S.TabButton 
          $active={opcaoSelecionada === 'proprios'} 
          onClick={() => setOpcaoSelecionada('proprios')}
        >
          Construção com Recursos Próprios
        </S.TabButton>
      </S.TabNavWrapper>

      <S.IntroSection>
        <S.IntroContent>
          {opcaoSelecionada === 'caixa' ? (
            <>
              <h2>Construímos a sua casa própria pelo Financiamento Caixa</h2>
              <p>
                Na <strong>Start Obras</strong>, nosso foco principal é a <strong>construção residencial do zero</strong>. Especialistas no programa <strong>Minha Casa Minha Vida</strong>, oferecemos a solução no modelo "chave na mão": cuidamos de absolutamente tudo, desde a aprovação do seu crédito até a entrega da casa pronta para morar.
              </p>
              <p>
                Você não precisa nem ter um terreno comprado. Financiamos a aquisição do lote junto com a construção na mesma operação com a Caixa Econômica Federal, garantindo taxas acessíveis e facilidade no pagamento.
              </p>
            </>
          ) : (
            <>
              <h2>Construção sob medida com Recursos Próprios</h2>
              <p>
                Se você opta por não utilizar recursos de financiamento bancário, a <strong>Start Obras</strong> oferece condições flexíveis e totalmente personalizadas para tirar a sua obra do papel.
              </p>
              <p>
                Nesta modalidade, você paga conforme o avanço das etapas negociadas na contratação. Além do pagamento em dinheiro, oferecemos facilidades exclusivas: aceitamos <strong>permutas</strong> em negociação, incluindo <strong>outros imóveis, veículos, equipamentos</strong> e diversos bens como parte do pagamento. Cuidamos do seu projeto com a mesma qualidade e agilidade, garantindo total transparência e entrega no prazo.
              </p>
            </>
          )}
        </S.IntroContent>
      </S.IntroSection>

      <S.EtapasSection>
        <S.SectionTitle>
          {opcaoSelecionada === 'caixa' 
            ? "Como funciona o processo de construção (Caixa)" 
            : "Como funciona o processo de construção (Recursos Próprios)"}
        </S.SectionTitle>
        <S.GridEtapas>
          {(opcaoSelecionada === 'caixa' ? ETAPAS_CAIXA : ETAPAS_PROPRIOS).map((item) => (
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
            {opcaoSelecionada === 'caixa' ? "Solicitar Simulação Gratuita" : "Fazer um Orçamento Personalizado"}
          </S.CtaButton>
        </S.CtaWrapper>
      </S.DiferenciaisSection>
    </S.Page>
  )
}

export default Construcao