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

export const IntroSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(3.5rem, 6vw, 5rem) 1.5rem clamp(2rem, 4vw, 3rem);
`;

export const IntroContent = styled.div`
  max-width: 820px;
  text-align: center;
`;

export const UserBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f8f6;
  border: 1px solid #e6e3da;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #ffb83c;
    color: #1e1e1e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .detalhes {
    display: flex;
    flex-direction: column;
    text-align: left;

    strong {
      font-size: 0.95rem;
      color: #1e1e1e;
    }
    span {
      font-size: 0.8rem;
      color: #666;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    .detalhes {
      text-align: center;
    }
  }
`;

export const BotaoSair = styled.button`
  background: transparent;
  border: 2px solid #dc2626;
  color: #dc2626;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    color: #ffffff;
  }
`;

export const IntroText = styled.p`
  color: #1e1e1e;
  font-size: clamp(0.85rem, 1vw, 0.95rem);
  line-height: 1.8;
  margin: 0;
`;

export const ToggleWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0 1.5rem clamp(2rem, 4vw, 3rem);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    padding: 0 1rem clamp(1.5rem, 3vw, 2rem);
  }
`;

export const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 1.5rem;
  background: #f9f8f6;
  border-radius: 10px;
  border: 1px solid #e6e3da;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffb83c;
    box-shadow: 0 4px 12px rgba(255, 184, 60, 0.1);
  }

  @media (max-width: 640px) {
    padding: 1.2rem;
    gap: 0.6rem;
  }
`;

export const ToggleGroupTitle = styled.h3`
  margin: 0;
  color: #1e1e1e;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #ffb83c;
`;

export const ToggleGroupDesc = styled.p`
  margin: 0;
  color: #1e1e1e;
  opacity: 0.75;
  text-align: left;
  font-size: clamp(0.75rem, 1.5vw, 0.82rem);
  line-height: 1.6;
`;

export const ToggleGroupButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.4rem;
`;

export const ToggleButton = styled.button`
  border: 2px solid #ffb83c;
  background: ${(props) => (props.$ativo ? "#ffb83c" : "transparent")};
  color: #1e1e1e;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #ffb83c;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    padding: 0.65rem 1.2rem;
    font-size: 0.75rem;
  }
`;

export const DevSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 1.5rem 60px;
  scroll-margin-top: 100px;
`;

export const SecaoAvisos = styled.section`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem clamp(2rem, 4vw, 3rem);
`;

export const AvisosCard = styled.div`
  background: #f9f8f6;
  border: 1px solid #e6e3da;
  border-radius: 10px;
  padding: 1.5rem;

  h2 {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    color: #1e1e1e;
    margin-top: 0;
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid #ffb83c;
  }
`;

export const ItemAviso = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid #e6e3da;

  &:last-child {
    border-bottom: none;
  }

  .data {
    font-size: 0.75rem;
    color: #ffb83c;
    font-weight: 700;
  }

  .texto {
    font-size: 0.85rem;
    color: #1e1e1e;
    margin-top: 4px;
    line-height: 1.5;
  }
`;