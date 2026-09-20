import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import * as S from './SwiperPrincipal.styles';

const PLACEHOLDER = 'https://placehold.co/800x400/aaaaaa/ffffff?text=Imagem';

const SwiperMod = ({ slides = [] }) => {
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
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        breakpoints={{
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        centeredSlides={true}
        loop={true}
        grabCursor={true}
        speed={800}
        navigation={true}
        autoplay={{
          delay: 4000, // Intervalo de 4 segundos entre as trocas
          disableOnInteraction: false, // Continua rodando mesmo após interação manual
          pauseOnMouseEnter: true, // Pausa o slide se passar o mouse por cima
        }}
      >
        {dadosSlides.map((slide, i) => (
          <SwiperSlide key={i}>
            <S.SlideBox>
              <img
                src={slide.src}
                alt={slide.titulo || `slide ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {(slide.titulo || slide.descricao) && (
                <S.TextoOverlay>
                  {slide.titulo && <S.Titulo>{slide.titulo}</S.Titulo>}
                  {slide.descricao && <S.Descricao>{slide.descricao}</S.Descricao>}
                </S.TextoOverlay>
              )}
            </S.SlideBox>
          </SwiperSlide>
        ))}
      </Swiper>
    </S.Container>
  );
};

export default SwiperMod;