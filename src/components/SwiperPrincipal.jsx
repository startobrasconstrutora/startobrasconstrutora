import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';
import 'swiper/css';
import * as S from './SwiperPrincipal.styles';

const BREAKPOINT_MOBILE = 768;
const PLACEHOLDER = 'https://placehold.co/800x400/aaaaaa/ffffff?text=Imagem';

const SwiperPrincipal = ({ slides = [] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= BREAKPOINT_MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= BREAKPOINT_MOBILE);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dadosSlides = slides.length > 0
    ? slides
    : [1, 2, 3, 4, 5].map((n) => ({
        src: PLACEHOLDER,
        titulo: `Slide ${n}`,
        descricao: 'Texto de exemplo',
      }));

  return (
    <S.Container>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        grabCursor={true}
        speed={800}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        {dadosSlides.map((slide, i) => {
          // Usa srcMobile se fornecido, senão gera automaticamente
          const srcMobile = slide.srcMobile || slide.src.replace(/(\.[^.]+)$/, 'mob$1');
          // Escolhe qual imagem usar baseado no tamanho da tela
          const imagemFinal = isMobile ? srcMobile : slide.src;
          
          return (
            <SwiperSlide key={i}>
              <S.SlideBox>
                <S.ImageContainer>
                  <img
                    src={imagemFinal}
                    alt={slide.titulo || `slide ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </S.ImageContainer>
                {(slide.titulo || slide.descricao) && (
                  <S.TextoOverlay>
                    {slide.titulo && <S.Titulo>{slide.titulo}</S.Titulo>}
                    {slide.descricao && <S.Descricao>{slide.descricao}</S.Descricao>}
                  </S.TextoOverlay>
                )}
              </S.SlideBox>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </S.Container>
  );
};

export default SwiperPrincipal;