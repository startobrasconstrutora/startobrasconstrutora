import * as S from './footer.styles.jsx'
import { Link } from 'react-router-dom'
import logo from '../assets/img/logob.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const Footer = ({ onFiltrar }) => {
  return (
    <S.Container>

      <S.LinhaHorizontal style={{ marginBottom: '10px' }} />

      <S.FooterEmbaixo>

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

            <p style={{ alignSelf: 'center' }}>Conheça nossas redes sociais:</p>

            <S.LinhaHorizontal />

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>


              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Visitar o Instagram da Start Obras" title="Nosso Instagram">
  <S.LogoSocial icon={faInstagram} />
</a>

<a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Visitar o Facebook da Start Obras" title="Nosso Facebook">
  <S.LogoSocial icon={faFacebook} />
</a>

       <a href="https://wa.me/5514997749710" target="_blank" rel="noopener noreferrer" aria-label="Conversar pelo WhatsApp da Start Obras" title="Entre em contato pelo nosso Whatsapp">
  <S.LogoSocial icon={faWhatsapp} />
</a>

            </div>

          </S.Social>

        </S.Endereco>

        <S.FooterLinks>

          <S.Mapasite>
            <S.FooterLabel>MENU</S.FooterLabel>

            <S.FooterMenu>
              <li>
                <Link to="/Add" title="Acessar painel administrativo">
                  PAINEL ADM
                </Link>
             
              </li>
            </S.FooterMenu>
          </S.Mapasite>

          <S.Mapasite>
            <S.FooterLabel>MARCAS</S.FooterLabel>

            <S.FooterMenu>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('link 1'); }}>Link</a></li>
            </S.FooterMenu>
          </S.Mapasite>

          <S.Mapasite>
            <S.FooterLabel>SERVIÇOS</S.FooterLabel>

            <S.FooterMenu>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('opcao'); }}>
                  OPCAO DO MENU
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onFiltrar?.('opcao'); }}>
                  OPCAO DO MENU
                </a>
              </li>
            </S.FooterMenu>
          </S.Mapasite>

        </S.FooterLinks>

      </S.FooterEmbaixo>

      <S.FooterCopy>
        © 2026 Start Obras — Todos os direitos reservados
      </S.FooterCopy>

    </S.Container>
  )
}

export default Footer