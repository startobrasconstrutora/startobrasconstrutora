import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';

export default function EsqueciSenhaAdmin({ onVoltar }) {
  const [email, setEmail] = useState('');

  async function handleRecuperarSenha(e) {
    e.preventDefault();
    showLoading('Enviando e-mail de recuperação...');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        // Redireciona especificamente para a rota do Administrador
        redirectTo: `${window.location.origin}/admin-resetar-senha`,
      });

      if (error) throw error;

      toastSuccess('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
      if (onVoltar) onVoltar();
    } catch (error) {
      toastError(error.message || 'Falha ao solicitar redefinição.');
    } finally {
      hideLoading();
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: 10, color: '#1e1e1e' }}>Recuperar Senha (ADM)</h2>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
        Informe o e-mail cadastrado do Administrador para receber as instruções.
      </p>

      <form onSubmit={handleRecuperarSenha}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>E-mail do Administrador</label>
          <input 
            type="email" 
            required 
            placeholder="admin@exemplo.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: 12, background: '#ffb83c', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', color: '#1e1e1e' }}
        >
          Enviar Link de Recuperação
        </button>
      </form>

      {onVoltar && (
        <button 
          type="button" 
          onClick={onVoltar}
          style={{ marginTop: 16, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          ← Voltar para o Login ADM
        </button>
      )}
    </div>
  );
}