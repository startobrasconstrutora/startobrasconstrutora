import styled from 'styled-components'
import { Link } from 'react-router-dom'

const BREAKPOINT_MOBILE = '900px'

export const Container = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px; /* Aumentado para dar margem nas pontas da tela */
  margin: 0;
  width: 100%;
  height: 90px;
  background: ${({ $scrolled, $naHome }) => {
    if (!$naHome) return '#c5c4c2bd;'
    return $scrolled ? '#e1e1e1' : '#ffffffd1'
  }};
  z-index: 100;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 70px;
    padding: 0 20px;
  }
`

export const MenuInner = styled.div`
  width: min(1300px, 100%);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const DivLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  margin-right: 30px;

  img {
    height: 65px;
    width: auto;
    display: block;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    margin-right: 0;
    justify-content: flex-start;

    img {
      height: 50px;
      width: auto;
    }
  }
`

export const UlMenu = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  height: 100%;
  list-style: none;
  gap: 12px;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

export const Linha = styled.span`
  width: 100%;
  height: 3px;
  background: black;
  border-radius: 2px;
`

export const LiMenu = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  height: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0 10px;
  transition: 0.3s;
  white-space: nowrap;
  color: #171717;
  cursor: pointer;

  a {
    text-decoration: none;
    color: #171717;
  }

  &:hover {
    transform: scale(1.05);
  }
`

export const LinhaVer = styled.span`
  width: 1px;
  height: 35%;
  background: #bcbcbc;
  border-radius: 10px;
`

/* Botão em destaque empurrado para a extrema direita */
export const CtaButton = styled(Link)`
  margin-left: auto; /* Força o botão para a direita */
  background-color: #ffa52f;
  color: #171717;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 10px 22px;
  border-radius: 25px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: #e69123;
    transform: translateY(-2px);
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

export const SubMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  padding: 12px 0;
  color: #303030;
  background: #ffa52ff3;
  z-index: 101;
  position: fixed;
  top: 92px;
  left: ${({ $left }) => $left}px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  opacity: ${({ $aberto }) => ($aberto ? '1' : '0')};
  transform: translate(-50%, ${({ $aberto }) => ($aberto ? '0' : '-15px')});
  pointer-events: ${({ $aberto }) => ($aberto ? 'auto' : 'none')};
  transition: opacity 0.3s ease, transform 0.3s ease;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

export const ListaSubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  align-items: flex-start;
  justify-content: center;
  width: auto;
  height: 100%;
  gap: 8px;
  padding: 0;
  margin: 0;
`

export const ListaSubMenuLi = styled.li`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s;
  white-space: nowrap;
  padding: 6px 20px;
  margin: 0;

  a {
    text-decoration: none;
    color: #000000;
  }

  &:hover {
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 2px;
    color: black;
  }
`

export const Hamburger = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 30px;
  height: 22px;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;

  @media (min-width: calc(${BREAKPOINT_MOBILE} + 1px)) {
    display: none;
  }
`

export const EspacadorMobile = styled.div`
  width: 100%;
  display: none;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: block;
  }
`

export const MenuMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffa52f;
  width: 100%;
  z-index: 99;
  position: fixed;
  top: 70px;
  left: 0;
  padding: 20px 0;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (min-width: calc(${BREAKPOINT_MOBILE} + 1px)) {
    display: none;
  }
`

export const CtaButtonMobile = styled(Link)`
  background-color: #171717;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 24px;
  margin-top: 15px;
  border-radius: 25px;
  text-decoration: none;
  white-space: nowrap;
  transition: 0.3s;

  &:hover {
    background-color: #333333;
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 97;
  cursor: pointer;
`

export const LiMenuMobile = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 1.2rem;
  padding: 12px 0;
  transition: 0.3s;
  cursor: pointer;

  a,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: #000000 !important;
  }

  &:hover {
    transform: scale(1.02);
  }
`

export const LinhaHor = styled.span`
  width: 80%;
  height: 1px;
  background: rgba(0, 0, 0, 0.15);
`

export const SubMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  max-height: ${({ $aberto }) => ($aberto ? '300px' : '0')}; 
  transition: max-height 0.3s ease;
  background: rgba(0, 0, 0, 0.05);
`

export const LiSubMobile = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 500;
  transition: 0.3s;
  color: #171717;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`

export const SetaIcon = styled.span`
  margin-left: 8px;
  font-size: 0.8rem;
  transition: 0.3s;
  display: inline-block;
  transform: ${({ $aberto }) => ($aberto ? 'rotate(180deg)' : 'rotate(0deg)')};
`