import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0px;
  
  /* Margem negativa reduzida para descer um pouco o banner */
  margin-top: -110px; 
  position: relative;
  z-index: 1;

  aspect-ratio: 18 / 9; 
  height: auto;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: -80px;
    aspect-ratio: 16 / 8.5;
  }

  @media (max-width: 480px) {
    margin-top: -60px;
    aspect-ratio: 16 / 9;
  }

  /* ---------- SLIDES ---------- */

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    opacity: 0.4;
    transition: 0.3s;
    height: 100%;
  }

  .swiper-slide-active {
    opacity: 1;
    transform: scale(1);
  }

  /* ---------- SETAS ---------- */

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    transform: scale(0.7);
    z-index: 3;

    @media (max-width: 768px) {
      transform: scale(0.5);
    }

    @media (max-width: 480px) {
      transform: scale(0.4);
    }
  }

  /* ---------- PAGINAÇÃO ---------- */

  .swiper-pagination-bullet {
    background: white;
    opacity: 0.5;

    @media (max-width: 480px) {
      width: 6px;
      height: 6px;
    }
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
  }
`;

export const SlideBox = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;

  /* Mantido o corte de 10% total (5% topo, 5% base) */
  clip-path: inset(5% 0 5% 0);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

export const TextoOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 5%;
  left: 0;
  width: 100%;
  max-height: 90%;
  padding: 24px 16px;
  color: #fff;
  box-sizing: border-box;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  z-index: 2;

  @media (max-width: 768px) {
    padding: 16px 12px;
    bottom: 3%;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    bottom: 0;
  }
`;

export const Titulo = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 2px 0;
  }
`;

export const Descricao = styled.p`
  margin: 0;
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: 700;
  text-align: center;

  @media (max-width: 1200px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;