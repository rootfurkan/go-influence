import React, { useState } from "react";
import { Mail, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "brand-collab",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ collapse state
  const [faqOpen, setFaqOpen] = useState({
    0: false,
    1: false,
    2: false,
    3: false
  });

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "brand-collab",
        message: ""
      });
    }, 1500);
  };

  const faqs = [
    {
      q: "Platforma üye olmak ücretli mi?",
      a: "Hayır, platformumuza hem marka hem de içerik üreticisi (kreatif) olarak üye olmak tamamen ücretsizdir. Markalar dilerse daha gelişmiş filtreleme ve raporlama araçları için ücretli aylık üyelik planlarımıza geçiş yapabilir."
    },
    {
      q: "Ödemeler ne kadar güvende?",
      a: "Son derece güvende! Escrow (güvenli havuz) sistemimiz sayesinde, markanın bütçesi içerik onaylanana kadar güvence altında tutulur. İçerik anlaşılan kurallara göre yayınlandığında ise otomatik olarak kreatife aktarılır."
    },
    {
      q: "Sözleşmeler ve telif hakları nasıl yönetiliyor?",
      a: "Platformumuzda hukuk ekibimiz tarafından titizlikle hazırlanmış standart sözleşme taslakları bulunur. Kampanya başladığında bu sözleşme otomatik olarak oluşturulur ve her iki tarafı da yasal olarak güvence altına alır."
    },
    {
      q: "Etkileşim verileri gerçekçi mi?",
      a: "Evet. Tüm kitle demografisi, lokasyon dağılımı ve etkileşim oranları doğrudan Instagram, YouTube ve TikTok resmi API bağlantıları üzerinden çekilmektedir. Sahte takipçi veya şişirilmiş istatistikler tespit edildiğinde profiller engellenir."
    }
  ];

  return (
    <div className="pt-20 bg-surface text-on-surface">
      
      {/* Page Header */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-[1280px] mx-auto text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(176,38,255,0.06)_0%,transparent_50%)] -z-10" />
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase">İLETİŞİM</span>
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-on-surface">
            Bizimle Bağlantı Kurun
          </h1>
          <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto">
            Aklınıza takılan soruları yanıtlamak, platform demosu sunmak veya ortaklık fikirlerini görüşmek için buradayız. Formu doldurmanız yeterli.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="px-6 md:px-16 pb-24 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-[32px] border border-outline-variant/60 shadow-sm text-left">
            <h3 className="font-sans font-bold text-xl md:text-2xl mb-2 text-on-surface">Bize Mesaj Gönderin</h3>
            <p className="font-sans text-sm text-on-surface-variant mb-8">En geç 24 saat içinde kayıtlı e-posta adresiniz üzerinden geri dönüş sağlıyoruz.</p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-sans font-bold text-xl text-emerald-900">Mesajınız Başarıyla İletildi!</h4>
                <p className="font-sans text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Bizimle iletişime geçtiğiniz için teşekkür ederiz. Destek ekibimiz mesajınızı inceleyip en kısa süre içerisinde size dönüş yapacaktır.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-primary text-white font-sans font-semibold px-6 py-2.5 rounded-full text-sm hover:scale-105 transition-all cursor-pointer mt-2"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider">Adınız Soyadınız *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Örn: Selin Yılmaz"
                      className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-3.5 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider">E-Posta Adresiniz *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Örn: selin@ornek.com"
                      className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-3.5 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider">Mesaj Konusu</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-3.5 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="brand-collab">Marka İş Birliği & Kampanyalar</option>
                    <option value="influencer-support">Kreatif / Influencer Desteği</option>
                    <option value="billing">Ödeme ve Cüzdan İşlemleri</option>
                    <option value="investment">Yatırım ve İş Ortaklığı</option>
                    <option value="other">Diğer Soru ve Öneriler</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider">Mesajınız *</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Lütfen mesajınızı detaylıca buraya yazın..."
                    className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-3.5 text-sm font-sans focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white font-sans font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact info cards + Collapsible FAQs */}
          <div className="lg:col-span-5 space-y-12 text-left">
            {/* Quick Contact Info Cards */}
            <div className="space-y-6">
              <h3 className="font-sans font-bold text-xl text-on-surface">İletişim Bilgilerimiz</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-sm text-on-surface">Merkez Ofis</h4>
                    <p className="font-sans text-xs md:text-sm text-on-surface-variant">Kolektif House Levent, Büyükdere Cad. No:199, Levent, İstanbul</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-sm text-on-surface">E-Posta & Sosyal Medya</h4>
                    <p className="font-sans text-xs md:text-sm text-on-surface-variant">destek@influencermatch.com</p>
                    <p className="font-sans text-xs text-primary font-semibold">@influencermatchtr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible FAQ Accordion */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-bold text-xl text-on-surface">Sıkça Sorulan Sorular</h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = faqOpen[index];
                  return (
                    <div 
                      key={index}
                      className="bg-white border border-outline-variant/60 rounded-xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="w-full p-4 flex items-center justify-between text-left font-sans font-bold text-sm md:text-base text-on-surface hover:bg-surface/50 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-on-surface-variant" />}
                      </button>
                      
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-surface-container-low animate-in slide-in-from-top-2 duration-200">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

