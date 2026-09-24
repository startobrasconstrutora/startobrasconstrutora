import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './GerenciarAdmins.styles.jsx';

export default function GerenciarAdmins() {
  const [admins, setAdmins] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca a lista de administradores/perfis no Supabase
  async function carregarAdmins() {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin'); // Traz apenas quem tem a role admin

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Erro ao carregar administradores:', error);
      if (typeof toastError === 'function') toastError('Erro ao carregar lista de administradores.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAdmins();
  }, []);

  // Função para excluir/remover o acesso de administrador
  async function handleExcluirAdmin(idUsuario, emailUsuario) {
    const confirmou = window.confirm(`Tem certeza que deseja remover os privilégios de administrador de ${emailUsuario}?`);
    if (!confirmou) return;

    try {
      if (typeof showLoading === 'function') showLoading('Removendo administrador...');

      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' }) // Rebaixa para usuário comum
        .eq('id', idUsuario);

      if (error) throw error;

      if (typeof toastSuccess === 'function') toastSuccess('Administrador removido com sucesso!');
      
      // Atualiza a lista na tela
      carregarAdmins();
    } catch (error) {
      console.error('Erro ao excluir admin:', error);
      if (typeof toastError === 'function') toastError('Erro ao remover administrador.');
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
  }

  if (carregando) {
    return <S.LoadingText>Carregando lista de administradores...</S.LoadingText>;
  }

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>PAINEL ADM</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        <S.Title>Gerenciar Administradores do Sistema</S.Title>

        {admins.length === 0 ? (
          <S.EmptyMessage>Nenhum administrador encontrado.</S.EmptyMessage>
        ) : (
          <S.AdminsList>
            {admins.map((admin) => (
              <S.AdminCard key={admin.id}>
                <S.AdminInfo>
                  <p className="name">{admin.nome || 'Nome não informado'}</p>
                  <p className="email">{admin.email || `ID: ${admin.id}`}</p>
                </S.AdminInfo>

                <S.RemoveButton onClick={() => handleExcluirAdmin(admin.id, admin.email || admin.nome)}>
                  🗑️ REMOVER ACESSO
                </S.RemoveButton>
              </S.AdminCard>
            ))}
          </S.AdminsList>
        )}
      </S.Container>
    </S.Page>
  );
}