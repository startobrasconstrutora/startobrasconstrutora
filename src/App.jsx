import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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
import ObrasConcluidas from './pages/ObrasConcluidas.jsx'
import ObrasAndamento from './pages/ObrasAndamento.jsx'

import Construcao from './pages/Construcao.jsx'
import Reformas from './pages/Reformas.jsx'
import Regularizacao from './pages/Regularizacao.jsx'

// Importação das rotas da Área do Colaborador
import AuthColaboradores from './pages/AuthColaboradores.jsx'
import ResetarSenha from './pages/ResetarSenha.jsx'
import AreaColaborador from './pages/AreaColaborador.jsx'
import RotaProtegidaColaborador from './components/RotaProtegidaColaborador.jsx'

// Importação das rotas da Área de Administradores
import AuthAdmins from './pages/AuthAdmins.jsx'
import AdminResetarSenha from './pages/AdminResetarSenha.jsx'
import CadastroAdminSecreto from "./pages/CadastroAdminSecreto.jsx"
import GerenciarAdmins from "./pages/GerenciarAdmins.jsx"

// ========================================
// COMPONENTE: Proteção de Painéis de Admin
// ========================================
/**
 * Protege telas restritas do painel (gerenciamento, cadastros e obras)
 * Verifica se o usuário está logado e se possui role 'admin'
 */
function RotaProtegidaAdmin({ children }) {
  const [carregando, setCarregando] = useState(true)
  const [eAdmin, setEAdmin] = useState(false)

  useEffect(() => {
    async function verificarPermissaoAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setEAdmin(false)
          setCarregando(false)
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setEAdmin(profile?.role === 'admin')
        setCarregando(false)
      } catch (error) {
        console.error('Erro ao verificar permissão de admin:', error)
        setEAdmin(false)
        setCarregando(false)
      }
    }

    verificarPermissaoAdmin()
  }, [])

  if (carregando) {
    return (
      <div style={{ 
        padding: '100px', 
        textAlign: 'center', 
        fontWeight: 'bold',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Verificando permissões de acesso...
      </div>
    )
  }

  return eAdmin ? children : <Navigate to="/admin-login" replace />
}

// ========================================
// APLICAÇÃO PRINCIPAL
// ========================================
function App() {
  return (
    <BrowserRouter>
      <div className="Container">
        <ScrollToTop />
        <MenuPrincipal />
        <SocialBar />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/Quemsomos" element={<Quemsomos />} />
          <Route path="/Contato" element={<Contato />} />
          <Route path="/trabalheconosco" element={<Trabalhe />} />
          <Route path="/consultaobra" element={<ConsultaObra />} />
          <Route path="/obra/:codigo" element={<ConsultaObra />} />
          <Route path="/materia/:id" element={<Materia />} />
          <Route path="/obras-concluidas" element={<ObrasConcluidas />} />
          <Route path="/obras-andamento" element={<ObrasAndamento />} />
        
          <Route path="/servicos/construcao" element={<Construcao />} />
          <Route path="/servicos/reformas" element={<Reformas />} />
          <Route path="/servicos/regularizacao" element={<Regularizacao />} />

          {/* ================================================ */}
          {/* ROTAS DE AUTENTICAÇÃO E ÁREA DOS COLABORADORES   */}
          {/* ================================================ */}
          <Route 
            path="/colaboradores" 
            element={
              <RotaProtegidaColaborador>
                <AuthColaboradores />
              </RotaProtegidaColaborador>
            } 
          />
          <Route path="/resetar-senha" element={<ResetarSenha />} />
          
          {/* Rota da Área do Colaborador sem restrições/proteções */}
          <Route path="/area-colaborador" element={<AreaColaborador />} />

          {/* ================================================ */}
          {/* ROTAS DE AUTENTICAÇÃO DE ADMINISTRADORES (SEM PROTEÇÃO) */}
          {/* ================================================ */}
          <Route path="/admin-login" element={<AuthAdmins />} />
          <Route path="/Admin" element={<AuthAdmins />} />
          <Route path="/admin-resetar-senha" element={<AdminResetarSenha />} />
          <Route path="/admreg" element={<CadastroAdminSecreto />} />

          {/* ================================================ */}
          {/* PAINEL INTERNO DE ADMINISTRAÇÃO (PROTEGIDOS)     */}
          {/* ================================================ */}
          <Route 
            path="/gerenciar-admins" 
            element={
              <RotaProtegidaAdmin>
                <GerenciarAdmins />
              </RotaProtegidaAdmin>
            } 
          />

          <Route 
            path="/Add" 
            element={
              <RotaProtegidaAdmin>
                <Add />
              </RotaProtegidaAdmin>
            } 
          />

          <Route 
            path="/Admobras" 
            element={
              <RotaProtegidaAdmin>
                <Admobras />
              </RotaProtegidaAdmin>
            } 
          />

          {/* Rota Genérica */}
          <Route path="/subpagina" element={<Subpagina />} />

          {/* Rota 404 - Redireciona para Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App