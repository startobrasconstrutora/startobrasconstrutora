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

function App() {
  return (
    <BrowserRouter>
      <div className="Container">
        <ScrollToTop />
        <MenuPrincipal />
        <SocialBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subpagina" element={<Subpagina />} />
          <Route path="/Quemsomos" element={<Quemsomos />} />
          <Route path="/Contato" element={<Contato />} />
          <Route path="/Add" element={<Add />} />
          <Route path="/Admobras" element={<Admobras />} />
          <Route path="/consultaobra" element={<ConsultaObra />} />
          <Route path="/trabalheconosco" element={<Trabalhe />} />
          <Route path="/obra/:codigo" element={<ConsultaObra />} />
          <Route path="/materia/:id" element={<Materia />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
