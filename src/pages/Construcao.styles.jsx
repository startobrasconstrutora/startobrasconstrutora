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

export const EtapasSection = styled.section`
  width: 100%;
  background: #f4f4f4;
  padding: clamp(2.5rem, 5vw, 4rem) 1.5rem;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  color: #1e1e1e;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const GridEtapas = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const EtapaCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #ffb83c;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  span.numero {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffb83c;
  }

  h3 {
    font-size: 1.1rem;
    color: #1e1e1e;
    font-weight: 700;
  }

  p {
    font-size: 0.88rem;
    color: #444;
    line-height: 1.6;
  }
`;

export const DiferenciaisSection = styled.section`
  width: min(1200px, 92%);
  margin: clamp(2.5rem, 5vw, 4rem) auto;
  padding: 0 1.5rem;
`;

export const GridDiferenciais = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

export const DiferencialCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;

  h4 {
    font-size: 1.05rem;
    color: #ffb83c;
    margin-bottom: 0.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    &::before {
      content: "▶";
      font-size: 0.6rem;
    }
  }

  p {
    font-size: 0.85rem;
    color: #555;
    line-height: 1.6;
  }
`;

export const CtaWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
`;

export const CtaButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 999px;
  background: #ffb83c;
  color: #1e1e1e;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: #ffa200;
    transform: translateY(-2px);
  }

  &::before {
    content: "▶";
    font-size: 0.65rem;
  }
`;