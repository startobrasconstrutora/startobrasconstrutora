import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone } from './mascaras';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function AuthColaboradores({ onLoginSucesso }) {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  
  // Campos de Autenticação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Campos da Tabela de Colaboradores
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  function validarCPF(cpfFormatado) {
    const cpfLimpo = cpfFormatado.replace(/\D/g, '');
    return cpfLimpo.length === 11;
  }

  function traduzirErroSupabase(mensagem) {
    if (!mensagem) return 'Erro ao processar a solicitação.';
    const msg = mensagem.toLowerCase();

    if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (msg.includes('email not confirmed')) return 'Por favor, confirme seu e-mail para continuar.';
    if (msg.includes('user not found')) return 'Usuário não encontrado.';
    if (msg.includes('at least 6 characters')) return 'A senha deve ter no mínimo 6 caracteres.';
    if (msg.includes('already registered') || msg.includes('already exists')) return 'Este e-mail já está cadastrado.';
    
    return mensagem;
  }

  async function handleEsqueciSenha(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (!email.trim()) {
      setErroLocal('Informe o seu e-mail.');
      return;
    }

    try {
      showLoading('Enviando e-mail...');
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/resetar-senha`,
      });
      if (error) throw error;

      const msg = 'E-mail de recuperação enviado! Verifique sua caixa de entrada.';
      setMensagemSucesso(msg);
      toastSuccess(msg);
    } catch (error) {
      const msgErro = traduzirErroSupabase(error.message);
      setErroLocal(msgErro);
      toastError(msgErro);
    } finally {
      hideLoading();
    }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setMensagemSucesso('');
    setErroLocal('');

    if (modoCadastro) {
      if (!nome.trim()) {
        toastError('Preencha o nome completo');
        return;
      }
      if (!cpf.trim() || !validarCPF(cpf)) {
        toastError('CPF inválido ou incompleto');
        return;
      }
      if (!telefone.trim() || telefone.length < 14) {
        toastError('Telefone inválido');
        return;
      }
      if (senha.length < 6) {
        toastError('A senha deve conter pelo menos 6 caracteres.');
        return;
      }
    }

    try {
      showLoading(modoCadastro ? 'Criando conta...' : 'Entrando...');

      if (modoCadastro) {
        // 1. Verificar se o CPF já existe na tabela colaboradores antes de criar a auth
        const { data: cpfExistente } = await supabase
          .from('colaboradores')
          .select('id')
          .eq('cpf', cpf)
          .maybeSingle();

        if (cpfExistente) {
          hideLoading();
          toastError('Este CPF já está cadastrado no sistema.');
          return;
        }

        // 2. Criar utilizador no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: { nome: nome.trim() }
          }
        });

        if (authError) throw authError;

        if (authData?.user) {
          const userId = authData.user.id;

          // 3. Inserir na tabela UNIFICADA `colaboradores`
          const { error: colabError } = await supabase
            .from('colaboradores')
            .insert([
              {
                id: userId,
                nome_completo: nome.trim(),
                cpf: cpf,
                telefone: telefone,
                email: email.trim(),
                data_nascimento: dataNascimento || null
              }
            ]);

          if (colabError) {
            console.error('Erro ao inserir colaborador:', colabError);
            throw new Error('Erro ao salvar os dados cadastrais do colaborador.');
          }

          // 4. BLINDAGEM DE PERFIL: Forçar explicitamente o role para 'colaborador' (nunca admin)
          const { error: profileError } = await supabase.from('profiles').upsert([
            { 
              id: userId, 
              email: email.trim(), 
              nome: nome.trim(), 
              role: 'colaborador' // Garantia estrita de que é colaborador comum
            }
          ]);

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
          }

          toastSuccess('Conta e cadastro criados com sucesso!');
          if (onLoginSucesso && authData.session) onLoginSucesso(authData.session);

          setTimeout(() => {
            navigate('/area-colaborador');
          }, 1500);
        }

      } else {
        // LOGIN DE COLABORADOR
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

        if (error) throw error;

        // VALIDAÇÃO DE SEGURANÇA: Verificar rigorosamente o perfil na base de dados
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile) {
          await supabase.auth.signOut();
          throw new Error('Erro ao verificar permissões de acesso do usuário.');
        }

        // Se por acaso a conta for admin, proíbe a entrada por aqui
        if (profile.role === 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Administradores devem usar o painel administrativo.');
        }

        // Garante que apenas quem tem role 'colaborador' prossegue
        if (profile.role !== 'colaborador') {
          await supabase.auth.signOut();
          throw new Error('Acesso restrito a colaboradores.');
        }

        toastSuccess('Login realizado com sucesso!');
        if (onLoginSucesso) onLoginSucesso(data.session);
        navigate('/area-colaborador');
      }

    } catch (error) {
      console.error('Erro na autenticação:', error);
      const msgErro = traduzirErroSupabase(error.message);
      setErroLocal(msgErro);
      toastError(msgErro);
    } finally {
      hideLoading();
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
            ? 'Preencha seus dados para criar sua conta de colaborador.'
            : 'Informe seu e-mail e senha para acessar o portal.'}
        </S.Subtitulo>

        {mensagemSucesso && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '14px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
            {mensagemSucesso}
          </div>
        )}

        {erroLocal && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '14px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            {erroLocal}
          </div>
        )}

        {modoEsqueciSenha ? (
          <S.Formulario onSubmit={handleEsqueciSenha}>
            <div>
              <S.Label>E-mail Cadastrado</S.Label>
              <S.Input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <S.Botao type="submit">Enviar link de redefinição</S.Botao>
            <S.AcoesSecundarias>
              <S.BotaoLink type="button" onClick={() => { setModoEsqueciSenha(false); setErroLocal(''); }}>
                ‹ Voltar para o login
              </S.BotaoLink>
            </S.AcoesSecundarias>
          </S.Formulario>
        ) : (
          <S.Formulario onSubmit={handleAuth}>
            {modoCadastro && (
              <>
                <div>
                  <S.Label>Nome Completo</S.Label>
                  <S.Input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div>
                  <S.Label>CPF</S.Label>
                  <S.Input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                  />
                </div>

                <div>
                  <S.Label>Telefone</S.Label>
                  <S.Input
                    type="text"
                    required
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    value={telefone}
                    onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                  />
                </div>

                <div>
                  <S.Label>Data de Nascimento (opcional)</S.Label>
                  <S.Input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <S.Label>E-mail</S.Label>
              <S.Input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <S.Label>Senha</S.Label>
              <S.Input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <S.Botao type="submit">
              {modoCadastro ? 'Concluir Cadastro' : 'Entrar'}
            </S.Botao>

            <S.AcoesSecundarias>
              <S.BotaoLink
                type="button"
                onClick={() => {
                  setModoCadastro(!modoCadastro);
                  setErroLocal('');
                }}
              >
                {modoCadastro ? '‹ Já tem conta? Faça login' : 'Criar nova conta de colaborador'}
              </S.BotaoLink>

              {!modoCadastro && (
                <S.BotaoLink
                  type="button"
                  onClick={() => { setModoEsqueciSenha(true); setErroLocal(''); }}
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