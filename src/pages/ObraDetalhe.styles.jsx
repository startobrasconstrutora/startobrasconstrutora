import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 50px 20px 80px;
`

export const BotaoVoltar = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #24231F;
  font-size: 15px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;

  &:hover {
    text-decoration: underline;
  }
`

export const Cabecalho = styled.div`
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
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
    margin-right: 8px;
  }
`

export const ImagemPrincipal = styled.div`
  width: 100%;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 280px;
  }
`

export const GridMiniaturas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  margin-bottom: 32px;
`

export const Miniatura = styled.div`
  height: 80px;
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
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Descricao = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #3a382f;

  h3 {
    font-size: 18px;
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
  margin: 24px 0 0;
  padding: 16px 20px;
  border-left: 3px solid #24231F;
  background: #f8f7f3;
  font-style: italic;
  color: #4a483d;
`

export const InfoBox = styled.div`
  background: #f8f7f3;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;

  h3 {
    font-size: 16px;
    color: #24231F;
    margin: 0 0 14px;
  }
`

export const LinhaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 0;
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
  padding: 100px 20px;
  color: #6b6858;
`

export const NaoEncontrada = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: #6b6858;

  a {
    color: #24231F;
    text-decoration: underline;
  }
`