import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/globalstyle.css'
import Home from './pages/home.jsx'
import MenuPrincipal from './pages/menu.jsx'
import Footer from './pages/footer.jsx'
import Subpagina from './pages/subpagina.jsx'
import Quemsomos from './pages/Quemsomos.jsx'
import Add from './pages/Add.jsx'
import Admobras from './pages/admobras.jsx'
import Contato from './pages/Contato.jsx'
import Trabalhe from './pages/Trabalhe.jsx'
import ConsultaObra from './pages/Consultaobra.jsx'
import ScrollToTop from "./components/ScrollToTop.jsx"
import SocialBar from "./components/SocialBar.jsx"
import Materia from './pages/Materia.jsx'

// Páginas de Serviços
import Construcao from './pages/Construcao.jsx'
import Reformas from './pages/Reformas.jsx'
import Regularizacao from './pages/Regularizacao.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="Container">
        <ScrollToTop />
        <MenuPrincipal />
        <SocialBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Quemsomos" element={<Quemsomos />} />
          <Route path="/Contato" element={<Contato />} />
          <Route path="/trabalheconosco" element={<Trabalhe />} />
          <Route path="/consultaobra" element={<ConsultaObra />} />
          <Route path="/obra/:codigo" element={<ConsultaObra />} />
          <Route path="/materia/:id" element={<Materia />} />

          {/* Rotas de Serviços */}
          <Route path="/servicos/construcao" element={<Construcao />} />
          <Route path="/servicos/reformas" element={<Reformas />} />
          <Route path="/servicos/regularizacao" element={<Regularizacao />} />

          {/* Rotas de Obras e Imóveis */}
          {/* <Route path="/obras/concluidas" element={<Subpagina />} /> */}
          {/* <Route path="/imoveis/terrenos" element={<Subpagina />} /> */}
          {/* <Route path="/imoveis/casas" element={<Subpagina />} /> */}

          {/* Rotas Administrativas */}
          <Route path="/Add" element={<Add />} />
          <Route path="/Admobras" element={<Admobras />} />
          <Route path="/subpagina" element={<Subpagina />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App