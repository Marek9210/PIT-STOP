
import React, { useState } from 'react';
import { SiteConfig, Service, Booking, Article } from '../types';
import { AIService } from '../services/geminiService';

interface AdminDashboardProps {
  config: SiteConfig;
  services: Service[];
  bookings: Booking[];
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onUpdateServices: (newServices: Service[]) => void;
  onUpdateBookings: (newBookings: Booking[]) => void;
  onClose: () => void;
}

const ai = new AIService();

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  services,
  bookings,
  onUpdateConfig,
  onUpdateServices,
  onUpdateBookings,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'services' | 'bookings' | 'availability' | 'emails' | 'articles'>('bookings');
  const [editingConfig, setEditingConfig] = useState(config);
  const [editingServices, setEditingServices] = useState(services);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const saveConfig = () => {
    onUpdateConfig(editingConfig);
    alert('Všechny změny byly uloženy!');
  };

  const handleBookingStatus = (id: string, status: Booking['status']) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    onUpdateBookings(updated);
  };

  const handleUpdateBooking = (id: string, updates: Partial<Booking>) => {
    const updated = bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    onUpdateBookings(updated);
    setEditingBookingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Article handlers
  const addArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: 'Nový článek',
      content: 'Zde zadejte obsah článku...',
      date: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600',
      published: true
    };
    setEditingConfig({...editingConfig, articles: [newArticle, ...editingConfig.articles]});
  };

  const updateArticle = (id: string, field: keyof Article, value: any) => {
    const updated = editingConfig.articles.map(a => a.id === id ? { ...a, [field]: value } : a);
    setEditingConfig({...editingConfig, articles: updated});
  };

  const deleteArticle = (id: string) => {
    if (confirm('Opravdu smazat tento článek?')) {
      setEditingConfig({...editingConfig, articles: editingConfig.articles.filter(a => a.id !== id)});
    }
  };

  const handleServiceChange = (id: string, field: keyof Service, value: string) => {
    const updated = editingServices.map(s => s.id === id ? { ...s, [field]: value } : s);
    setEditingServices(updated);
  };

  const deleteService = (id: string) => {
    if (confirm('Opravdu chcete tuto službu smazat?')) {
      setEditingServices(editingServices.filter(s => s.id !== id));
    }
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: 'Nová služba',
      description: 'Krátký popis...',
      price: '0 Kč',
      category: 'servis',
      imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600'
    };
    setEditingServices([...editingServices, newService]);
  };

  const ImageInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-lg bg-slate-100 border overflow-hidden flex-shrink-0">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL..." className="w-full p-2 text-xs border rounded-lg bg-slate-50" />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, onChange)} className="block w-full text-[10px] text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 cursor-pointer" />
        </div>
      </div>
    </div>
  );

  const daysLabels = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Administrace {config.siteName}</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Kompletní správa obsahu</p>
          </div>
          <button onClick={onClose} className="px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black transition-all shadow-xl active:scale-95">Zavřít a uložit vše</button>
        </div>

        <div className="flex space-x-8 mb-8 overflow-x-auto pb-2 border-b">
          {[
            { id: 'bookings', label: 'Rezervace', badge: pendingCount },
            { id: 'articles', label: 'Články / Aktuality' },
            { id: 'availability', label: 'Harmonogram' },
            { id: 'content', label: 'Texty a Obrázky' },
            { id: 'services', label: 'Ceník Služeb' },
            { id: 'emails', label: 'E-maily' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-2 font-black text-sm uppercase tracking-wider whitespace-nowrap border-b-2 flex items-center transition-all ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              {tab.label}
              {tab.badge ? <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-5 font-black text-slate-700 uppercase text-xs tracking-widest">Zákazník</th>
                  <th className="px-6 py-5 font-black text-slate-700 uppercase text-xs tracking-widest">Termín</th>
                  <th className="px-6 py-5 font-black text-slate-700 uppercase text-xs tracking-widest">Služba</th>
                  <th className="px-6 py-5 font-black text-slate-700 uppercase text-xs tracking-widest text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map(b => (
                  <tr key={b.id} className={`hover:bg-slate-50 ${b.status === 'pending' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="font-black text-slate-900">{b.customerName}</div>
                      <div className="text-xs text-slate-500 font-bold">{b.phone} | {b.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`font-black ${b.status === 'cancelled' ? 'line-through text-slate-400' : 'text-blue-600'}`}>{b.date}</div>
                      <div className="text-xs font-bold text-slate-500">{b.time}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-black">
                      {services.find(s => s.id === b.serviceId)?.name || 'Služba nenalezena'}
                      <div className="mt-1 flex gap-2">
                        {b.status === 'pending' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[9px] uppercase">Čeká</span>}
                        {b.status === 'confirmed' && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] uppercase">Potvrzeno</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleBookingStatus(b.id, 'confirmed')} className="px-3 py-2 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl">OK</button>
                        <button onClick={() => handleBookingStatus(b.id, 'cancelled')} className="px-3 py-2 bg-red-500 text-white text-[10px] font-black uppercase rounded-xl">X</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border">
              <h3 className="text-xl font-black">Správa Článků a Aktualit</h3>
              <button onClick={addArticle} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">+ Přidat článek</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {editingConfig.articles.map(article => (
                <div key={article.id} className="p-6 bg-white border rounded-3xl space-y-4 shadow-sm relative group">
                  <button onClick={() => deleteArticle(article.id)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-black">✕</button>
                  <ImageInput label="Obrázek článku" value={article.imageUrl} onChange={val => updateArticle(article.id, 'imageUrl', val)} />
                  <input type="text" value={article.title} onChange={e => updateArticle(article.id, 'title', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-black text-sm" placeholder="Název článku" />
                  <textarea rows={4} value={article.content} onChange={e => updateArticle(article.id, 'content', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-medium" placeholder="Obsah článku..." />
                  <div className="flex justify-between items-center">
                    <input type="date" value={article.date} onChange={e => updateArticle(article.id, 'date', e.target.value)} className="p-2 bg-slate-50 border rounded-lg text-[10px] font-black" />
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={article.published} onChange={e => updateArticle(article.id, 'published', e.target.checked)} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Publikovat</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveConfig} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl uppercase tracking-widest">Uložit Články</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-2">Branding & Hero</h3>
                <input type="text" value={editingConfig.siteName} onChange={e => setEditingConfig({...editingConfig, siteName: e.target.value})} className="w-full p-4 border rounded-2xl font-black" placeholder="Název webu" />
                <ImageInput label="Logo" value={editingConfig.logoUrl} onChange={val => setEditingConfig({...editingConfig, logoUrl: val})} />
                <ImageInput label="Hero Obrázek" value={editingConfig.heroImageUrl} onChange={val => setEditingConfig({...editingConfig, heroImageUrl: val})} />
                <input type="text" value={editingConfig.heroTitle} onChange={e => setEditingConfig({...editingConfig, heroTitle: e.target.value})} className="w-full p-4 border rounded-2xl font-black" placeholder="Hero Nadpis" />
                <textarea rows={3} value={editingConfig.heroSubtitle} onChange={e => setEditingConfig({...editingConfig, heroSubtitle: e.target.value})} className="w-full p-4 border rounded-2xl font-medium" placeholder="Hero Podnadpis" />
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-2">Sekce O nás</h3>
                <input type="text" value={editingConfig.aboutTitle} onChange={e => setEditingConfig({...editingConfig, aboutTitle: e.target.value})} className="w-full p-4 border rounded-2xl font-black" />
                <textarea rows={6} value={editingConfig.aboutText} onChange={e => setEditingConfig({...editingConfig, aboutText: e.target.value})} className="w-full p-4 border rounded-2xl font-medium leading-relaxed" />
                <div className="grid grid-cols-2 gap-4">
                  <ImageInput label="Obrázek 1" value={editingConfig.aboutImageUrl1} onChange={val => setEditingConfig({...editingConfig, aboutImageUrl1: val})} />
                  <ImageInput label="Obrázek 2" value={editingConfig.aboutImageUrl2} onChange={val => setEditingConfig({...editingConfig, aboutImageUrl2: val})} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-2">Nadpisy Sekcí</h3>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Služby (Nadpis / Podnadpis)</label>
                  <input type="text" value={editingConfig.servicesTitle} onChange={e => setEditingConfig({...editingConfig, servicesTitle: e.target.value})} className="w-full p-4 border rounded-2xl font-black mb-2" />
                  <input type="text" value={editingConfig.servicesSubtitle} onChange={e => setEditingConfig({...editingConfig, servicesSubtitle: e.target.value})} className="w-full p-4 border rounded-2xl font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aktuality (Nadpis / Podnadpis)</label>
                  <input type="text" value={editingConfig.articlesTitle} onChange={e => setEditingConfig({...editingConfig, articlesTitle: e.target.value})} className="w-full p-4 border rounded-2xl font-black mb-2" />
                  <input type="text" value={editingConfig.articlesSubtitle} onChange={e => setEditingConfig({...editingConfig, articlesSubtitle: e.target.value})} className="w-full p-4 border rounded-2xl font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rezervace (Nadpis / Podnadpis)</label>
                  <input type="text" value={editingConfig.bookingTitle} onChange={e => setEditingConfig({...editingConfig, bookingTitle: e.target.value})} className="w-full p-4 border rounded-2xl font-black mb-2" />
                  <input type="text" value={editingConfig.bookingSubtitle} onChange={e => setEditingConfig({...editingConfig, bookingSubtitle: e.target.value})} className="w-full p-4 border rounded-2xl font-medium" />
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-2">Kontakt & Patička</h3>
                <input type="text" value={editingConfig.contactPhone} onChange={e => setEditingConfig({...editingConfig, contactPhone: e.target.value})} className="w-full p-4 border rounded-2xl font-bold" placeholder="Telefon" />
                <input type="text" value={editingConfig.contactEmail} onChange={e => setEditingConfig({...editingConfig, contactEmail: e.target.value})} className="w-full p-4 border rounded-2xl font-bold" placeholder="Email" />
                <input type="text" value={editingConfig.contactAddress} onChange={e => setEditingConfig({...editingConfig, contactAddress: e.target.value})} className="w-full p-4 border rounded-2xl font-bold" placeholder="Adresa" />
                <textarea rows={2} value={editingConfig.footerAboutText} onChange={e => setEditingConfig({...editingConfig, footerAboutText: e.target.value})} className="w-full p-4 border rounded-2xl font-medium" placeholder="Text v patičce" />
              </div>

              <button onClick={saveConfig} style={{ backgroundColor: config.primaryColor }} className="w-full py-6 text-white rounded-3xl font-black text-xl shadow-2xl uppercase tracking-widest">Uložit Všechny Texty</button>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-50 p-8 rounded-3xl border">
              <h3 className="text-xl font-black">Ceník Služeb</h3>
              <button onClick={addService} style={{ backgroundColor: config.primaryColor }} className="px-8 py-4 text-white rounded-2xl font-black shadow-xl hover:brightness-110 transition-all">+ Přidat Službu</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editingServices.map(s => (
                <div key={s.id} className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] relative group">
                  <button onClick={() => deleteService(s.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-black">✕</button>
                  <div className="space-y-4">
                    <ImageInput label="Obrázek" value={s.imageUrl} onChange={val => handleServiceChange(s.id, 'imageUrl', val)} />
                    <input type="text" value={s.name} onChange={e => handleServiceChange(s.id, 'name', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-black text-sm" placeholder="Název" />
                    <textarea rows={2} value={s.description} onChange={e => handleServiceChange(s.id, 'description', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-xs" placeholder="Popis" />
                    <div className="flex gap-2">
                      <input type="text" value={s.price} onChange={e => handleServiceChange(s.id, 'price', e.target.value)} className="w-2/3 p-3 bg-slate-50 border rounded-xl font-black text-xs" placeholder="Cena" />
                      <select value={s.category} onChange={e => handleServiceChange(s.id, 'category', e.target.value as any)} className="w-1/3 p-3 bg-slate-50 border rounded-xl font-black text-xs">
                        <option value="pneu">Pneu</option>
                        <option value="servis">Servis</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { onUpdateServices(editingServices); alert('Ceník uložen!'); }} className="w-full py-6 bg-green-500 text-white rounded-3xl font-black text-xl shadow-2xl uppercase tracking-widest">Uložit Ceník Služeb</button>
          </div>
        )}

        {/* Visibility and Emails tabs remain same functional blocks... */}
        {activeTab === 'availability' && (
          <div className="max-w-2xl mx-auto space-y-8">
             <div className="bg-slate-50 p-10 rounded-[2.5rem] border shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 border-b pb-2">Dny otevřeno</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {daysLabels.map((label, idx) => (
                    <label key={idx} className="flex items-center space-x-3 p-4 bg-white rounded-2xl border-2 hover:border-blue-400 cursor-pointer transition-all">
                      <input type="checkbox" checked={editingConfig.availableDays.includes(idx)} onChange={(e) => {
                        const newDays = e.target.checked ? [...editingConfig.availableDays, idx] : editingConfig.availableDays.filter(d => d !== idx);
                        setEditingConfig({...editingConfig, availableDays: newDays});
                      }} />
                      <span className="font-black text-sm uppercase">{label}</span>
                    </label>
                  ))}
                </div>
             </div>
             <div className="bg-slate-50 p-10 rounded-[2.5rem] border shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-2 border-b pb-2">Časové sloty</h3>
                <textarea rows={12} value={editingConfig.customTimeSlots.join('\n')} onChange={(e) => setEditingConfig({...editingConfig, customTimeSlots: e.target.value.split('\n').filter(t => t.trim() !== '')})} className="w-full p-6 font-mono text-sm border rounded-3xl" />
             </div>
             <button onClick={saveConfig} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl uppercase tracking-widest">Uložit Harmonogram</button>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100 text-blue-900 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">EmailJS Notifikace</h3>
              <div className="space-y-6">
                <label className="flex items-center space-x-4 cursor-pointer p-6 bg-white rounded-3xl border-2">
                  <input type="checkbox" checked={editingConfig.emailNotificationsEnabled} onChange={e => setEditingConfig({...editingConfig, emailNotificationsEnabled: e.target.checked})} className="w-6 h-6 rounded" />
                  <span className="font-black text-sm uppercase tracking-wider">Aktivovat E-maily</span>
                </label>
                <div className="space-y-4">
                  <input type="email" value={editingConfig.recipientEmail} onChange={e => setEditingConfig({...editingConfig, recipientEmail: e.target.value})} className="w-full p-4 border rounded-2xl font-bold" placeholder="Váš email pro příjem" />
                  <input type="text" value={editingConfig.emailjsServiceId} onChange={e => setEditingConfig({...editingConfig, emailjsServiceId: e.target.value})} className="w-full p-4 border rounded-2xl font-mono text-xs" placeholder="Service ID" />
                  <input type="text" value={editingConfig.emailjsTemplateId} onChange={e => setEditingConfig({...editingConfig, emailjsTemplateId: e.target.value})} className="w-full p-4 border rounded-2xl font-mono text-xs" placeholder="Template ID" />
                  <input type="text" value={editingConfig.emailjsPublicKey} onChange={e => setEditingConfig({...editingConfig, emailjsPublicKey: e.target.value})} className="w-full p-4 border rounded-2xl font-mono text-xs" placeholder="Public Key" />
                </div>
              </div>
            </div>
            <button onClick={saveConfig} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl uppercase tracking-widest">Uložit Nastavení E-mailů</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
