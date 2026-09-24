import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function AuthColaboradores({ onLoginSucesso }) {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Tratamento e tradução completa dos erros retornados pelo Supabase
  function traduzirErroSupabase(mensagem) {
    if (!mensagem) return 'Erro ao processar a solicitação.';

    const msg = mensagem.toLowerCase();

    if (msg.includes('invalid login credentials')) {
      return 'E-mail ou senha incorretos.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Por favor, confirme seu e-mail para continuar.';
    }
    if (msg.includes('user not found')) {
      return 'Usuário não encontrado.';
    }
    if (msg.includes('at least 6 characters') || msg.includes('password should be at least')) {
      return 'A senha deve ter no mínimo 6 caracteres.';
    }
    if (msg.includes('rate limit exceeded') || msg.includes('too many requests')) {
      return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
    }
    if (msg.includes('is invalid') || msg.includes('unable to validate email address')) {
      return 'Endereço de e-mail inválido. Utilize um e-mail válido.';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'Este e-mail já está cadastrado. Tente fazer login.';
    }
    if (msg.includes('signup requires a valid password')) {
      return 'O cadastro exige uma senha válida.';
    }

    return mensagem;
  }

  // Função para envio de e-mail de redefinição de senha
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
        redirectTo: `${window.location.origin}/resetar-senha`,
      });

      if (error) throw error;

      const msg = 'E-mail de recuperação enviado! Verifique sua caixa de entrada ou spam.';
      setMensagemSucesso(msg);
      if (typeof toastSuccess === 'function') toastSuccess(msg);
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      const mensagemTradução = traduzirErroSupabase(error.message || '');
      setErroLocal(mensagemTradução);
      if (typeof toastError === 'function') toastError(mensagemTradução);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  // Função para Login / Cadastro
  async function handleAuth(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (modoCadastro && senha.length < 6) {
      const msg = 'A senha deve conter pelo menos 6 caracteres.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
      return;
    }

    try {
      if (typeof showLoading === 'function') showLoading(modoCadastro ? 'Criando conta...' : 'Entrando...');

      if (modoCadastro) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: { nome: nome.trim() }
          }
        });

        if (error) throw error;

        if (data?.session || data?.user) {
          const msg = 'Conta criada com sucesso! Redirecionando...';
          setMensagemSucesso(msg);

          if (typeof toastSuccess === 'function') toastSuccess('Conta criada com sucesso!');
          if (onLoginSucesso && data.session) onLoginSucesso(data.session);

          setTimeout(() => {
            navigate('/area-colaborador');
          }, 1800);
        } else {
          setErroLocal('Não foi possível concluir o cadastro.');
        }

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

        if (error) throw error;

        if (typeof toastSuccess === 'function') toastSuccess('Login realizado com sucesso!');
        if (onLoginSucesso) onLoginSucesso(data.session);
        
        navigate('/area-colaborador');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
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
          <img src={heroImg} alt="Área do Colaborador Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>ÁREA DO COLABORADOR</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        <S.Subtitulo>
          {modoEsqueciSenha
            ? 'Digite seu e-mail para receber as instruções de redefinição de senha.'
            : modoCadastro
            ? 'Preencha os dados abaixo para solicitar o seu cadastro de colaborador.'
            : 'Informe seu e-mail e senha para acessar o painel restrito.'}
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
          /* FORMULÁRIO DE ESQUECI MINHA SENHA */
          <S.Formulario onSubmit={handleEsqueciSenha}>
            <div>
              <S.Label htmlFor="emailEsqueci">E-mail Cadastrado</S.Label>
              <S.Input
                id="emailEsqueci"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <S.Botao type="submit">
              Enviar link de redefinição
            </S.Botao>

            <S.AcoesSecundarias>
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
          /* FORMULÁRIO DE LOGIN E CADASTRO */
          <S.Formulario onSubmit={handleAuth}>
            {modoCadastro && (
              <div>
                <S.Label htmlFor="nomeColaborador">Nome Completo</S.Label>
                <S.Input
                  id="nomeColaborador"
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            )}

            <div>
              <S.Label htmlFor="emailColaborador">E-mail</S.Label>
              <S.Input
                id="emailColaborador"
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <S.Label htmlFor="senhaColaborador">Senha</S.Label>
              <S.Input
                id="senhaColaborador"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <S.Botao type="submit">
              {modoCadastro ? 'Cadastrar' : 'Entrar'}
            </S.Botao>

            <S.AcoesSecundarias>
              <S.BotaoLink
                type="button"
                onClick={() => {
                  setModoCadastro(!modoCadastro);
                  setMensagemSucesso('');
                  setErroLocal('');
                }}
              >
                {modoCadastro ? '‹ Já tem conta? Faça login' : 'Criar nova conta'}
              </S.BotaoLink>

              {!modoCadastro && (
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
              )}
            </S.AcoesSecundarias>
          </S.Formulario>
        )}
      </S.Container>
    </S.Pagina>
  );
}