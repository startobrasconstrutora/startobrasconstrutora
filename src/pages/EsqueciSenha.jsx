import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';

export default function EsqueciSenha({ onVoltar }) {
  const [email, setEmail] = useState('');

  async function handleRecuperarSenha(e) {
    e.preventDefault();
    showLoading('Enviando e-mail de recuperação...');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/resetar-senha`, // URL do seu app onde o usuário redefinirá a senha
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
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20 }}>
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleRecuperarSenha}>
        <div style={{ marginBottom: 12 }}>
          <label>Digite seu e-mail cadastrado</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
          Enviar link de recuperação
        </button>
      </form>

      <button 
        type="button" 
        onClick={onVoltar}
        style={{ marginTop: 15, background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
      >
        ← Voltar para o Login
      </button>
    </div>
  );
}