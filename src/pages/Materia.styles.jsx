import styled from "styled-components";
import { Link } from "react-router-dom";

export const Pagina = styled.main`
  min-height: 100vh;
  background: #ffffff;
  color: #1e1e1e;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding-top: 50px;
  padding-bottom: 60px;
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
  max-width: 900px;
  margin: 4rem auto 0;
  padding: 0 16px;
`;

export const BotaoVoltar = styled(Link)`
  display: inline-block;
  color: #6e7178;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  text-decoration: none;

  &:hover {
    color: #23262b;
  }
`;

export const Quadro = styled.article`
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(30, 30, 30, 0.08);
  border: 1px solid #e0e0e0;
`;

export const ImagemCapa = styled.img`
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const Data = styled.span`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  color: #a7742a;
  background: #fff3dc;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 14px;
`;

export const Titulo = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #23262b;
  margin: 0 0 22px;
`;

export const Texto = styled.div`
  font-size: 15px;
  color: #4b4e54;
  line-height: 1.8;

  p {
    margin: 0 0 16px;
  }
`;

export const Mensagem = styled.p`
  font-size: 15px;
  color: #6e7178;
  text-align: center;
  margin: 40px 0;
`;