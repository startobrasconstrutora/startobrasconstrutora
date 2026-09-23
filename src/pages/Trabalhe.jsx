import { useState } from 'react'
import * as S from './Trabalhe.styles.jsx' // ou TrabalheConosco.styles.jsx
import heroImg from "../assets/img/capacete.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faUser, faEnvelope, faPhone, faBriefcase, faFileText } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const CARGOS = [
  "Pedreiro / Servente",
  "Mestre de Obras / Encarregado",
  "Arquiteto(a) / Engenheiro(a)",
  "Pintor",
  "Carpinteiro / Marceneiro",
  "Eletricista / Encanador",
  "Gesseiro / Azulejista",
  "Outro"
]

function TrabalheConosco() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: CARGOS[0],
    mensagem: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const emailDestino = "trabalhe@startobrasconstrutora.com.br"
    const assunto = encodeURIComponent(`Candidatura - ${formData.cargo}: ${formData.nome}`)
    const corpo = encodeURIComponent(
      `Nome: ${formData.nome}\n` +
      `E-mail: ${formData.email}\n` +
      `Telefone/WhatsApp: ${formData.telefone}\n` +
      `Vaga/Área de Interesse: ${formData.cargo}\n\n` +
      `Experiência / Mensagem:\n${formData.mensagem}`
    )

    window.location.href = `mailto:${emailDestino}?subject=${assunto}&body=${corpo}`
  }

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Trabalhe na Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>TRABALHE CONOSCO</S.HeroBadge>
      </S.HeroWrapper>

      <S.IntroSection>
        <S.IntroContent>
          <p>
            Estamos sempre em busca de novos talentos para construir o futuro junto com a gente. Seja você pedreiro, arquiteto, pintor, carpinteiro ou especialista de outras áreas da construção civil, nossa equipe valoriza quem trabalha com dedicação, capricho e compromisso. Oferecemos um ambiente de respeito, oportunidade de crescimento e projetos desafiadores para você evoluir na sua carreira do início ao fim.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.ContatoSection>
        <S.FormularioContainer onSubmit={handleSubmit}>
          <S.FormTitle>Envie seu interesse / Cadastro</S.FormTitle>

          <S.InputGroup>
            <S.Label><FontAwesomeIcon icon={faUser} /> Nome Completo</S.Label>
            <S.Input 
              type="text" 
              name="nome" 
              required 
              placeholder="Digite seu nome" 
              value={formData.nome}
              onChange={handleChange}
            />
          </S.InputGroup>

          <S.FormRow>
            <S.InputGroup>
              <S.Label><FontAwesomeIcon icon={faEnvelope} /> E-mail</S.Label>
              <S.Input 
                type="email" 
                name="email" 
                required 
                placeholder="seuemail@exemplo.com" 
                value={formData.email}
                onChange={handleChange}
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label><FontAwesomeIcon icon={faPhone} /> Telefone / WhatsApp</S.Label>
              <S.Input 
                type="tel" 
                name="telefone" 
                required 
                placeholder="(14) 99999-9999" 
                value={formData.telefone}
                onChange={handleChange}
              />
            </S.InputGroup>
          </S.FormRow>

          <S.InputGroup>
            <S.Label><FontAwesomeIcon icon={faBriefcase} /> Área de Atuação / Cargo</S.Label>
            <S.Select name="cargo" value={formData.cargo} onChange={handleChange}>
              {CARGOS.map((cargo, idx) => (
                <option key={idx} value={cargo}>{cargo}</option>
              ))}
            </S.Select>
          </S.InputGroup>

          <S.InputGroup>
            <S.Label><FontAwesomeIcon icon={faFileText} /> Resumo da sua experiência</S.Label>
            <S.Textarea 
              name="mensagem" 
              rows="4" 
              placeholder="Conte um pouco sobre suas experiências anteriores ou obras que já realizou..."
              value={formData.mensagem}
              onChange={handleChange}
            />
          </S.InputGroup>

          <S.CtaButton type="submit">
            <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '8px' }} />
            Enviar Candidatura por E-mail
          </S.CtaButton>
        </S.FormularioContainer>
      </S.ContatoSection>
    </S.Page>
  )
}

export default TrabalheConosco