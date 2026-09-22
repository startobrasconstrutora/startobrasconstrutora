import * as S from './Add.styles.jsx'
import { useState, useRef } from 'react'

import heroImg from "../assets/img/capacete.png"
import AddObras from './Addobras.jsx'
import AdmObras from './admobras.jsx'
import AddMateria from './AddMateria.jsx'
import AdmMaterias from './AdmMaterias.jsx'
import AddObraConcluida from './AddObrasConcluidas.jsx'
import AdmObrasConcluidas from './AdmObrasConcluidas.jsx'
import AddColaboradores from './AddColaboradores.jsx'
import AdmColaboradores from './AdmColaboradores.jsx'
import AddServicos from './AddServicos.jsx'
import AdmServicos from './AdmServicos.jsx'

function Add() {
  const [tela, setTela] = useState('')
  
  // Criamos a referência para a seção de conteúdo
  const conteudoRef = useRef(null)

  // Função auxiliar para mudar a tela e fazer o scroll suave
  function mudarTela(novaTela) {
    setTela(novaTela)
    // Pequeno timeout para garantir que o DOM já atualizou antes de rolar
    setTimeout(() => {
      conteudoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function renderTela() {
    switch (tela) {
      case 'adicionar-obra':
        return <AddObras />
      case 'gerenciar-obra':
        return <AdmObras />
      case 'adicionar-obra-concluida':
        return <AddObraConcluida />
      case 'gerenciar-obra-concluida':
        return <AdmObrasConcluidas />
      case 'adicionar-materia':
        return <AddMateria />
      case 'gerenciar-materia':
        return <AdmMaterias />
      case 'adicionar-colaborador':
        return <AddColaboradores />
      case 'gerenciar-colaborador':
        return <AdmColaboradores />
      case 'adicionar-servico':
        return <AddServicos />
      case 'gerenciar-servicos':
        return <AdmServicos />
      default:
        return null
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

      <S.IntroSection>
        <S.IntroContent>
          <p>
            Gerencie por aqui o conteúdo do site de forma prática e centralizada. 
            Utilize as opções abaixo para cadastrar e atualizar o portfólio de obras 
            com imagens e descrições detalhadas, ou para publicar e administrar as 
            matérias e novidades. Gerencie também seus colaboradores e equipes. 
            Isso garante que nosso canal esteja sempre atualizado 
            e ofereça uma visão completa de nossos projetos e conteúdos aos visitantes.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.ToggleWrapper>
        <S.ToggleGroup>
          <S.ToggleGroupTitle>Obras</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Cadastre novas obras no portfólio ou gerencie as obras já publicadas
            (editar, excluir, reordenar fotos).
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'adicionar-obra'}
              disabled={tela === 'adicionar-obra'}
              onClick={() => mudarTela('adicionar-obra')}
            >
              ➕ ADICIONAR OBRA
            </S.ToggleButton>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'gerenciar-obra'}
              disabled={tela === 'gerenciar-obra'}
              onClick={() => mudarTela('gerenciar-obra')}
            >
              🛠️ GERENCIAR OBRAS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleDivider />

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Obras Concluídas</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Cadastre obras já finalizadas para o portfólio de concluídas ou
            gerencie as que já estão publicadas.
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'adicionar-obra-concluida'}
              disabled={tela === 'adicionar-obra-concluida'}
              onClick={() => mudarTela('adicionar-obra-concluida')}
            >
              ➕ ADICIONAR CONCLUÍDA
            </S.ToggleButton>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'gerenciar-obra-concluida'}
              disabled={tela === 'gerenciar-obra-concluida'}
              onClick={() => mudarTela('gerenciar-obra-concluida')}
            >
              🛠️ GERENCIAR CONCLUÍDAS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleDivider />

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Matérias</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Publique novas matérias e novidades no canal ou gerencie o conteúdo
            já publicado.
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'adicionar-materia'}
              disabled={tela === 'adicionar-materia'}
              onClick={() => mudarTela('adicionar-materia')}
            >
              📰 ADICIONAR MATÉRIA
            </S.ToggleButton>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'gerenciar-materia'}
              disabled={tela === 'gerenciar-materia'}
              onClick={() => mudarTela('gerenciar-materia')}
            >
              🗂️ GERENCIAR MATÉRIAS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleDivider />

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Colaboradores</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Cadastre novos colaboradores na equipe ou gerencie os colaboradores
            já cadastrados (editar, excluir, gerenciar funções).
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'adicionar-colaborador'}
              disabled={tela === 'adicionar-colaborador'}
              onClick={() => mudarTela('adicionar-colaborador')}
            >
              👤 ADICIONAR COLABORADOR
            </S.ToggleButton>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'gerenciar-colaborador'}
              disabled={tela === 'gerenciar-colaborador'}
              onClick={() => mudarTela('gerenciar-colaborador')}
            >
              👥 GERENCIAR COLABORADORES
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>

        <S.ToggleDivider />

        <S.ToggleGroup>
          <S.ToggleGroupTitle>Serviços</S.ToggleGroupTitle>
          <S.ToggleGroupDesc>
            Registre os serviços realizados pelos colaboradores nas obras,
            com datas e valores (diária e total).
          </S.ToggleGroupDesc>
          <S.ToggleGroupButtons>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'adicionar-servico'}
              disabled={tela === 'adicionar-servico'}
              onClick={() => mudarTela('adicionar-servico')}
            >
              ➕ REGISTRAR SERVIÇO
            </S.ToggleButton>
            <S.ToggleButton
              type="button"
              $ativo={tela === 'gerenciar-servicos'}
              disabled={tela === 'gerenciar-servicos'}
              onClick={() => mudarTela('gerenciar-servicos')}
            >
              📋 GERENCIAR SERVIÇOS
            </S.ToggleButton>
          </S.ToggleGroupButtons>
        </S.ToggleGroup>
      </S.ToggleWrapper>

      {/* Anexamos a ref aqui */}
      <S.DevSection ref={conteudoRef}>
        {renderTela()}
        <br />
        <br />
      </S.DevSection>
    </S.Page>
  )
}

export default Add