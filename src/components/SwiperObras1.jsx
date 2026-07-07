import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import * as S from './SwiperObras.styles1.jsx'

function SwiperObras({ obras }) {
  return (
    <S.Wrapper>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        loop={true}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {obras.map((obra, index) => (
          <SwiperSlide key={index}>
            <S.Card>
              <S.CardImg>
                <img src={obra.src} alt={obra.titulo || 'Obra concluída'} />
              </S.CardImg>
              {obra.titulo && (
                <S.CardLegenda>{obra.titulo}</S.CardLegenda>
              )}
            </S.Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </S.Wrapper>
  )
}

export default SwiperObras