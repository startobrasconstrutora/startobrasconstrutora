import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function CadastroAdminSecreto({ onLoginSucesso }) {
  const navigate = useNavigate();
  
  // Estados de Controle da Senha Master
  const [autenticadoMaster, setAutenticadoMaster] = useState(false);
  const [senhaMasterInput, setSenhaMasterInput] = useState('');
  const [verificandoMaster, setVerificandoMaster] = useState(false);

  // Estados do Cadastro do Novo Admin
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Valida a Senha Master chamando a função segura no Supabase (RPC)
  async function handleVerificarSenhaMaster(e) {
    e.preventDefault();
    setErroLocal('');
    setVerificandoMaster(true);

    try {
      const { data: senhaValida, error } = await supabase.rpc('verificar_senha_master', {
        senha_digitada: senhaMasterInput.trim()
      });

      if (error) throw error;

      if (senhaValida === true) {
        setAutenticadoMaster(true);
        // Concede o passe livre master para evitar re-login nas rotas protegidas
        sessionStorage.setItem('master_bypass', 'true');
        if (typeof toastSuccess === 'function') toastSuccess('Senha Master validada com sucesso!');
      } else {
        const msg = 'Senha Master incorreta. Acesso negado.';
        setErroLocal(msg);
        if (typeof toastError === 'function') toastError(msg);
      }
    } catch (err) {
      console.error('Erro ao validar senha master:', err);
      const msg = 'Erro ao validar a senha no servidor.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
    } finally {
      setVerificandoMaster(false);
    }
  }

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

      // Cria a conta enviando is_admin e role: 'admin' nos metadados
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: { 
            nome: nome.trim(),
            is_admin: true,
            role: 'admin'
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

  // ETAPA 1: Tela de Bloqueio por Senha Master (Validada via Banco)
  if (!autenticadoMaster) {
    return (
      <S.Pagina>
        <S.HeroWrapper>
          <S.HeroImage>
            <img src={heroImg} alt="Área Restrita" />
          </S.HeroImage>
          <S.HeroBadge>ÁREA RESTRITA - ADM MASTER</S.HeroBadge>
        </S.HeroWrapper>

        <S.Container>
          <S.Subtitulo>
            Insira a Senha Master para liberar o cadastro de administradores.
          </S.Subtitulo>

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

          <S.Formulario onSubmit={handleVerificarSenhaMaster}>
            <div>
              <S.Label htmlFor="senhaMaster">Senha Master</S.Label>
              <S.Input
                id="senhaMaster"
                type="password"
                required
                placeholder="Digite a senha master de segurança"
                value={senhaMasterInput}
                onChange={(e) => setSenhaMasterInput(e.target.value)}
              />
            </div>

            <S.Botao type="submit" disabled={verificandoMaster}>
              {verificandoMaster ? 'Verificando...' : 'Liberar Formulário'}
            </S.Botao>
          </S.Formulario>
        </S.Container>
      </S.Pagina>
    );
  }

  // ETAPA 2: Formulário oficial de cadastro de Admin (Liberado após acerto da senha)
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

        {/* Botão de atalho para gerenciar/remover administradores existentes */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('master_bypass', 'true'); // Garante o passe antes de navegar
              navigate('/gerenciar-admins');
            }}
            style={{
              background: 'transparent',
              color: '#333',
              border: '1px solid #ccc',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Gerenciar / Remover Administradores Existentes
          </button>
        </div>
      </S.Container>
    </S.Pagina>
  );
}