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
  const [subServicosMobile, setSubServicosMobile] = useState(false)
  const [subObrasMobile, setSubObrasMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function abrirSub(tipo, ref) {
    clearTimeout(timeoutRef.current)
    const rect = ref.current.getBoundingClientRect()
    setSubMenuLeft(rect.left + rect.width / 2)
    setSubMenuAtivo(tipo)
  }

  function fecharSub() {
    timeoutRef.current = setTimeout(() => setSubMenuAtivo(null), 200)
  }

  function fecharMenu() {
    setAberto(false)
    setSubMenuAtivo(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <S.Container $scrolled={scrolled} $naHome={naHome}>
        <S.DivLogo>
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </S.DivLogo>

        <S.MenuInner>
          <S.UlMenu>
            <S.LiMenu><Link to="/" onClick={() => setSubMenuAtivo(null)}>Home</Link></S.LiMenu>
            <S.LinhaVer />

            <S.LiMenu><Link to="/quemsomos" onClick={() => setSubMenuAtivo(null)}>Quem Somos</Link></S.LiMenu>
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
              Obras e Imóveis ▾
            </S.LiMenu>
            <S.LinhaVer />

            <S.LiMenu><Link to="/contato" onClick={() => setSubMenuAtivo(null)}>Contato</Link></S.LiMenu>
          </S.UlMenu>

          {/* Botão de Destaque para Clientes */}
          <S.CtaButton to="/consultaobra" onClick={() => setSubMenuAtivo(null)}>
            Consulte sua Obra
          </S.CtaButton>

          <S.Hamburger onClick={() => setAberto(!aberto)}>
            <S.Linha />
            <S.Linha />
            <S.Linha />
          </S.Hamburger>
        </S.MenuInner>
      </S.Container>

      {}
      <S.SubMenu 
        $scrolled={scrolled} 
        $aberto={subMenuAtivo === 'servicos'} 
        $left={subMenuLeft}
        onMouseEnter={() => abrirSub('servicos', servicosRef)}
        onMouseLeave={fecharSub}
      >
        <S.ListaSubMenu>
          <S.ListaSubMenuLi>
            <Link to="/servicos/construcao" onClick={fecharMenu}>Construção</Link>
          </S.ListaSubMenuLi>
          <S.ListaSubMenuLi>
            <Link to="/servicos/reformas" onClick={fecharMenu}>Reformas</Link>
          </S.ListaSubMenuLi>
          <S.ListaSubMenuLi>
            <Link to="/servicos/regularizacao" onClick={fecharMenu}>Regularização</Link>
          </S.ListaSubMenuLi>
        </S.ListaSubMenu>
      </S.SubMenu>

      {}
      <S.SubMenu 
        $scrolled={scrolled} 
        $aberto={subMenuAtivo === 'obras'} 
        $left={subMenuLeft}
        onMouseEnter={() => abrirSub('obras', obrasRef)}
        onMouseLeave={fecharSub}
      >
        <S.ListaSubMenu>
          <S.ListaSubMenuLi>
            <Link to="/obras-concluidas" onClick={fecharMenu}>Obras Concluídas</Link>
          </S.ListaSubMenuLi>
      
        </S.ListaSubMenu>
      </S.SubMenu>

      {}
      {aberto && (
        <>
          <S.MenuMobile>
            <S.LiMenuMobile><Link to="/" onClick={fecharMenu}>Home</Link></S.LiMenuMobile>
            <S.LinhaHor />

            <S.LiMenuMobile><Link to="/quemsomos" onClick={fecharMenu}>Quem Somos</Link></S.LiMenuMobile>
            <S.LinhaHor />

            <S.LiMenuMobile onClick={() => setSubServicosMobile(!subServicosMobile)}>
              Serviços <S.SetaIcon $aberto={subServicosMobile}>▼</S.SetaIcon>
            </S.LiMenuMobile>
            <S.SubMobile $aberto={subServicosMobile}>
              <S.LiSubMobile><Link to="/servicos/construcao" onClick={fecharMenu}>Construção</Link></S.LiSubMobile>
              <S.LiSubMobile><Link to="/servicos/reformas" onClick={fecharMenu}>Reformas</Link></S.LiSubMobile>
              <S.LiSubMobile><Link to="/servicos/regularizacao" onClick={fecharMenu}>Regularização</Link></S.LiSubMobile>
            </S.SubMobile>
            <S.LinhaHor />

            <S.LiMenuMobile onClick={() => setSubObrasMobile(!subObrasMobile)}>
              Obras e Imóveis <S.SetaIcon $aberto={subObrasMobile}>▼</S.SetaIcon>
            </S.LiMenuMobile>
            <S.SubMobile $aberto={subObrasMobile}>
              <S.LiSubMobile><Link to="/obras-concluidas" onClick={fecharMenu}>Obras Concluídas</Link></S.LiSubMobile>
              <S.LiSubMobile><Link to="/subpagina" onClick={fecharMenu}>Terrenos à Venda</Link></S.LiSubMobile>
              <S.LiSubMobile><Link to="/subpagina" onClick={fecharMenu}>Casas à Venda</Link></S.LiSubMobile>
            </S.SubMobile>
            <S.LinhaHor />

            <S.LiMenuMobile><Link to="/contato" onClick={fecharMenu}>Contato</Link></S.LiMenuMobile>
            <S.LinhaHor />

            <S.LiMenuMobile><Link to="/trabalheconosco" onClick={fecharMenu}>Trabalhe Conosco</Link></S.LiMenuMobile>
            <S.LinhaHor />

            <S.CtaButtonMobile to="/consultaobra" onClick={fecharMenu}>
              Consulte sua Obra
            </S.CtaButtonMobile>
          </S.MenuMobile>

          <S.Overlay onClick={fecharMenu} />
        </>
      )}
    </>
  )
}

export default MenuPrincipal