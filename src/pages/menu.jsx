import * as S from './menu.styles.jsx'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/img/logob.png"



function MenuPrincipal() {
  const location = useLocation()
  const naHome = location.pathname === '/'
  const [aberto, setAberto] = useState(false)
  const [subMenuAtivo, setSubMenuAtivo] = useState(null)
  const [subMenuLeft, setSubMenuLeft] = useState(0)
  const [subMenuMobile, setSubMenuMobile] = useState(false)
  const timeoutRef = useRef(null)
  const servicosRef = useRef(null)
  const obrasRef = useRef(null)

useEffect(() => {
  if (aberto) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, [aberto])

function abrirSub(tipo, ref) {
  clearTimeout(timeoutRef.current)
  const rect = ref.current.getBoundingClientRect()
  setSubMenuLeft(rect.left + rect.width / 2)
  setSubMenuAtivo(tipo)
}

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);


function fecharSub() {
  timeoutRef.current = setTimeout(() => setSubMenuAtivo(null), 200)
}

function fecharMenu() {
  setAberto(false)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

  return (
    <>
 <S.Container $scrolled={scrolled} $naHome={naHome}>
  <S.DivLogo><Link to="/"><img src={logo} /></Link></S.DivLogo>

  <S.MenuInner>
    <S.UlMenu>
      <S.LiMenu><Link to="/" onClick={() => setSubMenuAtivo(null)}>Home</Link></S.LiMenu>
      <S.LinhaVer />
      <S.LiMenu
        ref={servicosRef}
        onMouseEnter={() => abrirSub('servicos', servicosRef)}
        onMouseLeave={fecharSub}
      >
        Serviços ▾
      </S.LiMenu>
      <S.LinhaVer />
      <S.LiMenu
        ref={obrasRef}
        onMouseEnter={() => abrirSub('obras', obrasRef)}
        onMouseLeave={fecharSub}
      >
        Obras ▾
      </S.LiMenu>
      <S.LinhaVer />
      <S.LiMenu><Link to="/Quemsomos" onClick={() => setSubMenuAtivo(null)}>Quem Somos</Link></S.LiMenu>
      <S.LinhaVer />
      <S.LiMenu><Link to="/Contato" onClick={() => setSubMenuAtivo(null)}>Contato</Link></S.LiMenu>
      <S.LinhaVer />
      <S.LiMenu><Link to="/trabalheconosco" onClick={() => setSubMenuAtivo(null)}>Trabalhe Conosco</Link></S.LiMenu>
      <S.LinhaVer />
      
         <S.LiMenu><Link to="/consultaobra" onClick={() => setSubMenuAtivo(null)}>Consulte sua Obra</Link></S.LiMenu>
    </S.UlMenu>

    <S.Hamburger onClick={() => setAberto(!aberto)}>
      <S.Linha />
      <S.Linha />
      <S.Linha />
    </S.Hamburger>
  </S.MenuInner>
</S.Container>

      <S.SubMenu $scrolled={scrolled} $aberto={subMenuAtivo === 'servicos'} $left={subMenuLeft}
        onMouseEnter={() => abrirSub('servicos', servicosRef)}
        onMouseLeave={fecharSub}
      >
        <S.ListaSubMenu>
          <S.ListaSubMenuLi>Construção</S.ListaSubMenuLi>
          <S.ListaSubMenuLi>Reformas</S.ListaSubMenuLi>
          <S.ListaSubMenuLi>Regularização</S.ListaSubMenuLi>
        </S.ListaSubMenu>
      </S.SubMenu>

      <S.SubMenu $scrolled={scrolled} $aberto={subMenuAtivo === 'obras'} $left={subMenuLeft}
        onMouseEnter={() => abrirSub('obras', obrasRef)}
        onMouseLeave={fecharSub}
      >
        <S.ListaSubMenu>
          <S.ListaSubMenuLi><Link to="/consultaobra" onClick={fecharMenu}>Consulte sua Obra</Link></S.ListaSubMenuLi>
          <S.ListaSubMenuLi>Obras Concluídas</S.ListaSubMenuLi>
            <S.ListaSubMenuLi>Terrenos à Venda</S.ListaSubMenuLi>
          <S.ListaSubMenuLi>Casas à venda</S.ListaSubMenuLi>
        </S.ListaSubMenu>
      </S.SubMenu>

      {aberto && (
      <>
        <S.MenuMobile>
          <S.LiMenuMobile><Link to="/" onClick={fecharMenu}>Home</Link></S.LiMenuMobile>
          <S.LinhaHor />
          <S.LiMenuMobile onClick={() => setSubMenuMobile(!subMenuMobile)}>
            Item com SubMenu <S.SetaIcon $aberto={subMenuMobile}>▼</S.SetaIcon>
          </S.LiMenuMobile>
          <S.SubMobile $aberto={subMenuMobile}>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 1</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 2</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 3</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 4</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 5</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 6</S.LiSubMobile>
            <S.LinhaHor />
            <S.LiSubMobile onClick={fecharMenu}>SubItem 7</S.LiSubMobile>
          </S.SubMobile>
          <S.LinhaHor />
          <S.LiMenuMobile><Link to="/consultaobra" onClick={fecharMenu}>Consulte sua Obra</Link></S.LiMenuMobile>
          <S.LinhaHor />
          <S.LiMenuMobile><Link to="/Subpagina" onClick={fecharMenu}>Item</Link></S.LiMenuMobile>
          <S.LinhaHor />
          <S.LiMenuMobile><Link to="/Subpagina" onClick={fecharMenu}>Item</Link></S.LiMenuMobile>
        </S.MenuMobile>
        <S.Overlay onClick={fecharMenu} />
      </>
      )}
    </>
  )
}

export default MenuPrincipal