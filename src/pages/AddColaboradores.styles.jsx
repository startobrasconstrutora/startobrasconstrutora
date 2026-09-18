import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 32px;
  background: #f6f4f1;
  border-radius: 12px;
  color: #23262b;
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
`;

export const Painel = styled(Wrapper)``;

export const TituloPainel = styled.h2`
  font-size: 26px;
  font-weight: 700;
  display: block;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
  color: #23262b;

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #e8871e;
    border-radius: 2px;
    margin-right: 10px;
  }
`;

export const TopoAcoes = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;

export const BotaoAcao = styled.button`
  background: #fff;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 6px;
  padding: 9px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: #b9b5ab;
    background: #faf9f7;
  }
`;

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Secao = styled.section`
  background: #fff;
  border: 1px solid #e4e1db;
  border-radius: 10px;
  padding: 22px 24px;
`;

export const TituloSecao = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #6e7178;
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eeece7;
`;

export const Info = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Camponomeobra = styled(Campo)`
  grid-column: span 2;

  @media (max-width: 640px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 13px;
  color: #4b4e54;
`;

export const Input = styled.input`
  background: #fbfaf8;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: #a7a49c;
  }

  &:focus {
    outline: none;
    border-color: #e8871e;
    background: #fff;
  }

  &[readonly] {
    background: #f0efec;
    color: #8b8e94;
    cursor: default;
  }

  &:disabled {
    background: #f0efec;
    color: #8b8e94;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  background: #fbfaf8;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  resize: vertical;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: #a7a49c;
  }

  &:focus {
    outline: none;
    border-color: #e8871e;
    background: #fff;
  }

  &[readonly] {
    background: #f0efec;
    color: #8b8e94;
    cursor: default;
  }

  &:disabled {
    background: #f0efec;
    color: #8b8e94;
    cursor: not-allowed;
  }
`;

export const GridFuncoes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

export const LabelCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;

  input[type='checkbox'],
  input[type='radio'] {
    width: 16px;
    height: 16px;
    accent-color: #e8871e;
    cursor: pointer;
  }
`;

export const DicaImagem = styled.span`
  font-size: 12px;
  color: #a7a49c;
  display: block;
  margin: -8px 0 4px;
`;

export const BotaoEnviar = styled.button`
  align-self: flex-start;
  background: #e8871e;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 12px 26px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.15s ease;

  &:hover {
    background: #d1770f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ContainerLista = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
`;

export const ToggleGroup = styled.div`
  background: #fff;
  border: 1px solid #e4e1db;
  border-radius: 10px;
  padding: 22px 24px;
`;

export const ToggleGroupTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #23262b;
  margin: 0 0 8px;
`;

export const ToggleGroupDesc = styled.p`
  font-size: 13px;
  color: #6e7178;
  margin: 0 0 16px;
  line-height: 1.5;
`;

export const ToggleGroupButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ToggleButton = styled.button`
  background: ${props => props.$ativo ? '#e8871e' : '#fff'};
  color: ${props => props.$ativo ? '#fff' : '#23262b'};
  border: 1px solid ${props => props.$ativo ? '#e8871e' : '#d9d6cf'};
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s ease;
  flex: 1;

  &:hover:not(:disabled) {
    border-color: ${props => props.$ativo ? '#d1770f' : '#b9b5ab'};
    background: ${props => props.$ativo ? '#d1770f' : '#faf9f7'};
  }

  &:disabled {
    opacity: 1;
  }

  @media (max-width: 640px) {
    flex: none;
    width: 100%;
  }
`;

export const ToggleDivider = styled.hr`
  border: none;
  height: 1px;
  background: #e4e1db;
  margin: 8px 0;
`;

export const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 32px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e8871e 0%, #d1770f 100%);
`;

export const HeroImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HeroBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
`;

export const IntroSection = styled.section`
  background: #fff;
  border: 1px solid #e4e1db;
  border-radius: 10px;
  padding: 22px 24px;
  margin-bottom: 32px;
`;

export const IntroContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #6e7178;

  p {
    margin: 0;
  }
`;

export const Page = styled.div`
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 32px;
`;

export const DevSection = styled.div`
  margin-top: 32px;
`;