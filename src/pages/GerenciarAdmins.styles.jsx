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
  margin-bottom: 2rem;
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
  width: min(1200px, 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #f9f8f6;
  border: 1px solid #e6e3da;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    padding: 1.2rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #1e1e1e;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: clamp(1rem, 2vw, 1.2rem);
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #ffb83c;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  color: #1e1e1e;
  opacity: 0.65;
  font-size: 0.9rem;
`;

export const AdminsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AdminCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e6e3da;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffb83c;
    box-shadow: 0 4px 12px rgba(255, 184, 60, 0.1);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const AdminInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .name {
    font-weight: 700;
    color: #1e1e1e;
    font-size: 0.95rem;
    margin: 0;
  }

  .email {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
  }
`;

export const RemoveButton = styled.button`
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #c62828;
    color: #ffffff;
    border-color: #c62828;
    box-shadow: 0 4px 12px rgba(198, 40, 40, 0.2);
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    width: 100%;
    text-align: center;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  padding: 40px;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 0.95rem;
`;