import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function AuthAdmins({ onLoginSucesso }) {
  const navigate = useNavigate();
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  function traduzirErroSupabase(mensagem) {
    if (!mensagem) return 'Erro ao processar a solicitação.';
    const msg = mensagem.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (msg.includes('email not confirmed')) return 'Por favor, confirme seu e-mail para continuar.';
    if (msg.includes('user not found')) return 'Usuário não encontrado.';
    if (msg.includes('rate limit exceeded')) return 'Muitas tentativas. Aguarde alguns minutos.';
    return mensagem;
  }

  // Envio de e-mail de recuperação de senha direcionado ao ADM
  async function handleEsqueciSenha(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (!email.trim()) {
      setErroLocal('Informe o seu e-mail.');
      return;
    }

    try {
      if (typeof showLoading === 'function') showLoading('Enviando e-mail...');
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin-resetar-senha`,
      });
      if (error) throw error;

      const msg = 'E-mail de recuperação enviado! Verifique sua caixa de entrada.';
      setMensagemSucesso(msg);
      if (typeof toastSuccess === 'function') toastSuccess(msg);
    } catch (error) {
      const msgTrad = traduzirErroSupabase(error.message || '');
      setErroLocal(msgTrad);
      if (typeof toastError === 'function') toastError(msgTrad);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  // Apenas Login de Administrador com validação da tabela profiles
  async function handleLogin(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    try {
      if (typeof showLoading === 'function') showLoading('Entrando no painel...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) throw error;

      // Validação se o perfil no banco é realmente Admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Acesso negado: Este usuário não possui privilégios de administrador.');
      }

      if (typeof toastSuccess === 'function') toastSuccess('Login de Administrador realizado!');
      if (onLoginSucesso) onLoginSucesso(data.session);

      navigate('/Add');
    } catch (error) {
      console.error('Erro no login de Admin:', error);
      const mensagemTradução = traduzirErroSupabase(error.message || '');
      setErroLocal(mensagemTradução);
      if (typeof toastError === 'function') toastError(mensagemTradução);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  return (
    <S.Pagina>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Painel Administrativo Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>PAINEL ADM - AUTENTICAÇÃO</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        <S.Subtitulo>
          {modoEsqueciSenha
            ? 'Digite seu e-mail para receber as instruções de redefinição de senha.'
            : 'Acesso exclusivo para administradores. Informe suas credenciais.'}
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

        {modoEsqueciSenha ? (
          /* FORMULÁRIO DE ESQUECI A SENHA */
          <S.Formulario onSubmit={handleEsqueciSenha}>
            <div>
              <S.Label htmlFor="emailEsqueci">E-mail Cadastrado</S.Label>
              <S.Input
                id="emailEsqueci"
                type="email"
                required
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <S.Botao type="submit">
              Enviar link de redefinição
            </S.Botao>

            <S.AcoesSecundarias style={{ justifyContent: 'center' }}>
              <S.BotaoLink
                type="button"
                onClick={() => {
                  setModoEsqueciSenha(false);
                  setMensagemSucesso('');
                  setErroLocal('');
                }}
              >
                ‹ Voltar para o login
              </S.BotaoLink>
            </S.AcoesSecundarias>
          </S.Formulario>
        ) : (
          /* FORMULÁRIO EXCLUSIVO DE LOGIN */
          <S.Formulario onSubmit={handleLogin}>
            <div>
              <S.Label htmlFor="emailAdmin">E-mail</S.Label>
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
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <S.Botao type="submit">
              Entrar no Painel ADM
            </S.Botao>

            <S.AcoesSecundarias style={{ justifyContent: 'flex-end' }}>
              <S.BotaoLink
                type="button"
                onClick={() => {
                  setModoEsqueciSenha(true);
                  setMensagemSucesso('');
                  setErroLocal('');
                }}
              >
                Esqueci minha senha
              </S.BotaoLink>
            </S.AcoesSecundarias>
          </S.Formulario>
        )}
      </S.Container>
    </S.Pagina>
  );
}