import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
    padding-top: 130px;
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
    color: var(--principaldarker, #24231F);
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

      &::before {
        width: 7px;
        height: 7px;
        top: 11px;
      }
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

export const ObrasSection = styled.div`
  width: 100%;
  padding: 20px 10% 40px;

  h2 {
    color: var(--principaldarker, #24231F);
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

  border-top: 6px double #e0e0e0;
  border-bottom: 6px double #e0e0e0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' preserveAspectRatio='none'%3E%3Cpath d='M-80 240 L210 -10 L500 240' fill='none' stroke='%2324231F' stroke-width='16' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    pointer-events: none;
    z-index: 1;
  }
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 700px;
  position: relative;
  z-index: 2;

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
`

/* Seção de Cards de Serviços Laranjas e com Ícones */
export const ServicosCardsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 50px 10%;
  align-items: center;
  background: #fcfbfa;

  @media (max-width: 768px) {
    padding: 35px 5%;
  }
`

export const ServicosSectionTitle = styled.h2`
  color: var(--principaldarker, #24231F);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 25px;
  }
`

export const ServicosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

export const ServicoCardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  
  /* CARTÕES LARANJAS CONFORME SOLICITADO */
  background: #F0A23A; 
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(240, 162, 58, 0.25);
  border: 1px solid #e0932c;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(240, 162, 58, 0.4);
    background: #e8992e;

    /* Destaca o ícone ao passar o mouse */
    div svg {
      transform: scale(1.1);
    }

    .card-arrow {
      transform: translateX(6px);
      color: #ffffff;
    }
  }
`

export const ServicoIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(36, 35, 31, 0.12);
  border-radius: 12px;
  margin-bottom: 20px;
  color: #24231F;

  svg {
    transition: transform 0.3s ease;
  }
`

export const ServicoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 28px;
  height: 100%;
  justify-content: space-between;

  h3 {
    font-size: 1.4rem;
    color: #24231F;
    margin-bottom: 12px;
    font-weight: 700;
  }

  p {
    font-size: 0.98rem;
    color: #2c2921; /* Tom escuro para excelente legibilidade sobre o fundo laranja */
    line-height: 1.6;
    margin-bottom: 24px;
    flex-grow: 1;
  }
`

export const ServicoCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.95rem;
  color: #24231F;
  border-top: 1px solid rgba(36, 35, 31, 0.15);
  padding-top: 16px;

  .card-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease, color 0.3s ease;
  }
`