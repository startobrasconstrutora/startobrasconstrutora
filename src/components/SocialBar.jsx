import * as S from './styles.jsx'

function SocialBar() {
  return (
    <S.SocialBar>
      <S.SocialLink
        className="facebook"
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="https://cdn.simpleicons.org/facebook/white" alt="Facebook" />
      </S.SocialLink>

      <S.SocialLink
        className="instagram"
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="https://cdn.simpleicons.org/instagram/white" alt="Instagram" />
      </S.SocialLink>

      <S.SocialLink
        className="whatsapp"
        href="https://wa.me/5514997749710"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="https://cdn.simpleicons.org/whatsapp/white" alt="WhatsApp" />
      </S.SocialLink>
    </S.SocialBar>
  )
}

export default SocialBar