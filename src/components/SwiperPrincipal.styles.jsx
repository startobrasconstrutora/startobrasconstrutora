import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0px;
  margin-top: 0px;
  height: 500px;

  @media (max-width: 768px) {
    height: 350px;
  }

  @media (max-width: 480px) {
    height: 280px;
  }

  /* ---------- SLIDES ---------- */

  .swiper-slide {
    opacity: 0.4;
    transition: 0.3s;
  }

  .swiper-slide-active {
    opacity: 1;
    transform: scale(1);
  }

  /* ---------- SETAS ---------- */

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    /* TAMANHO DAS SETAS */
    transform: scale(0.7);

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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TextoOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  padding: 16px;
  color: #fff;
  box-sizing: border-box;
  background: #ffffff7c;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

export const Titulo = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.9rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0 0 2px 0;
  }
`;

export const Descricao = styled.p`
  margin: 0;
  font-size: 9rem;
  color: #000000;
  font-weight: 900;

  @media (max-width: 1200px) {
    font-size: 5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;