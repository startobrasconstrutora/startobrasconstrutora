import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px 0 50px;

  @media (max-width: 768px) {
    padding: 10px 0 40px;
  }

  @media (max-width: 480px) {
    padding: 10px 0 30px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    transition: background-color 0.2s ease, transform 0.2s ease;
    background: #ffffff86;

    svg {
      width: 32px;
      height: 32px;
    }

    svg path {
      stroke: currentColor;
      stroke-width: 1.5px;
      filter: drop-shadow(0 0 0.5px currentColor);
    }

    &:hover {
      background-color: #c7c7c7a4;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    @media (max-width: 480px) {
      width: 32px;
      height: 32px;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const CardImg = styled.div`
  width: 100%;
  height: 260px;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 32px 100%, 0 calc(100% - 32px));

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 220px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 24px 100%, 0 calc(100% - 24px));
  }

  @media (max-width: 480px) {
    height: 180px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
`

export const CardLegenda = styled.p`
  margin: 14px 0 0;
  font-size: 16px;
  color: #24231F;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 10px 0 0;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin: 8px 0 0;
  }
`