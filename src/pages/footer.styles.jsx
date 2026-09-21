import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Container = styled.footer`
  display: flex;
  background: var(--bg-cinza, #f5f5f5);
  width: 100%;
  flex-direction: column;
  font-size: clamp(10px, 1vw, 1.2rem);
  padding: 0 10%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 5%;
  }

  @media (max-width: 480px) {
    padding: 0 4%;
  }

  /* Textura de telhado em marca d'água sutil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 300' preserveAspectRatio='none'%3E%3C!-- Linhas do telhado vazando no fundo do footer --%3E%3Cpath d='M-100 320 L250 -20 L600 320' fill='none' stroke='%2324231F' stroke-width='18' stroke-linecap='round' stroke-linejoin='round' opacity='0.035'/%3E%3Cpath d='M140 320 L370 40 L700 320' fill='none' stroke='%2324231F' stroke-width='12' stroke-linecap='round' stroke-linejoin='round' opacity='0.025'/%3E%3Cpath d='M650 320 L980 80 L1310 320' fill='none' stroke='%2324231F' stroke-width='14' stroke-linecap='round' stroke-linejoin='round' opacity='0.03'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    pointer-events: none;
    z-index: 0;
  }
`

export const FooterEmbaixo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 40px;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(88, 88, 88, 0.15);
  width: 100%;
  gap: 40px;
  position: relative;
  z-index: 1; /* Garante prioridade sobre o background */

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 36px;
  }

  @media (max-width: 768px) {
    padding-top: 30px;
    padding-bottom: 1.5rem;
    gap: 28px;
  }

  @media (max-width: 480px) {
    padding-top: 20px;
    padding-bottom: 1rem;
    gap: 20px;
  }
`

export const Endereco = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza os filhos na horizontal */
  text-align: center;  /* Centraliza as linhas de texto */
  justify-content: flex-start;
  max-width: 320px;
  width: 100%;

  @media (max-width: 480px) {
    max-width: 100%;
  }

  p {
    color: #1a1a1a;
    font-size: clamp(13px, 1vw, 0.95rem);
    line-height: 1.6;
    margin: 0;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 12px;
      line-height: 1.4;
    }
  }

  a {
    color: #1a1a1a;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #555;
    }
  }
`

export const LogoFooter = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
  justify-content: center; /* Centraliza a logo dentro do bloco */

  img {
    height: 75px;
    width: auto;
    object-fit: contain;

    @media (max-width: 768px) {
      height: 60px;
    }

    @media (max-width: 480px) {
      height: 50px;
    }
  }
`

export const Social = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo das redes sociais */
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    padding-top: 18px;
    gap: 10px;
  }

  p {
    font-size: 13px;
    color: #555;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`

export const LogoSocial = styled(FontAwesomeIcon)`
  color: rgb(35, 0, 45);
  font-size: 24px;
  transition: transform 0.3s ease, color 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.25);
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`

export const FooterLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 48px;
  flex-wrap: wrap;

  @media (max-width: 868px) {
    width: 100%;
    justify-content: space-around;
    gap: 32px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }
`

export const Mapasite = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 140px;

  @media (max-width: 868px) {
    align-items: center;
  }

  @media (max-width: 480px) {
    min-width: 100px;
    align-items: center;
  }
`

export const FooterLabel = styled.span`
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 13px;
    letter-spacing: 0.8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 0.6px;
    margin-bottom: 0.5rem;
  }
`

export const FooterMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 480px) {
    gap: 0.4rem;
  }

  li {
    margin: 0;
    padding: 0;
  }

  a {
    color: #4a4a4a;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: color 0.2s ease, text-shadow 0.2s ease;
    display: inline-block;

    &:hover {
      color: #000;
      text-shadow: 0 0 0.65px #000, 0 0 0.65px #000;
    }

    @media (max-width: 768px) {
      font-size: 12px;
    }

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`

export const LinhaHorizontal = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(88, 88, 88, 0.15);

  @media (max-width: 480px) {
    height: 1px;
    background: rgba(88, 88, 88, 0.1);
  }
`

export const FooterCopy = styled.div`
  color: #666;
  font-size: 12px;
  text-align: center;
  margin-top: 1.5rem;
  padding-bottom: 30px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 1rem;
    padding-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    margin-top: 0.8rem;
    padding-bottom: 15px;
  }
`