import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

/**
 * CadastroAdminSecreto.jsx (Com tratamento robusto de carregamento e botão de atualizar)
 */

export default function CadastroAdminSecreto() {
  const navigate = useNavigate();
  
  // Estados de Controle da Senha Master
  const [autenticadoMaster, setAutenticadoMaster] = useState(false);
  const [senhaMasterInput, setSenhaMasterInput] = useState('');
  const [verificandoMaster, setVerificandoMaster] = useState(false);
  const [mostrarSenhaMaster, setMostrarSenhaMaster] = useState(false);

  // Estados do Cadastro do Novo Admin
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Estados da Gestão/Listagem de Admins
  const [admins, setAdmins] = useState([]);
  const [carregandoAdmins, setCarregandoAdmins] = useState(false);

  // ========================================
  // CARREGAR LISTA DE ADMINS (Robusta contra falhas de cache/sessão)
  // ========================================
  async function carregarAdmins(comFeedbackToast = false) {
    try {
      setCarregandoAdmins(true);
      if (comFeedbackToast && typeof showLoading === 'function') {
        showLoading('Atualizando lista...');
      }

      // Garante que a sessão está ativa e atualizada antes de consultar
      await supabase.auth.getSession();

      // Pequeno delay para estabilidade da conexão e sincronização
      await new Promise(resolve => setTimeout(resolve, 400));

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('nome', { ascending: true });

      if (error) throw error;
      
      setAdmins(data || []);

      if (comFeedbackToast && typeof toastSuccess === 'function') {
        toastSuccess('Lista de administradores atualizada!');
      }
    } catch (error) {
      console.error('Erro ao carregar administradores:', error);
      if (typeof toastError === 'function') toastError('Erro ao carregar lista de administradores.');
    } finally {
      setCarregandoAdmins(false);
      if (comFeedbackToast && typeof hideLoading === 'function') {
        hideLoading();
      }
    }
  }

  useEffect(() => {
    if (autenticadoMaster) {
      carregarAdmins();
    }
  }, [autenticadoMaster]);

  // ========================================
  // VALIDAR SENHA MASTER
  // ========================================
  async function handleVerificarSenhaMaster(e) {
    e.preventDefault();
    setErroLocal('');
    setVerificandoMaster(true);

    try {
      if (typeof showLoading === 'function') showLoading('Validando senha master...');

      const { data: senhaValida, error } = await supabase.rpc('verificar_senha_master', {
        senha_digitada: senhaMasterInput.trim()
      });

      if (error) throw error;

      if (senhaValida === true) {
        setAutenticadoMaster(true);
        setSenhaMasterInput('');
        
        try {
          await supabase.rpc('registrar_tentativa_admreg', {
            sucesso: true,
            user_agent: navigator.userAgent
          });
        } catch (auditErr) {
          console.warn('Erro ao registar auditoria:', auditErr);
        }

        if (typeof toastSuccess === 'function') {
          toastSuccess('✅ Senha Master validada com sucesso!');
        }
      } else {
        const msg = 'Senha Master incorreta. Acesso negado.';
        setErroLocal(msg);

        try {
          await supabase.rpc('registrar_tentativa_admreg', {
            sucesso: false,
            user_agent: navigator.userAgent
          });
        } catch (auditErr) {
          console.warn('Erro ao registar auditoria:', auditErr);
        }

        if (typeof toastError === 'function') toastError(msg);
      }
    } catch (err) {
      console.error('Erro ao validar senha master:', err);
      const msg = err.message || 'Erro ao validar a senha no servidor.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
    } finally {
      setVerificandoMaster(false);
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  // ========================================
  // TRADUZIR ERROS DO SUPABASE
  // ========================================
  function traduzirErroSupabase(mensagem) {
    if (!mensagem) return 'Erro ao processar o cadastro.';
    const msg = mensagem.toLowerCase();
    if (msg.includes('user already registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('at least 6 characters')) return 'A senha deve ter no mínimo 6 caracteres.';
    return mensagem;
  }

  // ========================================
  // CADASTRAR NOVO ADMIN
  // ========================================
  async function handleCadastro(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (senha !== confirmaSenha) {
      const msg = 'As senhas não coincidem. Verifique e tente novamente.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
      return;
    }

    if (senha.length < 6) {
      const msg = 'A senha deve conter pelo menos 6 caracteres.';
      setErroLocal(msg);
      if (typeof toastError === 'function') toastError(msg);
      return;
    }

    try {
      if (typeof showLoading === 'function') showLoading('Criando conta de Administrador...');

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

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              email: email.trim(),
              nome: nome.trim(),
              role: 'admin',
              ativo: true
            }
          ]);

        if (profileError) {
          console.warn('Aviso ao sincronizar perfil:', profileError);
        }

        const msg = '✅ Novo Administrador criado com sucesso!';
        setMensagemSucesso(msg);
        if (typeof toastSuccess === 'function') toastSuccess(msg);

        setNome('');
        setEmail('');
        setSenha('');
        setConfirmaSenha('');
        
        // Delay para garantir que a base de dados reflete o novo registo
        setTimeout(() => {
          carregarAdmins();
        }, 600);
      }
    } catch (error) {
      console.error('Erro no cadastro de Admin:', error);
      const msgTrad = traduzirErroSupabase(error.message || '');
      setErroLocal(msgTrad);
      if (typeof toastError === 'function') toastError(msgTrad);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  // ========================================
  // EXCLUIR/APAGAR ADMIN POR COMPLETO (RPC)
  // ========================================
  async function handleExcluirAdmin(idUsuario, emailUsuario) {
    const confirmou = window.confirm(`Tem a certeza que deseja apagar COMPLETAMENTE o administrador ${emailUsuario || idUsuario}? Esta ação não pode ser desfeita.`);
    if (!confirmou) return;

    try {
      if (typeof showLoading === 'function') showLoading('Apagando administrador por completo...');

      const { error } = await supabase.rpc('delete_user_completely', { 
        user_id: idUsuario 
      });

      if (error) throw error;

      if (typeof toastSuccess === 'function') toastSuccess('Administrador apagado por completo com sucesso!');
      
      // Delay antes de atualizar a listagem após exclusão
      setTimeout(() => {
        carregarAdmins();
      }, 600);
    } catch (error) {
      console.error('Erro ao apagar admin:', error);
      if (typeof toastError === 'function') toastError('Erro ao apagar administrador do sistema.');
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  // ========================================
  // RENDERIZAÇÃO: ETAPA 1 - Validar Senha Master
  // ========================================
  if (!autenticadoMaster) {
    return (
      <S.Pagina>
        <S.HeroWrapper>
          <S.HeroImage>
            <img src={heroImg} alt="Área Restrita - Senha Master" />
          </S.HeroImage>
          <S.HeroBadge>🔐 PAINEL SECRETO - SENHA MASTER</S.HeroBadge>
        </S.HeroWrapper>

        <S.Container>
          <S.Subtitulo>
            Digite a <strong>Senha Master</strong> para gerenciar e cadastrar administradores.
          </S.Subtitulo>

          {erroLocal && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #ffcdd2', textAlign: 'center', fontWeight: '500' }}>
              ❌ {erroLocal}
            </div>
          )}

          <S.Formulario onSubmit={handleVerificarSenhaMaster} autoComplete="off">
            <div>
              <S.Label htmlFor="senhaMaster">🔑 Senha Master</S.Label>
              <div style={{ position: 'relative' }}>
                <S.Input
                  id="senhaMaster"
                  type={mostrarSenhaMaster ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  placeholder="Digite a senha master..."
                  value={senhaMasterInput}
                  onChange={(e) => setSenhaMasterInput(e.target.value)}
                  autoFocus
                  style={{ paddingRight: '75px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhaMaster(!mostrarSenhaMaster)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#555'
                  }}
                >
                  {mostrarSenhaMaster ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <S.Botao type="submit" disabled={verificandoMaster}>
              {verificandoMaster ? '⏳ A verificar...' : '✅ Validar Acesso'}
            </S.Botao>
          </S.Formulario>
        </S.Container>
      </S.Pagina>
    );
  }

  // ========================================
  // RENDERIZAÇÃO: ETAPA 2 - Painel Completo (Cadastrar + Gerenciar)
  // ========================================
  return (
    <S.Pagina>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Painel de Administradores" />
        </S.HeroImage>
        <S.HeroBadge>GESTAO DE ADMINISTRADORES</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        {/* Seção 1: Formulário de Cadastro */}
        <div style={{ marginBottom: '40px' }}>
          <S.Subtitulo>Cadastrar Novo Administrador</S.Subtitulo>

          {mensagemSucesso && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #c8e6c9', textAlign: 'center', fontWeight: '600' }}>
              {mensagemSucesso}
            </div>
          )}

          {erroLocal && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #ffcdd2', textAlign: 'center' }}>
              ❌ {erroLocal}
            </div>
          )}

          <S.Formulario onSubmit={handleCadastro} autoComplete="off">
            <div>
              <S.Label htmlFor="nomeAdmin">Nome Completo</S.Label>
              <S.Input
                id="nomeAdmin"
                type="text"
                required
                autoComplete="off"
                data-lpignore="true"
                placeholder="Ex: João Silva"
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
                autoComplete="off"
                data-lpignore="true"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <S.Label htmlFor="senhaAdmin">Senha</S.Label>
              <div style={{ position: 'relative' }}>
                <S.Input
                  id="senhaAdmin"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  data-lpignore="true"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={{ paddingRight: '75px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#555'
                  }}
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div>
              <S.Label htmlFor="confirmaSenhaAdmin">Confirmar Senha</S.Label>
              <div style={{ position: 'relative' }}>
                <S.Input
                  id="confirmaSenhaAdmin"
                  type={mostrarConfirmaSenha ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  data-lpignore="true"
                  placeholder="Digite a senha novamente"
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                  style={{ paddingRight: '75px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#555'
                  }}
                >
                  {mostrarConfirmaSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <S.Botao type="submit">
              ✅ Cadastrar Administrador
            </S.Botao>
          </S.Formulario>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '30px 0' }} />

        {/* Seção 2: Listagem e Exclusão de Admins Existentes */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <S.Subtitulo style={{ margin: 0 }}>Administradores Atuais</S.Subtitulo>
            <button
              type="button"
              onClick={() => carregarAdmins(true)}
              disabled={carregandoAdmins}
              style={{
                background: '#4a5568',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.2s'
              }}
            >
              🔄 {carregandoAdmins ? 'A atualizar...' : 'Atualizar Lista'}
            </button>
          </div>

          {carregandoAdmins ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>A carregar lista de administradores...</p>
          ) : admins.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Nenhum administrador encontrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
              {admins.map((admin) => (
                <div key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#333', margin: '0 0 4px 0' }}>{admin.nome || 'Nome não informado'}</p>
                    <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>{admin.email || `ID: ${admin.id}`}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExcluirAdmin(admin.id, admin.email || admin.nome)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    🗑️ APAGAR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Retorno */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/Add')}
            style={{
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            ← Voltar para Painel ADM
          </button>
        </div>
      </S.Container>
    </S.Pagina>
  );
}