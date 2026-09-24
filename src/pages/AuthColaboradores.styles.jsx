import styled from "styled-components";

export const Pagina = styled.main`
  min-height: 100vh;
  background: #ffffff;
  color: #1e1e1e;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding-top: 50px;
  padding-bottom: 60px;
`;

export const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: clamp(1.5rem, 3vw, 2.5rem);
`;

export const HeroImage = styled.div`
  position: relative;
  width: min(1200px, 92%);
  aspect-ratio: 1200 / 420;
  border-radius: 6px;
  overflow: hidden;
  background: #f7b35af3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(100%);
    opacity: 0.8;
    mix-blend-mode: multiply;
  }
`;

export const HeroBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  background: #ffb83c;
  color: #1e1e1e;
  padding: 0.7rem 2.5rem;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: clamp(0.9rem, 1.3vw, 1.15rem);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
`;

export const Container = styled.div`
  max-width: 520px;
  margin: 4rem auto 0;
  padding: 0 16px;
`;

export const Subtitulo = styled.p`
  font-size: 15px;
  color: #6e7178;
  margin: 0 0 28px;
  text-align: center;
  line-height: 1.5;
`;

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #fff;
  padding: 32px 28px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(30, 30, 30, 0.08);
  border: 1px solid #e0e0e0;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
  color: #4b4e54;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  background: #fbfaf8;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #ffb83c;
  }
`;

export const Botao = styled.button`
  border: none;
  background: #ffb83c;
  color: #23262b;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 6px;

  &:hover {
    background: #ffa200;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AcoesSecundarias = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
`;

export const BotaoLink = styled.button`
  border: none;
  background: transparent;
  color: #6e7178;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #23262b;
  }
`;