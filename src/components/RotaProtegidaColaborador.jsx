import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * Componente que protege a rota de autenticação de colaboradores
 * Impede que administradores façam login como colaborador
 * 
 * Comportamento:
 * - Se já está logado como Admin → redireciona para /Add (painel ADM)
 * - Se já está logado como Colaborador → redireciona para /area-colaborador
 * - Se não está logado → permite acesso ao formulário de autenticação
 */
function RotaProtegidaColaborador({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [statusAcesso, setStatusAcesso] = useState(null); // 'admin', 'colaborador', 'nao-logado'

  useEffect(() => {
    async function verificarStatusUsuario() {
      try {
        // Verifica a sessão atual
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // Usuário não está logado → permite acesso ao formulário
          setStatusAcesso('nao-logado');
          setCarregando(false);
          return;
        }

        // Busca o perfil do usuário logado
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          setStatusAcesso('nao-logado');
          setCarregando(false);
          return;
        }

        // Determina o status baseado na role
        if (profile?.role === 'admin') {
          setStatusAcesso('admin');
        } else if (profile?.role === 'colaborador') {
          setStatusAcesso('colaborador');
        } else {
          setStatusAcesso('nao-logado');
        }

        setCarregando(false);
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setStatusAcesso('nao-logado');
        setCarregando(false);
      }
    }

    verificarStatusUsuario();
  }, []);

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
    );
  }

  // Se é admin, redireciona para o painel ADM
  if (statusAcesso === 'admin') {
    return <Navigate to="/Add" replace />;
  }

  // Se já é colaborador logado, redireciona para sua área
  if (statusAcesso === 'colaborador') {
    return <Navigate to="/area-colaborador" replace />;
  }

  // Se não está logado, permite acesso ao formulário de autenticação
  return children;
}

export default RotaProtegidaColaborador;