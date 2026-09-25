import styled from 'styled-components';

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

export const UserHeaderContainer = styled.div`
  width: min(1200px, 92%);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const UserHeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: #f9f8f6;
  border: 1px solid #e6e3da;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.8rem;
    text-align: center;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.85rem, 1.2vw, 0.95rem);

  .label {
    color: #666;
  }

  .email {
    font-weight: 700;
    color: #1e1e1e;
  }
`;

export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

export const LogoutButton = styled.button`
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c62828;
    color: #ffffff;
    border-color: #c62828;
  }
`;

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
  opacity: 0.65;
  text-align: left;
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  line-height: 1.6;
`;

export const DevSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  scroll-margin-top: 100px;
`;