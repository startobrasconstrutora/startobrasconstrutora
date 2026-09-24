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
  min-height: calc(100vh - 100px);
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

export const FormContainer = styled.div`
  width: min(500px, 92%);
  margin-top: 3.5rem;
  margin-bottom: 4rem;
  background: #f9f8f6;
  border: 1px solid #e6e3da;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const FormTitle = styled.h2`
  margin: 0;
  color: #1e1e1e;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ffb83c;
  padding-bottom: 0.6rem;
`;

export const FormDesc = styled.p`
  margin: 0;
  color: #1e1e1e;
  opacity: 0.65;
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  line-height: 1.6;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1e1e1e;
  }

  input {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    background: #ffffff;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #ffb83c;
      box-shadow: 0 0 0 2px rgba(255, 184, 60, 0.2);
    }
  }
`;

export const SubmitButton = styled.button`
  background: #ffb83c;
  color: #1e1e1e;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: #ffa710;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;