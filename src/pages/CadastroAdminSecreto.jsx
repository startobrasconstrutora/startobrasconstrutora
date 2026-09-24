import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function CadastroAdminSecreto({ onLoginSucesso }) {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  function traduzirErroSupabase(mensagem) {
    if (!mensagem) return 'Erro ao processar o cadastro.';
    const msg = mensagem.toLowerCase();
    if (msg.includes('user already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('at least 6 characters')) return 'A senha deve ter no mínimo 6 caracteres.';
    return mensagem;
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (senha.length < 6) {
      const msg = 'A senha deve conter pelo menos 6 caracteres.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
      return;
    }

    try {
      if (typeof showLoading === 'function') showLoading('Criando conta de Administrador...');

      // Cria a conta enviando a flag de admin nos metadados
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: { 
            nome: nome.trim(),
            is_admin: true 
          }
        }
      });

      if (error) throw error;

      if (data?.session || data?.user) {
        const msg = 'Conta de Administrador criada com sucesso!';
        setMensagemSucesso(msg);
        if (typeof toastSuccess === 'function') toastSuccess(msg);
        if (onLoginSucesso && data.session) onLoginSucesso(data.session);

        setTimeout(() => {
          navigate('/Add');
        }, 1500);
      }
    } catch (error) {
      console.error('Erro no cadastro secreto de Admin:', error);
      const msgTrad = traduzirErroSupabase(error.message || '');
      setErroLocal(msgTrad);
      if (typeof toastError === 'function') toastError(msgTrad);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  return (
    <S.Pagina>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Cadastro Administrativo Secreto" />
        </S.HeroImage>
        <S.HeroBadge>CADASTRO EXCLUSIVO ADM</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        <S.Subtitulo>
          Crie sua conta de Administrador com acesso completo ao painel.
        </S.Subtitulo>

        {mensagemSucesso && (
          <div style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #c8e6c9',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {mensagemSucesso}
          </div>
        )}

        {erroLocal && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ffcdd2',
            textAlign: 'center'
          }}>
            {erroLocal}
          </div>
        )}

        <S.Formulario onSubmit={handleCadastro}>
          <div>
            <S.Label htmlFor="nomeAdmin">Nome Completo</S.Label>
            <S.Input
              id="nomeAdmin"
              type="text"
              required
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <S.Label htmlFor="emailAdmin">E-mail de Administrador</S.Label>
            <S.Input
              id="emailAdmin"
              type="email"
              required
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <S.Label htmlFor="senhaAdmin">Senha</S.Label>
            <S.Input
              id="senhaAdmin"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <S.Botao type="submit">
            Cadastrar como Administrador
          </S.Botao>
        </S.Formulario>
      </S.Container>
    </S.Pagina>
  );
}