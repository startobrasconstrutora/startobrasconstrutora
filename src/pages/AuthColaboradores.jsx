import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess, toastError, showLoading, hideLoading } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AuthColaboradores.styles';

export default function AuthColaboradores() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Função para aplicar a máscara de CPF (000.000.000-00) visualmente
  function aplicarMascaraCPF(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  }

  function handleCpfChange(e) {
    setCpf(aplicarMascaraCPF(e.target.value));
  }

  async function handleLoginColaborador(e) {
    e.preventDefault();
    setErroLocal('');

    if (!email.trim() || !cpf.trim()) {
      setErroLocal('Preencha o e-mail e o CPF.');
      return;
    }

    try {
      showLoading('A verificar dados...');

      // Limpa a formatação do CPF para comparar exatamente como está na base de dados
      const cpfLimpo = cpf.replace(/\D/g, '');

      // Consulta direta na tabela 'colaboradores'
      const { data: colaborador, error } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('email', email.trim())
        .eq('cpf', cpf) // Se na base de dados o CPF for guardado com máscara, usa 'cpf'. Se for sem máscara, usa 'cpfLimpo'.
        .maybeSingle();

      if (error) throw error;

      if (!colaborador) {
        // Tenta buscar ignorando a formatação do CPF caso ele esteja guardado limpo na base de dados
        const { data: colaboradorAlt, error: errorAlt } = await supabase
          .from('colaboradores')
          .select('*')
          .eq('email', email.trim())
          .eq('cpf', cpfLimpo)
          .maybeSingle();

        if (errorAlt || !colaboradorAlt) {
          throw new Error('E-mail ou CPF não encontrados. Verifique os dados informados.');
        }

        // Se encontrou com o CPF limpo, usa este
        sessionStorage.setItem('@ColaboradorLogado', JSON.stringify(colaboradorAlt));
      } else {
        sessionStorage.setItem('@ColaboradorLogado', JSON.stringify(colaborador));
      }

      hideLoading();
      toastSuccess('Acesso autorizado!');
      navigate('/area-colaborador');

    } catch (error) {
      hideLoading();
      console.error('Erro no login do colaborador:', error);
      const msg = error.message || 'Erro ao validar dados.';
      setErroLocal(msg);
      toastError(msg);
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
          Informe o seu e-mail e o seu CPF cadastrados para consultar as suas informações.
        </S.Subtitulo>

        {erroLocal && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '14px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            {erroLocal}
          </div>
        )}

        <S.Formulario onSubmit={handleLoginColaborador}>
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
            <S.Label>CPF</S.Label>
            <S.Input
              type="text"
              required
              maxLength={14}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
            />
          </div>

          <S.Botao type="submit">
            Entrar
          </S.Botao>
        </S.Formulario>
      </S.Container>
    </S.Pagina>
  );
}