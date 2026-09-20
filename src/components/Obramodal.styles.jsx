import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

export const Modal = styled.div`
  position: relative;
  width: min(900px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`

export const BotaoFechar = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f1efe9;
  color: #24231F;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: #e2ded2;
  }
`

export const Cabecalho = styled.div`
  margin-bottom: 20px;
  padding-right: 40px;

  h1 {
    font-size: 24px;
    color: #24231F;
    margin: 0 0 8px;
  }

  span {
    display: inline-block;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #8a8578;
    background: #f1efe9;
    padding: 4px 10px;
    border-radius: 4px;
  }
`

export const ImagemPrincipal = styled.div`
  width: 100%;
  height: 380px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 640px) {
    height: 240px;
  }
`

export const GridMiniaturas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-bottom: 28px;
`

export const Miniatura = styled.div`
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$ativa ? '#24231F' : 'transparent')};
  opacity: ${(props) => (props.$ativa ? 1 : 0.75)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const Corpo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const Descricao = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #3a382f;

  h3 {
    font-size: 17px;
    color: #24231F;
    margin-bottom: 10px;
  }
`

export const ListaDestaques = styled.ul`
  margin: 16px 0 0;
  padding-left: 18px;

  li {
    margin-bottom: 6px;
  }
`

export const Depoimento = styled.blockquote`
  margin: 20px 0 0;
  padding: 14px 18px;
  border-left: 3px solid #24231F;
  background: #f8f7f3;
  font-style: italic;
  color: #4a483d;
`

export const InfoBox = styled.div`
  background: #f8f7f3;
  border-radius: 8px;
  padding: 18px;
  height: fit-content;

  h3 {
    font-size: 15px;
    color: #24231F;
    margin: 0 0 12px;
  }
`

export const LinhaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 7px 0;
  border-bottom: 1px solid #e8e6df;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #6b6858;
    font-weight: 500;
  }

  span {
    color: #24231F;
    text-align: right;
  }
`

export const Carregando = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b6858;
`