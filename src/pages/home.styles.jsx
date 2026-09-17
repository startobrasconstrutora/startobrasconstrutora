import styled from 'styled-components'

/* Tokens
   --concreto        #D9D6CD  fundo neutro (substitui o cinza chapado)
   --grafite          #24231F  texto forte / títulos
   --ambar-seguranca  #F0A23A  acento único (usado com moderação, não como bg de bloco inteiro)
   --aco              #6B675C  texto secundário
*/

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0px;
  width: 100%;
  height: auto;
  gap: 30px;
  padding: 10px 0px 150px;
`

export const ContainerSwiper = styled.div`
  padding-top: 0px;
  position: relative;
  width: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    padding-top: 70px;
  }
`

export const DivCentro = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 60px 10%;
  background: #D9D6CD;
`

export const CardsRow = styled.div`
  display: flex;
  width: 100%;
  gap: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 50%;

  @media (max-width: 900px) {
    width: 100%;
  }
`

export const CardImg = styled.div`
  width: 100%;
  height: 280px;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 36px 100%, 0 calc(100% - 36px));

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 900px) {
    height: 240px;
  }
`

export const CardTexto = styled.div`
  padding-top: 24px;

  h2 {
    color: var(--principaldarker);
    padding-bottom: 16px;
    font-size: 1.6rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    font-size: 18px;
    color: #24231F;
    padding: 6px 0 6px 24px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 14px;
      width: 9px;
      height: 9px;
      background: #F0A23A;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.3rem;
    }

    li {
      font-size: 16px;
    }
  }
`

export const SvgOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  pointer-events: none;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }
`

export const DivCentroTexto = styled.div`
  flex: 1;
  width: 100%;
  align-items: center;
  text-align: left;

  h1, h2 {
    color: var(--principaldarker);
    padding-bottom: 20px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    font-size: 24px;
    color: #24231F;
    padding: 8px 0 8px 26px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 17px;
      width: 10px;
      height: 10px;
      background: #F0A23A;
    }
  }

  @media (max-width: 1500px) {
    width: 100%;

    li {
      font-size: 22px;
    }
  }

  @media (max-width: 768px) {
    li {
      font-size: 18px;
    }

    h1, h2 {
      font-size: 21px;
    }
  }
`

export const Ofertas = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 50px;
  margin-bottom: 10px;
  background-size: cover;
  background-position: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--bg);
    opacity: 0.85;
  }

  p {
    font-size: 1vw;
    font-weight: 600;
    position: relative;
    z-index: 1;
    text-align: center;
    color: var(--principaldarker);
    text-shadow: 2px 8px 17px rgba(0, 0, 0, 0.274);
  }

  a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    margin-top: 0px;
    padding: 0px;

    p {
      font-size: 3vw;
    }
  }
`

export const DivCentroImg = styled.div`
  flex: 1;
  overflow: hidden;
  height: 400px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 44px 100%, 0 calc(100% - 44px));

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1500px) {
    width: 80%;
    height: 300px;
    max-height: 300px;
  }
`

export const Banner3 = styled.div`
  display: flex;
  justify-content: center;
  width: 70%;
  padding-bottom: 40px;

  @media (max-width: 1500px) {
    width: 100%;
  }
`

export const ObrasSection = styled.div`
  width: 100%;
  padding: 20px 10% 40px;

  h2 {
    color: var(--principaldarker);
    padding-bottom: 24px;
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    padding: 20px 6% 30px;

    h2 {
      font-size: 1.3rem;
    }
  }
`

export const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 60px 10%;
  background: #F0A23A;

  @media (max-width: 768px) {
    padding: 40px 8%;
  }
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 700px;

  strong {
    font-size: 1.9rem;
    font-weight: 700;
    color: #24231F;
    line-height: 1.2;
    position: relative;
    padding-bottom: 18px;
    margin-bottom: 18px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: #24231F;
      border-radius: 2px;
    }
  }

  span {
    font-size: 1rem;
    line-height: 1.6;
    color: #3a3729;
  }

  @media (max-width: 768px) {
    strong {
      font-size: 1.5rem;
    }

    span {
      font-size: 0.9rem;
    }
  }
`