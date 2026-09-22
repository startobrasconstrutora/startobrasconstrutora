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

  @media (max-width: 768px) {
    gap: 20px;
    padding: 10px 0px 100px;
  }

  @media (max-width: 480px) {
    gap: 15px;
    padding: 10px 0px 80px;
  }
`

export const ContainerSwiper = styled.div`
  padding-top: 0px;
  position: relative;
  width: 100%;
  overflow: hidden;

  @media (max-width: 900px) {
    padding-top: 130px;  /* Adiciona espaço só no mobile */
  }
`

export const DivCentro = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 60px 10%;
  background: #D9D6CD;

  @media (max-width: 768px) {
    padding: 40px 5%;
  }

  @media (max-width: 480px) {
    padding: 30px 4%;
  }
`

export const CardsRow = styled.div`
  display: flex;
  width: 100%;
  gap: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
  }

  @media (max-width: 480px) {
    gap: 20px;
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

  @media (max-width: 480px) {
    height: 200px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px));
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

  @media (max-width: 480px) {
    h2 {
      font-size: 1.1rem;
      padding-bottom: 12px;
    }

    li {
      font-size: 14px;
      padding: 5px 0 5px 20px;
    }

    li::before {
      width: 7px;
      height: 7px;
      top: 11px;
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

  @media (max-width: 480px) {
    svg {
      height: auto;
      min-height: 60px;
    }
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

  @media (max-width: 480px) {
    li {
      font-size: 15px;
      padding: 6px 0 6px 20px;
    }

    h1, h2 {
      font-size: 18px;
      padding-bottom: 15px;
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
    height: 150px;

    p {
      font-size: 3vw;
    }
  }

  @media (max-width: 480px) {
    height: 120px;
    margin-bottom: 5px;

    p {
      font-size: 2.5vw;
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

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px));
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

  @media (max-width: 768px) {
    padding-bottom: 30px;
  }

  @media (max-width: 480px) {
    padding-bottom: 20px;
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

  @media (max-width: 480px) {
    padding: 15px 4% 25px;

    h2 {
      font-size: 1.1rem;
      padding-bottom: 18px;
    }
  }
`

export const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 50px 10%;
  background-color: #F0A23A;
  position: relative;
  overflow: hidden;

  /* Borda dupla estilizada no topo e na base */
  border-top: 6px double #e0e0e0;
  border-bottom: 6px double #e0e0e0;

  /* Mantém a textura de fundo */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' preserveAspectRatio='none'%3E%3Cpath d='M-80 240 L210 -10 L500 240' fill='none' stroke='%2324231F' stroke-width='16' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'/%3E%3Cpath d='M110 240 L310 50 L580 240' fill='none' stroke='%2324231F' stroke-width='10' stroke-linecap='round' stroke-linejoin='round' opacity='0.06'/%3E%3Cpath d='M480 240 L780 70 L1080 240' fill='none' stroke='%2324231F' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' opacity='0.05'/%3E%3Cpath d='M820 240 L1020 120 L1220 240' fill='none' stroke='%2324231F' stroke-width='12' stroke-linecap='round' stroke-linejoin='round' opacity='0.07'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 30px 5%;
    border-top: 4px double #e0e0e0;
    border-bottom: 4px double #e0e0e0;
  }

  @media (max-width: 480px) {
    padding: 20px 4%;
    border-top: 3px double #e0e0e0;
    border-bottom: 3px double #e0e0e0;
  }
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 700px;
  position: relative;
  z-index: 2; /* Garante que o texto fique por cima do grafismo */

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
      padding-bottom: 14px;
      margin-bottom: 14px;
    }

    strong::after {
      width: 50px;
      height: 2px;
    }

    span {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    strong {
      font-size: 1.1rem;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    strong::after {
      width: 35px;
      height: 2px;
    }

    span {
      font-size: 0.8rem;
      line-height: 1.5;
      padding: 0 10px;
    }
  }
`