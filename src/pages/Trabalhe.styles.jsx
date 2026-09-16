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
// INTRO / TEXTO
// =============================================================

export const IntroSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(3.5rem, 6vw, 5rem) 1.5rem clamp(1.5rem, 3vw, 2.5rem);
`;

export const IntroContent = styled.div`
  max-width: 780px;
  text-align: center;

  p {
    color: #1e1e1e;
    font-size: clamp(0.9rem, 1.1vw, 1rem);
    line-height: 1.8;
    margin-bottom: 0;
  }
`;

// =============================================================
// FORMULÁRIO TRABALHE CONOSCO
// =============================================================

export const ContatoSection = styled.section`
  width: 100%;
  border-top: 1px solid #e0e0e0;
  padding: clamp(2rem, 4vw, 3rem) 1.5rem clamp(3rem, 6vw, 4rem);
  display: flex;
  justify-content: center;
`;

export const FormularioContainer = styled.form`
  width: min(680px, 100%);
  background: #ffffff;
  padding: clamp(20px, 4vw, 32px);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #23262b;
  margin-bottom: 8px;
  text-align: center;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4b4e54;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #d9d6cf;
  background: #fbfaf8;
  font-size: 14px;
  color: #1e1e1e;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #ffb83c;
  }
`;

export const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #d9d6cf;
  background: #fbfaf8;
  font-size: 14px;
  color: #1e1e1e;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #ffb83c;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #d9d6cf;
  background: #fbfaf8;
  font-size: 14px;
  color: #1e1e1e;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #ffb83c;
  }
`;

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding: 0.85rem 1.6rem;
  border: none;
  border-radius: 8px;
  background: #ffb83c;
  color: #1e1e1e;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: #ffa200;
    transform: translateY(-1px);
  }
`;