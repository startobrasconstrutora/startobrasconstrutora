import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0px;
  margin-top: 0px;


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

  }

  /* ---------- PAGINAÇÃO ---------- */

  .swiper-pagination-bullet {

    background: white;

    opacity: 0.5;
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
`;

export const Titulo = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.9rem;
`;

export const Descricao = styled.p`
  margin: 0;
  font-size: 9rem;
   color: #000000;
   font-weight: 900;
`;