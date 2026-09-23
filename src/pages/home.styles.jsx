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
  gap: 0px;
  padding: 0;

  @media (max-width: 768px) {
    gap: 0px;
  }

  @media (max-width: 480px) {
    gap: 0px;
    padding: 0;
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
  gap: 32px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 28px;
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }
`

export const CardImg = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.04);
  }

  @media (max-width: 480px) {
    height: 180px;
  }
`
export const CardBadge = styled.span`
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #24231F;
  background: #EAE8E1;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
`

export const CardBadgeHighlight = styled(CardBadge)`
  color: #24231F;
  background: #F0A23A;
`

export const CardTexto = styled.div`
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  h2 {
    color: #24231F;
    font-size: 1.45rem;
    font-weight: 700;
    line-height: 1.35;
    margin-bottom: 16px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li {
    position: relative;
    font-size: 0.98rem;
    color: #4a4840;
    line-height: 1.5;
    padding-left: 20px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: #F0A23A;
    }

    strong {
      color: #24231F;
    }
  }

  @media (max-width: 480px) {
    padding: 20px 18px;

    h2 {
      font-size: 1.25rem;
    }

    li {
      font-size: 0.9rem;
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

export const ObrasSection = styled.section`
  width: 100%;
  padding: 60px 10%;
  background-color: #f8f8f7;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    color: var(--principaldarker, #24231F);
    padding-bottom: 24px;
    font-size: 1.8rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 40px 5%;

    h2 {
      font-size: 1.4rem;
    }
  }

  @media (max-width: 480px) {
    padding: 30px 4%;

    h2 {
      font-size: 1.2rem;
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
  position: relative;
  
  background: #F0A23A; 
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(240, 162, 58, 0.25);
  border: 1px solid #e0932c;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.$bgImage});
    background-size: cover;
    background-position: center;
    filter: grayscale(100%);
    opacity: 0.10;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(240, 162, 58, 0.4);
    background: #e8992e;

    &::before {
      opacity: 0.12;
      transform: scale(1.05);
    }

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
  width: 100px; 
  height: 100px;    
  background: rgba(36, 35, 31, 0.12);
  border-radius: 16px;  
  margin: 0 auto 20px; 
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
  text-align: center;
  position: relative;
  z-index: 1; 

  h3 {
    font-size: 1.4rem;
    color: #070707;
    margin-bottom: 12px;
    font-weight: 700;
  }

  p {
    font-size: 0.98rem;
    color: #070707;
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
  color: #080808;
  border-top: 1px solid rgba(36, 35, 31, 0.15);
  padding-top: 16px;

  .card-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease, color 0.3s ease;
  }
`

export const MateriasSection = styled.section`
  width: 100%;
  padding: 60px 10%;
  background-color: #ffffff;

  @media (max-width: 768px) {
    padding: 40px 5%;
  }

  @media (max-width: 480px) {
    padding: 30px 4%;
  }
`