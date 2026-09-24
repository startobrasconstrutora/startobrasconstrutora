import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import * as S from './AdminResetarSenha.styles.jsx';
import heroImg from "../assets/img/capacete.jpg";

export default function AdminResetarSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
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

    showLoading('Atualizando senha do Administrador...');

    try {
      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (error) throw error;

      toastSuccess('Senha redefinida com sucesso!');
      navigate('/Add');
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
        <S.HeroBadge>PAINEL ADM</S.HeroBadge>
      </S.HeroWrapper>

      <S.FormContainer>
        <S.FormTitle>Redefinir Senha (ADM)</S.FormTitle>
        <S.FormDesc>
          Crie uma nova palavra-passe segura para a sua conta de administrador da Start Obras.
        </S.FormDesc>

        <S.StyledForm onSubmit={handleRedefinirSenha}>
          <S.InputGroup>
            <label>Nova Senha</label>
            <input 
              type="password" 
              required 
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              value={novaSenha} 
              onChange={(e) => setNovaSenha(e.target.value)} 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Confirme a Nova Senha</label>
            <input 
              type="password" 
              required 
              minLength={6}
              placeholder="Repita a nova senha"
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} 
            />
          </S.InputGroup>

          <S.SubmitButton type="submit">
            Salvar Nova Senha
          </S.SubmitButton>
        </S.StyledForm>
      </S.FormContainer>
    </S.Page>
  );
}