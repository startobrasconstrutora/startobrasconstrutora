import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import * as S from './ResetarSenha.styles.jsx';
import heroImg from "../assets/img/capacete.jpg";

export default function ResetarSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  async function handleRedefinirSenha(e) {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toastError('As senhas não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      toastError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    showLoading('Atualizando senha do colaborador...');

    try {
      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (error) throw error;

      toastSuccess('Senha redefinida com sucesso!');
      navigate('/colaboradores');
    } catch (error) {
      toastError(error.message || 'Erro ao redefinir a senha.');
    } finally {
      hideLoading();
    }
  }

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>ÁREA DO COLABORADOR</S.HeroBadge>
      </S.HeroWrapper>

      <S.FormContainer>
        <S.FormTitle>Redefinir Senha</S.FormTitle>
        <S.FormDesc>
          Crie uma nova palavra-passe segura para a sua conta de colaborador na Start Obras.
        </S.FormDesc>

        <S.StyledForm onSubmit={handleRedefinirSenha} autoComplete="off">
          <S.InputGroup>
            <label>Nova Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={mostrarNovaSenha ? "text" : "password"} 
                required 
                minLength={6}
                autoComplete="new-password"
                data-lpignore="true"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
                style={{ width: '100%', paddingRight: '75px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
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
                {mostrarNovaSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </S.InputGroup>

          <S.InputGroup>
            <label>Confirme a Nova Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={mostrarConfirmarSenha ? "text" : "password"} 
                required 
                minLength={6}
                autoComplete="new-password"
                data-lpignore="true"
                placeholder="Repita a nova senha"
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
                style={{ width: '100%', paddingRight: '75px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
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
                {mostrarConfirmarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </S.InputGroup>

          <S.SubmitButton type="submit">
            Salvar Nova Senha
          </S.SubmitButton>
        </S.StyledForm>
      </S.FormContainer>
    </S.Page>
  );
}