import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerSlider = () => {
  const banners = [
    '/assets/banner-actThroughtDZ.webp',
    '/assets/banner-yessc2.webp',
  ];

  return (
    <div className="w-full max-w-md px-4 mt-2 mb-6 relative z-10">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-video">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-[var(--gold)] !w-6 !rounded-full',
              bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-1.5 !h-1.5 !opacity-100 transition-all duration-300'
          }}
          className="w-full h-full"
        >
          {banners.map((src, idx) => (
            <SwiperSlide key={src}>
              <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                  {/* Blurred Background for Ambiance */}
                  <div className="absolute inset-0 overflow-hidden">
                      <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
                      />
                  </div>
                  
                  {/* Main Image - Contained to fit perfectly */}
                  <img
                      src={src}
                      alt={`Golden Age banner ${idx + 1}`}
                      className="relative w-full h-full object-contain z-10"
                  />
                  
                  {/* Subtle Overlay for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerSlider;
