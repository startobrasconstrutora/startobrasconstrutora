import * as S from './Add.styles.jsx'

import heroImg from "../assets/img/capacete.png"
import AddObras from './Addobras.jsx'


function Add() {
  return (
    <S.Page>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={heroImg} alt="Obra Start Obras" />
        </S.HeroImage>
        <S.HeroBadge>ADICIONAR OBRA</S.HeroBadge>
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

<S.DevSection>
<AddObras />
<br />
<br />
</S.DevSection>
    </S.Page>
  )
}

export default Add