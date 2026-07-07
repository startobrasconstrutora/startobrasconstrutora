import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Container = styled.div`
  display: flex;
  background: var(--bg-cinza);
  width: 100%;
  flex-direction: column;
  font-size: clamp(10px, 1.0vw, 1.2rem);
  padding: 0px 10%;
`

export const FooterEmbaixo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 1.5rem;
  border-bottom: 0.5px solid rgba(88, 88, 88, 0.15);
  width: 100%;
  justify-content: space-around;
`

export const LogoFooter = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.75rem;
  height: auto;
  margin-top: 0;
  justify-content: center;

  img {
    height: 90px;
    width: auto;
    object-fit: contain;
  }
`

export const Endereco = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  justify-content: flex-start;

  p {
    color: black;
    font-size: clamp(13px, 1vw, 0.9rem);
    line-height: 1.6;
    margin: 0;
    text-align: left;
  }

  a {
    color: black;
    text-decoration: none;
  }
`

export const FooterLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 50px;
`

export const Mapasite = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 0.25rem;
  justify-content: flex-start;
  min-width: 150px;
`

export const FooterLabel = styled.span`
  color: black;
  font-size: 17px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.5rem;
`

export const FooterMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 0;
    padding: 0;
  }

  a {
    color: black;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
    margin-top: 0;
    font-weight: 400;

    &:hover {
      color: rgb(51, 51, 51);
      font-weight: 900;
    }
  }
`

export const FooterCopy = styled.div`
  color: black;
  font-size: 12px;
  text-align: center;
  margin-top: 1.25rem;
  padding-bottom: 50px;
`

export const Social = styled.div`
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-around;
  width: 100%;
`

export const LinhaHorizontal = styled.div`

  width: 100%;
  height: 1px;
  background: rgba(88, 88, 88, 0.15);
`

export const LogoSocial = styled(FontAwesomeIcon)`
    color: rgb(35, 0, 45);
  font-size: 30px;
  transition: 0.4s;
  cursor: pointer;

  &:hover {
    color: rgb(35, 0, 45);
    font-size: 30px;
    transform: scale(1.4);
  }
`