import { useRef, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useApi } from '../../contexts/ApiContext.jsx';

const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

const ProviderItem = ({ provider }) => {
    const { t, i18n } = useLanguage();
    const [translatedTitle, setTranslatedTitle] = useState(provider.title);

    useEffect(() => {
        const camelKey = toCamelCase(provider.title);
        const key = `providers.${camelKey}`;
        if (i18n.exists(key)) {
            setTranslatedTitle(t(key));
        } else {
            setTranslatedTitle(provider.title);
        }
    }, [provider.title, i18n, t]);

    return (
        <SwiperSlide key={provider.code || provider.id}>
            <div className="aspect-[3/2] rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:bg-white/10 group/item overflow-hidden relative">
                {provider.logo_b ? (
                    <img 
                        src={provider.logo_b.replace(/`/g, '').trim()} 
                        alt={translatedTitle}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const span = e.target.parentElement.querySelector('span');
                            if (span) span.style.display = 'block';
                        }}
                    />
                ) : null}
                <span 
                    className={`text-[10px] font-bold text-gray-400 group-hover/item:text-white text-center break-words leading-tight ${provider.logo_b ? 'hidden' : 'block'}`}
                >
                    {translatedTitle}
                </span>
            </div>
        </SwiperSlide>
    );
};

const providerPriority = (provider) => {
  const code = provider?.code || '';
  const title = (provider?.title || '').toLowerCase();
  const uniq = (provider?.uniq_name || '').toLowerCase();
  if (
    code === 'FERHUB_PGSOFT' ||
    title.includes('pgsoft') ||
    uniq.includes('pgsoft')
  ) {
    return 0;
  }
  if (
    code === 'FERHUB_EGT' ||
    title.includes('egt') ||
    uniq.includes('egt')
  ) {
    return 1;
  }
  return 2;
};

const ProvidersCarousel = () => {
  const { t } = useLanguage();
  const { pgOptions } = useApi();
  const providerSwiperRef = useRef(null);

  if (!pgOptions || !pgOptions.providers || pgOptions.providers.length === 0) {
    return null;
  }

  const providers = [...pgOptions.providers]
      .filter((p) => {
        const isActive = p.is_active === 1 || p.is_active === '1';
        return isActive;
      })
      .sort((a, b) => {
          const priorityA = providerPriority(a);
          const priorityB = providerPriority(b);
          if (priorityA !== priorityB) return priorityA - priorityB;
          return (a.sorder || 0) - (b.sorder || 0);
      });

  if (providers.length === 0) return null;

  return (
    <div className="w-full max-w-md px-4 mb-10 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--gold)]" />
          {t('landing.providers.title')}
        </h3>
      </div>
      
      <div className="relative group">
        <Swiper
            modules={[Navigation, FreeMode]}
            slidesPerView={3.5}
            spaceBetween={12}
            freeMode={true}
            grabCursor={true}
            onSwiper={(swiper) => (providerSwiperRef.current = swiper)}
            className="!overflow-visible"
        >
            {providers.map((provider) => (
                <ProviderItem key={provider.code || provider.id} provider={provider} />
            ))}
        </Swiper>
        
        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1a1c20] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a1c20] to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
};

export default ProvidersCarousel;
