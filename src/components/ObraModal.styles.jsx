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

  span {
    display: inline-block;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #8a8578;
    background: #f1efe9;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  h1 {
    font-size: 24px;
    color: #24231F;
    margin: 0 0 0;
    font-weight: 700;
  }
`

export const ImagemPrincipal = styled.div`
  width: 100%;
  height: 380px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 12px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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
  transition: opacity 0.2s ease, border-color 0.2s ease;

  &:hover {
    opacity: 1;
    border-color: #24231F;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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
    margin: 0 0 10px;
    font-weight: 700;
  }

  p {
    margin: 0;
  }
`

export const ListaDestaques = styled.ul`
  margin: 16px 0 0;
  padding-left: 18px;

  li {
    margin-bottom: 8px;
    color: #3a382f;
  }
`

export const Depoimento = styled.blockquote`
  margin: 20px 0 0;
  padding: 14px 18px;
  border-left: 3px solid #24231F;
  background: #f8f7f3;
  font-style: italic;
  color: #4a483d;
  line-height: 1.6;
`

export const InfoBox = styled.div`
  background: #f8f7f3;
  border-radius: 8px;
  padding: 18px;
  height: fit-content;
  position: sticky;
  top: 20px;

  h3 {
    font-size: 15px;
    color: #24231F;
    margin: 0 0 12px;
    font-weight: 700;
  }

  @media (max-width: 640px) {
    position: static;
  }
`

export const LinhaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 7px 0;
  border-bottom: 1px solid #e8e6df;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #6b6858;
    font-weight: 500;
    flex-shrink: 0;
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
  font-size: 15px;
`

// ==================== ZOOM ====================

export const OverlayZoom = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const ContainerImagemZoom = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const ImagemZoom = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
`

export const BotaoFecharZoom = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 401;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`

export const BotaoNavegacao = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 401;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  ${(props) => props.$esquerda && 'left: 20px;'}
  ${(props) => props.$direita && 'right: 20px;'}
`

export const ContadorZoom = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  z-index: 401;
  backdrop-filter: blur(4px);
`
export const BotaoZoomMais = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`

export const BotaoZoomMenos = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`

export const BarraControlesZoom = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 401;
`

export const ContadorNivelZoom = styled.div`
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  min-width: 35px;
  text-align: center;
`