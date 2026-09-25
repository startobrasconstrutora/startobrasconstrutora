import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import * as S from './AreaColaborador.styles.jsx';
import heroImg from "../assets/img/capacete.jpg";

export default function AreaColaborador() {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState(null);
  const [funcoes, setFuncoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const conteudoRef = useRef(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);

        // Recupera o colaborador guardado na sessão pelo login simples
        const dadosSalvos = sessionStorage.getItem('@ColaboradorLogado');
        
        if (!dadosSalvos) {
          navigate('/colaboradores');
          return;
        }

        const colabParsed = JSON.parse(dadosSalvos);
        setColaborador(colabParsed);

        // Buscar as funções associadas na tabela 'colaborador_funcoes'
        const { data: funcData, error: funcError } = await supabase
          .from('colaborador_funcoes')
          .select('funcao_id')
          .eq('colaborador_id', colabParsed.id);

        if (!funcError && funcData) {
          const mapaFuncoes = {
            1: 'Pedreiro',
            2: 'Servente',
            3: 'Pintor',
            4: 'Carpinteiro',
            5: 'Engenheiro',
            6: 'Arquiteto',
            7: 'Mestre de Obras',
            8: 'Técnico',
            9: 'Eletricista',
            10: 'Encanador',
            11: 'Outros'
          };

          const nomesFuncoes = funcData.map(f => mapaFuncoes[f.funcao_id] || 'Outros');
          setFuncoes(nomesFuncoes);
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem('@ColaboradorLogado');
    navigate('/colaboradores');
  }

  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>A carregar os seus dados...</div>;
  }

  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>PORTAL DO COLABORADOR</S.HeroBadge>
      </S.HeroWrapper>

      {/* Barra de identificação e ações da conta */}
      {colaborador && (
        <S.UserHeaderContainer>
          <S.UserHeaderBar>
            <S.UserInfo>
              <span className="label">Conectado como:</span>
              <span className="email">{colaborador.email || colaborador.nome_completo}</span>
            </S.UserInfo>

            <S.UserActions>
              <S.LogoutButton onClick={handleLogout}>
                🚪 TERMINAR SESSÃO
              </S.LogoutButton>
            </S.UserActions>
          </S.UserHeaderBar>
        </S.UserHeaderContainer>
      )}

      <S.IntroSection>
        <S.IntroContent>
          <p>
            Bem-vindo ao seu portal exclusivo. Aqui você pode acompanhar seus dados 
            cadastrais, funções atribuídas e informações relevantes da sua jornada 
            em nossa equipe de forma prática e centralizada.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.ToggleWrapper>
        <S.ToggleGroup style={{ gridColumn: '1 / -1' }}>
          <S.ToggleGroupTitle>Meus Dados Cadastrais</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Confira abaixo as informações registradas em seu perfil profissional.
          </S.ToggleGroupDesc>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>NOME COMPLETO:</strong>
              <span style={{ fontSize: '0.95rem', color: '#1e1e1e', fontWeight: '600' }}>{colaborador?.nome_completo}</span>
            </div>

            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>E-MAIL:</strong>
              <span style={{ fontSize: '0.95rem', color: '#1e1e1e', fontWeight: '600' }}>{colaborador?.email || 'Não informado'}</span>
            </div>

            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>CPF:</strong>
              <span style={{ fontSize: '0.95rem', color: '#1e1e1e', fontWeight: '600' }}>{colaborador?.cpf}</span>
            </div>

            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>TELEFONE:</strong>
              <span style={{ fontSize: '0.95rem', color: '#1e1e1e', fontWeight: '600' }}>{colaborador?.telefone}</span>
            </div>

            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>DATA DE NASCIMENTO:</strong>
              <span style={{ fontSize: '0.95rem', color: '#1e1e1e', fontWeight: '600' }}>
                {colaborador?.data_nascimento ? new Date(colaborador.data_nascimento).toLocaleDateString('pt-BR') : 'Não informada'}
              </span>
            </div>

            <div>
              <strong style={{ color: '#555', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>FUNÇÕES ATRIBUÍDAS:</strong>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {funcoes.length > 0 ? (
                  funcoes.map((func, index) => (
                    <span key={index} style={{ background: '#ffb83c', color: '#1e1e1e', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                      {func}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.95rem', color: '#1e1e1e' }}>Nenhuma função atribuída</span>
                )}
              </div>
            </div>
          </div>
        </S.ToggleGroup>
      </S.ToggleWrapper>

      <S.DevSection ref={conteudoRef}>
        <br />
        <br />
      </S.DevSection>
    </S.Page>
  );
}