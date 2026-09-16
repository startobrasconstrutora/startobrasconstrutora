import * as S from './Add.styles.jsx'
import { useState } from 'react'

import heroImg from "../assets/img/capacete.png"
import AddObras from './Addobras.jsx'
import AdmObras from './admobras.jsx'

function Add() {
  const [tela, setTela] = useState('gerenciar') // 'adicionar' | 'gerenciar'

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
            Adicione aqui as obras que você deseja exibir em nosso site. Preencha os campos necessários com informações precisas e relevantes sobre cada obra, 
            incluindo imagens, descrições detalhadas e quaisquer outros detalhes importantes. Isso nos ajudará a manter nosso portfólio atualizado e a 
            fornecer aos visitantes uma visão completa de nossos projetos.
          </p>
        </S.IntroContent>
      </S.IntroSection>

      <S.ToggleWrapper>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'adicionar'}
          disabled={tela === 'adicionar'}
          onClick={() => setTela('adicionar')}
        >
          ➕ ADICIONAR OBRA
        </S.ToggleButton>
        <S.ToggleButton
          type="button"
          $ativo={tela === 'gerenciar'}
          disabled={tela === 'gerenciar'}
          onClick={() => setTela('gerenciar')}
        >
          🛠️ GERENCIAR OBRAS
        </S.ToggleButton>
      </S.ToggleWrapper>

      <S.DevSection>
        {tela === 'adicionar' ? <AddObras /> : <AdmObras />}
        <br />
        <br />
      </S.DevSection>
    </S.Page>
  )
}

export default Add