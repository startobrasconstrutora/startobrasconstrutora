import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toastSuccess } from '../utils/alert';
import heroImg from "../assets/img/capacete.jpg";
import * as S from './AreaColaborador.styles';

export default function AreaColaborador({ usuario: usuarioProp, onSair }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(usuarioProp || null);
  const [moduloAtivo, setModuloAtivo] = useState('');
  const conteudoRef = useRef(null);

  // Busca a sessão/usuário do Supabase caso não tenha vindo via props
  useEffect(() => {
    async function carregarUsuario() {
      if (!usuarioProp) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUsuario(session.user);
        } else {
          // Se não houver sessão ativa, redireciona para a página de login
          navigate('/colaboradores');
        }
      } else {
        setUsuario(usuarioProp);
      }
    }
    carregarUsuario();
  }, [usuarioProp, navigate]);

  // Extrai o nome do user_metadata do Supabase ou usa a primeira parte do e-mail
  const nomeUsuario = 
    usuario?.user_metadata?.nome || 
    usuario?.user_metadata?.full_name || 
    (usuario?.email ? usuario.email.split('@')[0] : 'Colaborador');

  const inicial = nomeUsuario.charAt(0).toUpperCase();

  async function handleLogout() {
    await supabase.auth.signOut();
    toastSuccess('Sessão encerrada com sucesso!');
    if (onSair) onSair();
    navigate('/colaboradores');
  }

  function handleAcaoModulo(moduloKey, acao) {
    setModuloAtivo(moduloKey);
    if (acao) {
      acao();
    } else {
      setTimeout(() => {
        conteudoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  return (
    <S.Page>
      {/* Topo Hero com Capa do Capacete */}
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Área do Colaborador Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>ÁREA DO COLABORADOR</S.HeroBadge>
      </S.HeroWrapper>

      {/* Identificação do Usuário e Descrição */}
      <S.IntroSection>
        <S.IntroContent>
          <S.UserBar>
            <S.UserInfo>
              <div className="avatar">{inicial}</div>
              <div className="detalhes">
                <strong>{nomeUsuario}</strong>
                <span>{usuario?.email || 'Carregando e-mail...'}</span>
              </div>
            </S.UserInfo>

            <S.BotaoSair onClick={handleLogout}>
              Sair da Conta
            </S.BotaoSair>
          </S.UserBar>

          <S.IntroText>
            Bem-vindo ao portal interno da Start Obras. Utilize as seções abaixo para acessar o 
            módulo de gestão de obras, consultar documentações e manter-se informado através do mural interno.
          </S.IntroText>
        </S.IntroContent>
      </S.IntroSection>

      {/* Grid de Módulos / Ferramentas */}
      <S.ToggleWrapper>
        <S.ToggleGroup>
          <S.ToggleGroupTitle>Gestão de Obras</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Acesse o painel administrativo para acompanhar e gerenciar o andamento das obras, fotos e registros.
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={moduloAtivo === 'gestao-obras'}
              onClick={() => handleAcaoModulo('gestao-obras', () => navigate('/Admobras'))}
            >
              🏗️ ACESSAR PAINEL DE OBRAS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Documentos & Moldes</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Consulte modelos de contratos, arquivos padrão e procedimentos internos de segurança do trabalho.
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={moduloAtivo === 'documentos'}
              onClick={() => handleAcaoModulo('documentos', () => alert('Módulo de documentos em breve!'))}
            >
              📁 VER DOCUMENTOS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Suporte Interno</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Entre em contato direto com a equipe de TI ou Engenharia para suporte no sistema e solicitações.
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={moduloAtivo === 'suporte'}
              onClick={() => handleAcaoModulo('suporte', () => alert('Abertura de chamados em breve!'))}
            >
              💬 ABRIR CHAMADO
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>
      </S.ToggleWrapper>

      <S.DevSection ref={conteudoRef} />

      {/* Mural de Avisos Internos */}
      <S.SecaoAvisos>
        <S.AvisosCard>
          <h2>📢 Mural de Avisos Internos</h2>

          <S.ItemAviso>
            <div className="data">HOJE</div>
            <div className="texto">
              Lembrete: Atualizem os relatórios fotográficos das obras em andamento até sexta-feira.
            </div>
          </S.ItemAviso>

          <S.ItemAviso>
            <div className="data">ONTEM</div>
            <div className="texto">
              Treinamento de EPIs para equipes de campo agendado para o início da próxima semana.
            </div>
          </S.ItemAviso>
        </S.AvisosCard>
      </S.SecaoAvisos>

      <br />
      <br />
    </S.Page>
  );
}