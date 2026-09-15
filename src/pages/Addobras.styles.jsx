import styled from 'styled-components';

/* Paleta
   fundo:      #F6F4F1 (concreto claro)
   painel:     #FFFFFF
   borda:      #E4E1DB
   texto:      #23262B
   texto sec.: #6E7178
   destaque:   #E8871E (amarelo segurança / construção)
   perigo:     #C1473C
*/

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

  &:last-of-type {
    color: #c1473c;
    border-color: #ecd4d1;
  }

  &:last-of-type:hover {
    background: #fdf2f1;
    border-color: #c1473c;
  }
`;

export const Painel = styled.div`
  background: #f6f4f1;
  color: #23262b;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
`;

export const TituloPainel = styled.label`
  font-size: 26px;
  font-weight: 700;
  display: block;
  letter-spacing: -0.01em;
  margin-bottom: 4px;

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

export const BlocoConfiguracoes = styled.div`
  background: #fff;
  border: 1px solid #e4e1db;
  border-radius: 8px;
  padding: 16px 18px;
  margin: 20px 0 28px;

  strong {
    display: block;
    font-size: 13px;
    color: #6e7178;
    font-weight: 600;
    margin-bottom: 10px;
  }
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

export const LinhaOpcoes = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 4px;
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

export const Campoidobra = styled(Campo)``;

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
`;

export const LinhaPreco = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const ColunaPreco = styled.div`
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ContadorTexto = styled.span`
  font-size: 12px;
  color: #a7a49c;
  align-self: flex-end;
`;

export const TextArea = styled.textarea`
  width: 100%;
  resize: vertical;
  padding: 10px 12px;
  box-sizing: border-box;
  background: #fbfaf8;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;

  &::placeholder {
    color: #a7a49c;
  }

  &:focus {
    outline: none;
    border-color: #e8871e;
    background: #fff;
  }
`;

export const BlocoImagens = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

export const LinhaImagem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fbfaf8;
  border: 1px dashed #d9d6cf;
  border-radius: 8px;
  padding: 12px;

  input[type='file'] {
    font-size: 12px;
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
`;

export const ContainerLista = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;