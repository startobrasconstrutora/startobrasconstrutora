import * as S from './Add.styles.jsx'
import { useState } from 'react'

import heroImg from "../assets/img/capacete.png"
import AddObras from './Addobras.jsx'
import AdmObras from './admobras.jsx'
import AddMateria from './AddMateria.jsx'
import AdmMaterias from './AdmMaterias.jsx'

function Add() {
  const [tela, setTela] = useState('gerenciar-obra')
  // 'adicionar-obra' | 'gerenciar-obra' | 'adicionar-materia' | 'gerenciar-materia'

  function renderTela() {
    switch (tela) {
      case 'adicionar-obra':
        return <AddObras />
      case 'gerenciar-obra':
        return <AdmObras />
      case 'adicionar-materia':
        return <AddMateria />
      case 'gerenciar-materia':
        return <AdmMaterias />
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
            matérias e novidades. Isso garante que nosso canal esteja sempre atualizado 
            e ofereça uma visão completa de nossos projetos e conteúdos aos visitantes.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.ToggleWrapper>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'adicionar-obra'}
          disabled={tela === 'adicionar-obra'}
          onClick={() => setTela('adicionar-obra')}
        >
          ➕ ADICIONAR OBRA
        </S.ToggleButton>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'gerenciar-obra'}
          disabled={tela === 'gerenciar-obra'}
          onClick={() => setTela('gerenciar-obra')}
        >
          🛠️ GERENCIAR OBRAS
        </S.ToggleButton>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'adicionar-materia'}
          disabled={tela === 'adicionar-materia'}
          onClick={() => setTela('adicionar-materia')}
        >
          📰 ADICIONAR MATÉRIA
        </S.ToggleButton>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'gerenciar-materia'}
          disabled={tela === 'gerenciar-materia'}
          onClick={() => setTela('gerenciar-materia')}
        >
          🗂️ GERENCIAR MATÉRIAS
        </S.ToggleButton>
      </S.ToggleWrapper>

      <S.DevSection>
        {renderTela()}
        <br />
        <br />
      </S.DevSection>
    </S.Page>
  )
}

export default Add