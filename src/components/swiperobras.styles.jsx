import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px 0 50px;

  .swiper-button-next,
  .swiper-button-prev {
    color: #F0A23A;
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
  }
`

export const CardLegenda = styled.p`
  margin: 14px 0 0;
  font-size: 16px;
  color: #24231F;
  text-align: left;
`