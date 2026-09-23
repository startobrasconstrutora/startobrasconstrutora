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



export const IntroSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(3.5rem, 6vw, 4rem) 1.5rem clamp(1.5rem, 3vw, 2rem);
`;

export const IntroContent = styled.div`
  max-width: 780px;
  text-align: left;

  h2 {
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    color: #1e1e1e;
    margin-bottom: 1.2rem;
    font-weight: 700;
    text-align: center;
  }

  p {
    color: #1e1e1e;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.8;
    margin-bottom: 1.4rem;
  }
`;

export const CtaButton = styled.a`
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
  text-decoration: none;
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



export const ServicosSection = styled.section`
  width: min(1200px, 92%);
  margin: 0 auto clamp(2.5rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 0 1.5rem;
`;

export const ServicoCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-top: 4px solid #ffb83c;
  border-radius: 8px;
  padding: 1.8rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-3px);
  }

  h4 {
    font-size: 1rem;
    color: #ffb83c;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 0.85rem;
    color: #555;
    line-height: 1.5;
  }
`;



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
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.7;
  }
`;



export const EspecialidadesSection = styled.section`
  width: 100%;
  background: #fafafa;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: clamp(3rem, 5vw, 4.5rem) 1.5rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
`;

export const EspecialidadesContainer = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto;
  text-align: center;

  h2 {
    font-size: clamp(1.3rem, 2vw, 1.75rem);
    color: #1e1e1e;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  p.subtitulo {
    font-size: clamp(0.9rem, 1.1vw, 1.05rem);
    color: #555;
    max-width: 720px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;

    strong {
      color: #1e1e1e;
    }
  }
`;

export const EspecialidadesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

export const EspecialidadeCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 1.8rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #ffb83c;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }

  h3 {
    font-size: 1.05rem;
    color: #1e1e1e;
    font-weight: 700;
    margin: 1rem 0 0.5rem;
  }

  p {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.45;
  }
`;

export const EspecialidadeIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #fff8eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe1a8;
  color: #d98200;
`;

export const ValoresTitle = styled.h2`
  font-size: clamp(1.3rem, 2vw, 1.75rem);
  color: #1e1e1e;
  font-weight: 700;
  text-align: center;
  margin-bottom: clamp(1rem, 3vw, 2rem);
  text-transform: uppercase;
  letter-spacing: 1px;
`;