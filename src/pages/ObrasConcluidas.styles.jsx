import styled from "styled-components";

export const Page = styled.main`
  padding-top: 50px;
  padding-bottom: clamp(2rem, 4vw, 3rem);
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
  padding: clamp(3.5rem, 6vw, 4rem) 1.5rem clamp(1.5rem, 3vw, 1.5rem);
`;

export const IntroContent = styled.div`
  max-width: 780px;
  text-align: center;

  h2 {
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    color: #1e1e1e;
    margin-bottom: 1.2rem;
    font-weight: 700;
  }

  p {
    color: #1e1e1e;
    font-size: clamp(0.85rem, 1vw, 0.95rem);
    line-height: 1.8;
    margin-bottom: 1.4rem;
  }
`;

// =============================================================
//  FILTROS
// =============================================================

export const Filtros = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto clamp(1.5rem, 3vw, 2rem);
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

export const BotaoFiltro = styled.button`
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  border: 1px solid ${({ $ativo }) => ($ativo ? "#ffb83c" : "#e0e0e0")};
  background: ${({ $ativo }) => ($ativo ? "#ffb83c" : "#ffffff")};
  color: #1e1e1e;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffb83c;
  }
`;

// =============================================================
//  GRID DE OBRAS
// =============================================================

export const GridSection = styled.section`
  width: min(1200px, 92%);
  margin: 0 auto clamp(3rem, 6vw, 4.5rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.8rem;
  padding: 0 1.5rem;
  justify-items: center;
`;

export const ObraCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  width: 100%;
  max-width: 280px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
`;

export const ObraCardImg = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const SeloTipo = styled.span`
  position: absolute;
  top: 16px;
  left: 12px;
  background: #ffb83c;
  color: #1e1e1e;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
`;

export const ObraCardBody = styled.div`
  padding: 1.2rem 1.4rem 1.4rem;

  h3 {
    font-size: 1.05rem;
    color: #1e1e1e;
    font-weight: 700;
    margin: 0 0 0.4rem;
  }

  p {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
  }
`;

export const VazioLista = styled.div`
  width: min(1200px, 92%);
  margin: 0 auto clamp(3rem, 6vw, 4.5rem);
  text-align: center;
  color: #666;
  padding: 3rem 1.5rem;
`;