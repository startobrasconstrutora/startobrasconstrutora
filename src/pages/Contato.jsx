import * as S from './Contato.styles.jsx'
import heroImg from "../assets/img/capacete.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faMobileScreenButton, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'

const REDES_SOCIAIS = [
  { id: "instagram", icon: faInstagram, url: "https://instagram.com/seuperfil" },
  { id: "facebook", icon: faFacebookF, url: "https://facebook.com/suapagina" },
  { id: "whatsapp", icon: faWhatsapp, url: "https://wa.me/5514997749710" },
]

function Contato() {
  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>CONTATO</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <p>
            Estamos sempre prontos para atender você com agilidade, seja por telefone, WhatsApp
            ou redes sociais. Nossa equipe está disponível para tirar dúvidas, fazer orçamentos e
            acompanhar de perto cada etapa do seu projeto, garantindo um atendimento próximo e
            transparente do início ao fim.
          </p>
          <S.CtaButton
            onClick={() =>
              window.open("https://wa.me/5514997749710", "_blank")
            }
          >
            Entrar em Contato Via WhatsApp
          </S.CtaButton>
        </S.IntroContent>
      </S.IntroSection>

      <S.ContatoSection>
        <S.ContatoGrid>
          <S.ContatoCard>
            <S.ContatoIcone
              onClick={() => (window.location.href = "tel:+5514997749710")}
            >
              <FontAwesomeIcon icon={faPhone} />
              <S.ContatoLabel>Telefone:</S.ContatoLabel>
              <S.ContatoValor>(14) 99774-9710</S.ContatoValor>
            </S.ContatoIcone>

            <S.ContatoDivider />

            <S.ContatoIcone
              onClick={() =>
                window.open("https://wa.me/5514997749710", "_blank")
              }
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <S.ContatoLabel>WhatsApp:</S.ContatoLabel>
              <S.ContatoValor>(14) 99774-9710</S.ContatoValor>
            </S.ContatoIcone>
          </S.ContatoCard>

        <S.ContatoCard>
  <S.ContatoIcone
    onClick={() => (window.location.href = "mailto:juridico@startobras.com")}
  >
    <FontAwesomeIcon icon={faEnvelope} />
    <S.ContatoLabel>E-mail Jurídico:</S.ContatoLabel>
    <S.ContatoValor>juridico@startobras.com</S.ContatoValor>
  </S.ContatoIcone>

  <S.ContatoDivider />

  <S.ContatoIcone
    onClick={() => (window.location.href = "mailto:projetos@startobras.com")}
  >
    <FontAwesomeIcon icon={faEnvelope} />
    <S.ContatoLabel>E-mail Projetos:</S.ContatoLabel>
    <S.ContatoValor>projetos@startobras.com</S.ContatoValor>
  </S.ContatoIcone>
</S.ContatoCard>

          <S.ContatoCard>
            <S.ContatoIcon>
              <FontAwesomeIcon icon={faMobileScreenButton} />
            </S.ContatoIcon>
            <S.ContatoLabel>Redes Sociais:</S.ContatoLabel>
            <S.RedesSociaisRow>
              {REDES_SOCIAIS.map((r) => (
                <S.RedeSocialLink key={r.id} href={r.url} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={r.icon} />
                </S.RedeSocialLink>
              ))}
            </S.RedesSociaisRow>
          </S.ContatoCard>
        </S.ContatoGrid>
      </S.ContatoSection>
    </S.Page>
  )
}

export default Contato