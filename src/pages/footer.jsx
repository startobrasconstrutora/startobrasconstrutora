import React from 'react'
import * as S from './footer.styles.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../assets/img/logob.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const navigate = useNavigate();

  // Função exclusiva para limpar a sessão ao ir para a Área do Colaborador
  const handleLogoffAreaColaborador = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    }
    navigate('/area-colaborador');
  };

  return (
    <S.Container>
      <S.FooterEmbaixo>
        {/* Endereço e Logótipo */}
        <S.Endereco>
          <S.LogoFooter>
            <Link to="/" aria-label="Voltar para a página inicial da Start Obras">
              <img src={logo} alt="Logo da Start Obras" title="Start Obras" />
            </Link>
          </S.LogoFooter>

          <p>
            Bauru – SP<br />
            Fone/WhatsApp:{' '}
            <a href="tel:+5514997749710" aria-label="Ligar para a Start Obras no número 14 99774-9710">
              (14) 99774-9710
            </a>
          </p>

          <S.Social>
            <p>Conheça nossas redes sociais:</p>
            <S.LinhaHorizontal />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar o Instagram da Start Obras"
                title="Nosso Instagram"
              >
                <S.LogoSocial icon={faInstagram} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar o Facebook da Start Obras"
                title="Nosso Facebook"
              >
                <S.LogoSocial icon={faFacebook} />
              </a>

              <a
                href="https://wa.me/5514997749710"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conversar pelo WhatsApp da Start Obras"
                title="Entre em contato pelo nosso Whatsapp"
              >
                <S.LogoSocial icon={faWhatsapp} />
              </a>
            </div>
          </S.Social>
        </S.Endereco>

        {/* Links do Rodapé */}
        <S.FooterLinks>
          {/* Navegação */}
          <S.Mapasite>
            <S.FooterLabel>NAVEGAÇÃO</S.FooterLabel>
            <S.FooterMenu>
              <li>
                <Link to="/" title="Ir para a Home">Home</Link>
              </li>
              <li>
                <Link to="/Quemsomos" title="Conheça nossa história">Quem Somos</Link>
              </li>
              <li>
                <Link to="/Contato" title="Fale conosco">Contato</Link>
              </li>
              <li>
                <Link to="/trabalheconosco" title="Faça parte do nosso time">Trabalhe Conosco</Link>
              </li>
              <li>
                <Link to="/consultaobra" title="Área de acompanhamento">Área do Cliente</Link>
              </li>
            </S.FooterMenu>
          </S.Mapasite>

          {/* Serviços */}
          <S.Mapasite>
            <S.FooterLabel>SERVIÇOS</S.FooterLabel>
            <S.FooterMenu>
              <li>
                <Link to="/servicos/construcao" title="Construção residencial e comercial">
                  Construção
                </Link>
              </li>
              <li>
                <Link to="/servicos/reformas" title="Reformas gerais">
                  Reformas
                </Link>
              </li>
              <li>
                <Link to="/servicos/regularizacao" title="Regularização de imóveis">
                  Regularização
                </Link>
              </li>
            </S.FooterMenu>
          </S.Mapasite>

          {/* Obras */}
          <S.Mapasite>
            <S.FooterLabel>OBRAS E IMÓVEIS</S.FooterLabel>
            <S.FooterMenu>
              <li>
                <Link to="/obras-andamento" title="Confira nossos projetos em andamento">
                  Obras em Andamento
                </Link>
              </li>
              <li>
                <Link to="/obras-concluidas" title="Confira nossos projetos entregues">
                  Obras Concluídas
                </Link>
              </li>
            </S.FooterMenu>
          </S.Mapasite>

          {/* Área Restrita */}
          <S.Mapasite>
            <S.FooterLabel>ÁREA RESTRITA</S.FooterLabel>
            <S.FooterMenu>
              <li>
                {/* Único link com logoff automático ao clicar */}
                <a href="/area-colaborador" onClick={handleLogoffAreaColaborador} title="Acesso direto à Área do Colaborador">
                  Área do Colaborador
                </a>
              </li>
              <li>
                <Link to="/Admin" title="Acessar painel administrativo">
                  Painel ADM
                </Link>
              </li>
            </S.FooterMenu>
          </S.Mapasite>
        </S.FooterLinks>
      </S.FooterEmbaixo>

      <S.FooterCopy>
        © {new Date().getFullYear()} Start Obras — Todos os direitos reservados
      </S.FooterCopy>
    </S.Container>
  )
}

export default Footer