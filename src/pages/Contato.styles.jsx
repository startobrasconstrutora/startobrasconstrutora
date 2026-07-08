import styled from "styled-components";



export const Page = styled.main`
padding-top: 50px;
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
    opacity: 0.5;
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
//  INTRO / TEXTO
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

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.65rem 1.6rem;
  border: none;
  border-radius: 999px;
  background: #ffb83c;
    color: #1e1e1e;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: #ffa200;
    transform: translateY(-1px);
  }

  &::before {
    content: "▶";
    font-size: 0.6rem;
  }
`;

// =============================================================
//  CONTATO / CARDS
// =============================================================

export const ContatoSection = styled.section`
  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: clamp(2rem, 4vw, 3rem) 1.5rem clamp(3rem, 6vw, 4rem);
  display: flex;
  justify-content: center;
`;

export const ContatoGrid = styled.div`
  width: min(1200px, 92%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ContatoCard = styled.div`
  background: #ededed;
  border-radius: 8px;
  padding: 2.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ContatoIcon = styled.div`
  font-size: 2.2rem;
  color: #ffa52f;
  margin-bottom: 1.2rem;
`;

export const ContatoLabel = styled.p`
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.4rem;
`;

export const ContatoValor = styled.p`
  color: #1e1e1e;
  font-size: 0.95rem;
`;

export const RedesSociaisRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const RedeSocialLink = styled.a`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e1e1e;
  font-size: 1rem;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #1e1e1e;
    color: #ffffff;
  }
`;

export const ContatoIcone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 100%;

  svg {
    font-size: 2rem;
    color: #ffa52f;
    margin-bottom: 0.8rem;
  }
`;

export const ContatoDivider = styled.div`
  width: 60%;
  height: 1px;
  background: #d8d8d8;
  margin: 1.4rem 0;
`;