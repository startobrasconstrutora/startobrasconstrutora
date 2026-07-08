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
//  MISSÃO / VISÃO / VALORES
// =============================================================

export const ValoresSection = styled.section`
  width: 100%;
  background: #f4f4f4;
  padding: clamp(2.5rem, 5vw, 4rem) 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2.5rem, 5vw, 3.5rem);
`;

export const ValorRow = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.2rem, 3vw, 2.5rem);
  flex-direction: ${({ $align }) => ($align === "right" ? "row-reverse" : "row")};


  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const ValorImg = styled.div`
  flex-shrink: 0;
  width: clamp(110px, 12vw, 150px);
  height: clamp(110px, 12vw, 150px);
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ValorTexto = styled.div`
  max-width: 460px;
  text-align: ${({ $align }) => ($align === "right" ? "right" : "left")};

  @media (max-width: 640px) {
    text-align: center;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: ${({ $align }) => ($align === "right" ? "flex-end" : "flex-start")};
    color: #ffb83c;
    font-size: clamp(1rem, 1.6vw, 1.25rem);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 0.6rem;

    @media (max-width: 640px) {
      justify-content: center;
    }

    &::before {
      content: "▶";
      font-size: 0.7rem;
        color: #ffb83c;
    }
  }

  p {
      color: #1e1e1e;
    font-style: italic;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.7;
  }
`;