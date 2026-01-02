
import React, { useState, useEffect } from 'react';
import { SiteConfig, Service, Booking, ViewMode, Article } from './types';
import { INITIAL_CONFIG, INITIAL_SERVICES } from './constants';
import { IconPhone, IconMail, IconMapPin, IconSettings } from './components/Icons';
import AdminDashboard from './components/AdminDashboard';
import BookingSection from './components/BookingSection';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('client');
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Updated storage key to v11 for new config structure
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('site_config_v11');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('site_services_v11');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('site_bookings_v11');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('site_config_v11', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('site_services_v11', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('site_bookings_v11', JSON.stringify(bookings));
  }, [bookings]);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const sendEmailNotification = async (booking: Booking) => {
    if (!config.emailNotificationsEnabled || !config.emailjsPublicKey) return;

    const serviceName = services.find(s => s.id === booking.serviceId)?.name || 'Neznámá služba';

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: config.emailjsServiceId,
          template_id: config.emailjsTemplateId,
          user_id: config.emailjsPublicKey,
          template_params: {
            customer_name: booking.customerName,
            customer_email: booking.email,
            customer_phone: booking.phone,
            service_name: serviceName,
            booking_date: booking.date,
            booking_time: booking.time,
            booking_note: booking.note || 'Bez poznámky',
            recipient_email: config.recipientEmail || config.contactEmail
          }
        })
      });

      if (!response.ok) {
        console.error('EmailJS Error:', await response.text());
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleAddBooking = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
      status: 'pending'
    };
    setBookings(prev => [booking, ...prev]);
    sendEmailNotification(booking);
  };

  const handleLogoDoubleClick = () => {
    if (viewMode === 'admin') {
      setViewMode('client');
    } else {
      setShowLogin(true);
      setPasswordInput('');
      setLoginError(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = config.adminPassword || 'admin';
    if (passwordInput === correctPassword) {
      setViewMode('admin');
      setShowLogin(false);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleEmergencyReset = () => {
    if (confirm("Opravdu chcete resetovat celý web do továrního nastavení? Všechny změny budou smazány.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const dynamicStyles = `
    :root {
      --primary: ${config.primaryColor};
      --accent: ${config.accentColor};
    }
    .text-primary { color: var(--primary); }
    .bg-primary { background-color: var(--primary); }
    .border-primary { border-color: var(--primary); }
    .bg-accent { background-color: var(--accent); }
    .text-accent { color: var(--accent); }
  `;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <style>{dynamicStyles}</style>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer select-none" onDoubleClick={handleLogoDoubleClick}>
              <div 
                style={{ backgroundColor: config.primaryColor }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-12 transition-transform shadow-lg overflow-hidden"
              >
                <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-black text-slate-800 tracking-tight">{config.siteName}</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('sluzby')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-wider">Služby</button>
              <button onClick={() => scrollToSection('aktuality')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-wider">Aktuality</button>
              <button onClick={() => scrollToSection('o-nas')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-wider">O nás</button>
              <button onClick={() => scrollToSection('kontakt')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors uppercase tracking-wider">Kontakt</button>
            </div>

            <button 
              onClick={() => scrollToSection('rezervace')}
              style={{ backgroundColor: config.primaryColor }}
              className="text-white px-6 py-3 rounded-2xl font-black shadow-xl transition-all active:scale-95 text-sm uppercase tracking-wider"
            >
              OBJEDNAT SE
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-24 bg-gradient-to-br from-white to-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-16 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">{config.heroTitle}</h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-medium">{config.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => scrollToSection('rezervace')} style={{ backgroundColor: config.primaryColor }} className="px-10 py-5 text-white rounded-2xl font-black text-lg text-center shadow-2xl transition-all">Rezervovat termín</button>
              <button onClick={() => scrollToSection('sluzby')} className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg text-center">Ceník služeb</button>
            </div>
          </div>
          <div className="md:w-1/2 relative group">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 aspect-[4/3]">
              <img src={config.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="sluzby" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">{config.servicesTitle}</h2>
          <p className="text-slate-500 mb-16 font-bold">{config.servicesSubtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
            {services.map(service => (
              <div key={service.id} className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <img src={service.imageUrl} alt={service.name} className="h-60 w-full object-cover" />
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{service.category}</span>
                    <span style={{ color: config.primaryColor }} className="font-black text-lg">{service.price}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">{service.name}</h3>
                  <p className="text-slate-500 mb-8 line-clamp-2">{service.description}</p>
                  <button onClick={() => scrollToSection('rezervace')} style={{ color: config.primaryColor }} className="font-black uppercase text-sm tracking-wider">Rezervovat →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="aktuality" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">{config.articlesTitle}</h2>
            <p className="text-slate-500 font-bold">{config.articlesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.articles.filter(a => a.published).map(article => (
              <div key={article.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                <img src={article.imageUrl} className="h-48 w-full object-cover" alt={article.title} />
                <div className="p-6">
                  <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{new Date(article.date).toLocaleDateString('cs-CZ')}</div>
                  <h3 className="text-xl font-black mb-3 text-slate-900">{article.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6">{article.content}</p>
                  <button style={{ color: config.primaryColor }} className="font-black text-xs uppercase tracking-widest">Číst více</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="o-nas" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-16 md:mb-0 pr-0 md:pr-20">
            <h2 className="text-4xl md:text-5xl font-black mb-8">{config.aboutTitle}</h2>
            <p className="text-slate-400 text-xl leading-relaxed mb-12 whitespace-pre-wrap">{config.aboutText}</p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            <img src={config.aboutImageUrl1} className="rounded-[2.5rem] h-80 w-full object-cover shadow-2xl" alt="1" />
            <img src={config.aboutImageUrl2} className="rounded-[2.5rem] h-80 w-full object-cover shadow-2xl mt-12" alt="2" />
          </div>
        </div>
      </section>

      <BookingSection services={services} config={config} onAddBooking={handleAddBooking} />

      {/* Footer */}
      <footer id="kontakt" className="bg-slate-50 pt-24 pb-12 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <img src={config.logoUrl} className="w-10 h-10 object-cover rounded-lg" alt="L" />
                <span className="text-xl font-black">{config.siteName}</span>
              </div>
              <p className="text-slate-500">{config.footerAboutText}</p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-8 uppercase text-xs tracking-widest">Kontakt</h4>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-center space-x-3"><IconPhone /><span className="font-bold">{config.contactPhone}</span></li>
                <li className="flex items-center space-x-3"><IconMail /><span className="font-bold">{config.contactEmail}</span></li>
                <li className="flex items-center space-x-3"><IconMapPin /><span className="font-bold">{config.contactAddress}</span></li>
              </ul>
            </div>
            <div className="flex space-x-4 items-end">
              <a href={config.facebookUrl} className="w-12 h-12 bg-white border rounded-2xl flex items-center justify-center font-black">f</a>
              <a href={config.instagramUrl} className="w-12 h-12 bg-white border rounded-2xl flex items-center justify-center font-black">i</a>
            </div>
          </div>
          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <div>© {new Date().getFullYear()} {config.siteName}</div>
            <div>{config.footerBottomText}</div>
          </div>
        </div>
      </footer>

      {/* Admin and Overlay elements remain same as before... */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className={`bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full transition-all ${loginError ? 'animate-shake' : ''}`}>
            <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">Vstup do adminu</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                autoFocus
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-mono text-center text-lg ${loginError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-primary'}`}
                placeholder="Zadejte heslo..."
              />
              {loginError && <p className="text-red-500 text-center text-xs font-bold">Chybné heslo!</p>}
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Zavřít</button>
                <button type="submit" style={{ backgroundColor: config.primaryColor }} className="flex-1 py-4 text-white rounded-2xl font-black shadow-lg">Vstoupit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'admin' && (
        <AdminDashboard 
          config={config} services={services} bookings={bookings}
          onUpdateConfig={setConfig} onUpdateServices={setServices} onUpdateBookings={setBookings}
          onClose={() => setViewMode('client')}
        />
      )}

      <button 
        onClick={handleLogoDoubleClick} 
        className="fixed bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur border rounded-2xl flex items-center justify-center text-slate-300 opacity-20 hover:opacity-100 transition-all z-50 shadow-2xl relative"
      >
        <IconSettings />
        {pendingCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
            {pendingCount}
          </span>
        )}
      </button>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        button { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default App;
