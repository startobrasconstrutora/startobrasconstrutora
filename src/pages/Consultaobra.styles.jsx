import styled from "styled-components";

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
  max-width: 640px;
  margin: 4rem auto 0; /* Dá espaço suficiente após a badge do topo */
  padding: 0 16px;
`;

export const Titulo = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #23262b;
  margin: 0 0 6px;
`;

export const Subtitulo = styled.p`
  font-size: 15px;
  color: #6e7178;
  margin: 0 0 28px;
  text-align: center;
`;

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #fff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(30, 30, 30, 0.08);
  border: 1px solid #e0e0e0;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
  color: #4b4e54;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  background: #fbfaf8;
  color: #23262b;
  border: 1px solid #d9d6cf;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #ffb83c;
  }
`;

export const Erro = styled.div`
  background: #fbe9e7;
  color: #b3453d;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
`;

export const Botao = styled.button`
  border: none;
  background: #ffb83c;
  color: #23262b;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #ffa200;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BotaoVoltar = styled.button`
  border: none;
  background: transparent;
  color: #6e7178;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;

  &:hover {
    color: #23262b;
  }
`;

export const CabecalhoObra = styled.header`
  margin-bottom: 20px;
`;

export const CodigoObra = styled.span`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  color: #a7742a;
  background: #fff3dc;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
`;

export const ImagemCapa = styled.img`
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 24px;
`;

export const BlocoProgresso = styled.section`
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(30, 30, 30, 0.06);
  border: 1px solid #e0e0e0;
`;

export const LinhaProgresso = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const BarraFundo = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 6px;
  background: #e6e3da;
  overflow: hidden;
  margin-bottom: 18px;
`;

export const BarraPreenchida = styled.div`
  height: 100%;
  background: #ffb83c;
  transition: width 0.3s ease;
`;

export const GridEtapas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

export const ItemEtapa = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #4b4e54;
`;

export const BlocoTexto = styled.section`
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(30, 30, 30, 0.06);
  border: 1px solid #e0e0e0;
`;

export const TituloSecao = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #23262b;
  margin: 0 0 12px;
`;

export const Paragrafo = styled.p`
  font-size: 14px;
  color: #4b4e54;
  line-height: 1.6;
  margin: 0;
`;

export const CardAtualizacao = styled.article`
  border-left: 3px solid #ffb83c;
  padding-left: 16px;
`;

export const DataAtualizacao = styled.time`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #a7a49c;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

export const GridFotos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const FotoAtualizacao = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  border: 1px solid #e6e3da;
`;