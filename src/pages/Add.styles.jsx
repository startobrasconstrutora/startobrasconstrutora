import styled from "styled-components";



export const Page = styled.main`
display: flex;
flex-direction: column;
padding-top: 50px;
justify-content: center;
align-items: center;
  width: 100%;
  background: #ffffff;
    color: #1e1e1e;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

// =============================================================
//   INTRO / TEXTO
// =============================================================

export const IntroSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(3.5rem, 6vw, 5rem) 1.5rem clamp(2rem, 4vw, 3rem);
`;

export const IntroContent = styled.div`
  max-width: 780px;
  text-align: center;

  p {
      color: #1e1e1e;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.8;
    margin-bottom: 1.4rem;
  }
`;

// =============================================================
//   ALTERNADOR DE TELA (Adicionar / Gerenciar)
// =============================================================

export const ToggleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0 1.5rem clamp(1.5rem, 3vw, 2.5rem);
`;

export const ToggleButton = styled.button`
  border: 2px solid #ffb83c;
  background: ${(props) => (props.$ativo ? "#ffb83c" : "transparent")};
  color: #1e1e1e;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  padding: 0.65rem 1.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: #ffb83c;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &:disabled {
    cursor: default;
  }
`;

export const DevSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
`;