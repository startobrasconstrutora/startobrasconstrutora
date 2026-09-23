import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #23262b;
`;

export const CabecalhoLista = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

export const TituloLista = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
`;

export const AcoesLista = styled.div`
  display: flex;
  gap: 10px;
`;

export const Aviso = styled.div`
  background: ${(p) => (p.$erro ? '#fdf2f1' : '#fff')};
  border: 1px solid ${(p) => (p.$erro ? '#ecd4d1' : '#e4e1db')};
  color: ${(p) => (p.$erro ? '#c1473c' : '#6e7178')};
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 14px;
  margin-bottom: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #e4e1db;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f0efec url(${(p) => p.$src || ''}) center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a7a49c;
  font-size: 13px;
  position: relative;
`;

export const SeloTipo = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #23262bcc;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 5px;
`;

export const CaixaSelecao = styled.label`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffffffdd;
  border-radius: 5px;
  padding: 4px 6px;
  display: flex;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #e8871e;
    cursor: pointer;
  }
`;

export const CardCorpo = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const NomeObra = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0;
`;

export const LinhaSecundaria = styled.p`
  font-size: 13px;
  color: #6e7178;
  margin: 0;
`;

export const CardRodape = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eeece7;
`;

export const BotaoPequeno = styled.button`
  flex: 1;
  background: ${(p) => (p.$perigo ? '#fff' : '#e8871e')};
  color: ${(p) => (p.$perigo ? '#c1473c' : '#fff')};
  border: 1px solid ${(p) => (p.$perigo ? '#ecd4d1' : '#e8871e')};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PainelEdicao = styled.div`
  grid-column: 1 / -1;
  background: #f6f4f1;
  border: 1px solid #e4e1db;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const GridImagensExistentes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
`;

export const MiniaturaExistente = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${(p) => (p.$sobre ? '#e8871e' : '#d9d6cf')};
  background: #fff url(${(p) => p.$src}) center/cover no-repeat;
  opacity: ${(p) => (p.$marcada ? 0.35 : p.$arrastando ? 0.5 : 1)};
  cursor: ${(p) => (p.$marcada ? 'default' : 'grab')};
  transition: border-color 0.12s ease, opacity 0.12s ease;

  &:active {
    cursor: ${(p) => (p.$marcada ? 'default' : 'grabbing')};
  }
`;

export const AlcaArrastar = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  background: #23262bcc;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 4px;
  pointer-events: none;
`;

export const BotaoRemoverImagem = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${(p) => (p.$marcada ? '#23262b' : '#c1473c')};
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 11px;
  padding: 3px 6px;
  cursor: pointer;
`;

export const EtiquetaPrincipal = styled.span`
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: #23262bcc;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
`;

export const LinhaBotoesEdicao = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const BotaoSalvar = styled.button`
  background: #e8871e;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 11px 22px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: #d1770f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BotaoCancelar = styled.button`
  background: #fff;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 7px;
  padding: 11px 22px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    border-color: #b9b5ab;
  }
`;

export const VazioLista = styled.div`
  text-align: center;
  color: #a7a49c;
  padding: 60px 20px;
  font-size: 14px;
`;