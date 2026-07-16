import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const REVIEW_ILLUSTRATION =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHE5H26aPVinS23h3kdnJ14KOi13k3kv6b4QA3Bc0xznwyhFnegeD2xd0L3SbXyLh1oNRLw8uJngGyYaXSk_Pdp8jJFIpZRM3-yjQ10nRveNwqeZU4cqkZRGwnqBlVF5wsaCMXKI3DOOZb1g_6nxMmJVOk50mytu45LhQPmNEvU97nm2isCv7ulwn46XBKiWVq7Z4lxWcSxcWmAaDU7TEt3TX3x_egmxaV9AuSMtAHU6IS_bBw3RIc';

export default function PendingApproval() {
  const artRef = useRef(null);
  const { profile } = useSelector((state) => state.auth);
  const status = profile?.status || 'pending';
  const content = getStatusContent(status);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!artRef.current) return;

      const x = (window.innerWidth / 2 - event.pageX) / 50;
      const y = (window.innerHeight / 2 - event.pageY) / 50;
      artRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen bg-background text-on-background font-sans flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="pending-pulse-layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-40" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary-fixed rounded-full blur-[100px] opacity-30" />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 px-5 md:px-16 py-4 md:py-6 min-h-0">
        <div className="max-w-xl w-full flex flex-col items-center text-center space-y-3 md:space-y-4">
          <div className="mb-2 md:mb-4">
            <span className="font-sans text-[28px] md:text-4xl leading-tight font-extrabold tracking-[-0.02em] text-primary">
              Go Influence
            </span>
          </div>

          <div className="relative w-full aspect-square max-w-[220px] md:max-w-[300px] flex items-center justify-center mb-3 md:mb-4">
            <div className="absolute inset-0 bg-secondary-container rounded-full opacity-20 scale-90 blur-2xl" />

            <div ref={artRef} className="pending-floating-art relative z-10 w-full h-full">
              <img
                className="w-full h-full object-contain"
                src={REVIEW_ILLUSTRATION}
                alt="Profil kartini inceleyen buyutec temali pastel 3D illüstrasyon"
              />
            </div>

            <div className="absolute -bottom-4 bg-tertiary-fixed px-6 py-2 rounded-full shadow-lg border-4 border-white flex items-center space-x-2 z-20">
              <span
                className="material-symbols-outlined text-on-tertiary-fixed text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                history
              </span>
              <span className="text-xs md:text-sm leading-5 tracking-[0.01em] font-semibold text-on-tertiary-fixed">
                {content.queueText}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] leading-9 md:text-[40px] md:leading-[48px] tracking-[-0.02em] font-extrabold text-primary">
              {content.title}
            </h1>
            <p className="text-sm md:text-base leading-6 font-medium text-on-surface-variant max-w-md mx-auto">
              {content.description}
            </p>
          </div>

          <div className="w-full max-w-sm flex flex-col space-y-2 pt-2 md:pt-3">
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden relative">
              <div className={`absolute top-0 left-0 h-full bg-primary-container rounded-full animate-pulse ${content.progressClass}`} />
            </div>
            <div className="flex justify-between text-xs md:text-sm leading-5 tracking-[0.01em] font-semibold text-outline">
              <span>Başvuru Alındı</span>
              <span className={content.reviewLabelClass}>İncelemede</span>
              <span className={content.completeLabelClass}>Tamamlandı</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3 md:space-y-4 w-full pt-2 md:pt-3">
            {status === 'approved' ? (
              <Link
                to="/influencer-panel"
                className="w-full bg-primary-container text-white text-lg md:text-xl leading-7 font-bold py-3.5 md:py-4 rounded-3xl flex items-center justify-center space-x-3 transition-all hover:scale-[1.01] active:scale-95"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Panele Git</span>
              </Link>
            ) : (
              <button
                className="w-full bg-surface-container-highest text-outline-variant text-lg md:text-xl leading-7 font-bold py-3.5 md:py-4 rounded-3xl cursor-not-allowed flex items-center justify-center space-x-3 transition-all"
                disabled
              >
                <span className="material-symbols-outlined">lock</span>
                <span>Panele Git</span>
              </button>
            )}

            <Link
              className="group inline-flex items-center justify-center space-x-2 text-primary text-lg md:text-xl leading-7 font-bold hover:scale-105 transition-transform duration-200 cursor-pointer active:scale-95"
              to="/influencer-profil-olustur"
            >
              <span className="material-symbols-outlined text-[24px]">edit</span>
              <span className="border-b-2 border-primary/20 group-hover:border-primary transition-colors">
                Profilini Düzenle
              </span>
            </Link>
          </div>

          <div className="pt-3 md:pt-4 flex items-center justify-center space-x-2 opacity-60">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="text-[10px] leading-5 tracking-widest font-semibold uppercase">
              Güvenli &amp; Doğrulanmış Süreç
            </span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-2 flex flex-col md:flex-row justify-between items-center px-5 md:px-16 space-y-1 md:space-y-0 text-on-surface-variant text-xs md:text-sm leading-5 tracking-[0.01em] font-semibold opacity-50 shrink-0">
        <p>© 2024 Go Influence. Tüm hakları saklıdır.</p>
        <div className="flex space-x-6">
          <a className="hover:text-primary transition-colors" href="#">
            Destek Al
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            SSS
          </a>
        </div>
      </footer>
    </div>
  );
}

function getStatusContent(status) {
  if (status === 'approved') {
    return {
      title: 'Profilin Onaylandı',
      description: 'Harika haber! Profilin onaylandı. Artık influencer paneline geçebilir ve marka fırsatlarını inceleyebilirsin.',
      queueText: 'Onaylandı',
      progressClass: 'w-full',
      reviewLabelClass: 'text-primary',
      completeLabelClass: 'text-primary',
    };
  }

  if (status === 'rejected') {
    return {
      title: 'Profilin İncelendi',
      description: 'Profilin şu an onaylanmadı. Gerekli düzenlemeleri yapıp tekrar değerlendirme için gönderebilirsin.',
      queueText: 'Düzenleme Gerekli',
      progressClass: 'w-[65%]',
      reviewLabelClass: 'text-primary',
      completeLabelClass: '',
    };
  }

  return {
    title: 'Profilin İnceleniyor',
    description: 'Ekibimiz profilini titizlikle inceliyor. Onaylandığında sana hem e-posta hem de bildirim yoluyla haber vereceğiz.',
    queueText: 'Kuyrukta: #142',
    progressClass: 'w-[65%]',
    reviewLabelClass: 'text-primary',
    completeLabelClass: '',
  };
}
