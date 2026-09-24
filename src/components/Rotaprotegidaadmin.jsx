import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastError } from '../utils/alert';

/**
 * Componente de Proteção Rígida para o Painel Administrativo.
 * Garante que APENAS administradores consigam aceder às rotas protegidas.
 * Se um colaborador tentar aceder, é bloqueado e deslogado por segurança.
 */
function RotaPrivadaAdmin({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    async function verificarPermissaoAdmin() {
      try {
        // 1. Verifica se existe sessão ativa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setAutorizado(false);
          setCarregando(false);
          return;
        }

        // 2. Consulta estritamente a tabela 'profiles' para validar o cargo (role)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Erro ao verificar o perfil de acesso:', profileError);
          setAutorizado(false);
          setCarregando(false);
          return;
        }

        // 3. Validação final do cargo
        if (profile.role === 'admin') {
          setAutorizado(true);
        } else {
          // Se for colaborador ou qualquer outro cargo, bloqueia o acesso
          setAutorizado(false);
        }
      } catch (err) {
        console.error('Erro crítico na verificação de admin:', err);
        setAutorizado(false);
      } finally {
        setCarregando(false);
      }
    }

    verificarPermissaoAdmin();
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
        justifyContent: 'center',
        background: '#f8f9fa',
        color: '#333'
      }}>
        A verificar credenciais de administrador...
      </div>
    );
  }

  // Se não estiver autorizado (ex: é um colaborador a tentar forçar a rota)
  if (!autorizado) {
    toastError('Acesso restrito. Esta área é exclusiva para administradores.');
    
    // Força o encerramento da sessão atual por segurança para evitar brechas
    supabase.auth.signOut();

    // Redireciona de volta para a página de login de colaboradores
    return <Navigate to="/colaboradores" replace />;
  }

  // Se passou em todas as validações, renderiza o painel administrativo
  return children;
}

export default RotaPrivadaAdmin;