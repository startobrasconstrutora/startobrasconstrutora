import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastError } from '../utils/alert';

export default function RotaPrivadaAdmin({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    async function verificarAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setAutorizado(false);
          setCarregando(false);
          return;
        }

        // Verifica estritamente se o perfil logado é admin
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || profile?.role !== 'admin') {
          // Se não for admin (ex: for colaborador), bloqueia
          setAutorizado(false);
        } else {
          setAutorizado(true);
        }
      } catch (err) {
        setAutorizado(false);
      } finally {
        setCarregando(false);
      }
    }

    verificarAdmin();
  }, []);

  if (carregando) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', fontWeight: 'bold' }}>
        A verificar permissões de administrador...
      </div>
    );
  }

  if (!autorizado) {
    toastError('Acesso restrito. Apenas administradores podem aceder a esta página.');
    // Força o logout de segurança caso um colaborador tente entrar via URL direta
    supabase.auth.signOut();
    return <Navigate to="/colaboradores" replace />;
  }

  return children;
}