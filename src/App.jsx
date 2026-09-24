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
import RotaProtegidaAdminAuth from './components/RotaProtegidaAdmin.jsx'

// ========================================
// COMPONENTE: Proteção de Rotas de Admin
// ========================================
/**
 * Protege rotas exclusivas de Administradores
 * Verifica se o usuário está logado e se tem role 'admin'
 */
function RotaProtegidaAdmin({ children }) {
  const [carregando, setCarregando] = useState(true)
  const [eAdmin, setEAdmin] = useState(false)

  useEffect(() => {
    async function verificarPermissaoAdmin() {
      try {
        // Verifica a sessão do Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setEAdmin(false)
          setCarregando(false)
          return
        }

        // Consulta a role na tabela profiles no Supabase
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
// COMPONENTE: Proteção de Rotas de Colaborador
// ========================================
/**
 * Protege rotas exclusivas de Colaboradores
 * Verifica se o usuário está logado e se tem role 'colaborador'
 */
function RotaProtegidaColaboradorAutenticado({ children }) {
  const [carregando, setCarregando] = useState(true)
  const [eColaborador, setEColaborador] = useState(false)

  useEffect(() => {
    async function verificarPermissaoColaborador() {
      try {
        // Verifica a sessão do Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setEColaborador(false)
          setCarregando(false)
          return
        }

        // Consulta a role na tabela profiles no Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setEColaborador(profile?.role === 'colaborador')
        setCarregando(false)
      } catch (error) {
        console.error('Erro ao verificar permissão de colaborador:', error)
        setEColaborador(false)
        setCarregando(false)
      }
    }

    verificarPermissaoColaborador()
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
        Verificando acesso...
      </div>
    )
  }

  return eColaborador ? children : <Navigate to="/colaboradores" replace />
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
          {/* ROTAS DE AUTENTICAÇÃO E ÁREA DOS COLABORADORES */}
          {/* ================================================ */}
          {/* 
            A rota /colaboradores agora está protegida por RotaProtegidaColaborador
            Isso impede que um admin logado faça login como colaborador
          */}
          <Route 
            path="/colaboradores" 
            element={
              <RotaProtegidaColaborador>
                <AuthColaboradores />
              </RotaProtegidaColaborador>
            } 
          />
          
          <Route path="/resetar-senha" element={<ResetarSenha />} />
          
          {/* Área do Colaborador é protegida e só acessível para colaboradores */}
          <Route 
            path="/area-colaborador" 
            element={
              <RotaProtegidaColaboradorAutenticado>
                <AreaColaborador />
              </RotaProtegidaColaboradorAutenticado>
            } 
          />

          {/* ================================================ */}
          {/* ROTAS DE AUTENTICAÇÃO E PAINEL DOS ADMINISTRADORES */}
          {/* ================================================ */}
          {/* 
            A rota /admin-login agora está protegida por RotaProtegidaAdminAuth
            Isso impede que um colaborador logado faça login como admin
          */}
          <Route 
            path="/admin-login" 
            element={
              <RotaProtegidaAdminAuth>
                <AuthAdmins />
              </RotaProtegidaAdminAuth>
            } 
          />
          <Route path="/admin-resetar-senha" element={<AdminResetarSenha />} />
          
          {/* Rotas Secretas / Restritas de Admin */}
          <Route path="/admreg" element={<CadastroAdminSecreto />} />
          
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