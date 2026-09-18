import styled from 'styled-components'

const BREAKPOINT_MOBILE = '1200px'

export const Container = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 90px;
  background: ${({ $scrolled, $naHome }) => {
    if (!$naHome) return '#c5c4c2bd;'
    return $scrolled ? '#e1e1e1' : '#ffffffd1'
  }};
  z-index: 100;
  overflow: hidden;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    height: 70px;
  }
`

export const MenuInner = styled.div`
  width: min(1200px, 92%);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DivLogo = styled.div`
  position: absolute;
  left: calc((100% - min(1200px, 92%)) / 4);
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    height: 70px;
    width: auto;
  }

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    left: 20px;

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
  padding: 20px;
  width: auto;
  margin: 0;
  height: 100%;
  list-style: none;
  gap: 20px;

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
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0 18px;
  transition: 0.3s;
  white-space: nowrap;
  color: #171717;

  a {
    text-decoration: none;
    color: #171717;
  }

  &:hover {
    transform: scale(1.1);
  }
`

export const LinhaVer = styled.span`
  width: 2px;
  height: 40%;
  background: #bcbcbc;
  border-radius: 10px;
`

export const SubMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  padding: 10px 0;
  padding-right: 50px;
  color: #303030;
  background: ${({ $scrolled }) => ($scrolled ? '#ffa52ff3' : '#ffa52ff3')};
  z-index: 50;
  position: fixed;
  top: 92px;
  left: ${({ $left }) => $left}px;
  cursor: pointer;
  border-radius: 10px;

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
  font-size: 16px;
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
    text-underline-offset: 8px;
    text-decoration-thickness: 2px;
    color: black;
  }
`

export const Hamburger = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 20px;
  width: 28px;
  height: 20px;
  cursor: pointer;

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
  background: #ffa52ff3;
  width: 100%;
  z-index: 99;
  position: fixed;
  top: 70px;
  left: 0;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (min-width: calc(${BREAKPOINT_MOBILE} + 1px)) {
    display: none;
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 97;
  cursor: pointer;
`

export const LiMenuMobile = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  font-size: 1.3rem;
  padding: 8px;
  transition: 0.3s;

  a {
    text-decoration: none;
    color: #000000;
  }

  &:hover {
    transform: scale(1.02);
  }
`

export const LinhaHor = styled.span`
  width: 70%;
  height: 2px;
  background: #616161;
  border-radius: 3px;
`

export const SubMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  max-height: ${({ $aberto }) => ($aberto ? '400px' : '0')}; 
  transition: max-height 0.3s ease;
`

export const LiSubMobile = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  font-size: 1.1rem;
  font-weight: 400;
  transition: 0.3s;
  color: white;

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