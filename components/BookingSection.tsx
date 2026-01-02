
import React, { useState, useEffect } from 'react';
import { Service, Booking, SiteConfig } from '../types';

interface BookingSectionProps {
  services: Service[];
  config: SiteConfig;
  onAddBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ services, config, onAddBooking }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: '',
    date: '',
    time: config.customTimeSlots[0] || '',
    note: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (services.length > 0 && !formData.serviceId) {
      setFormData(prev => ({ ...prev, serviceId: services[0].id }));
    }
    if (config.customTimeSlots.length > 0 && !formData.time) {
      setFormData(prev => ({ ...prev, time: config.customTimeSlots[0] }));
    }
  }, [services, config.customTimeSlots]);

  const validateDay = (dateStr: string) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const day = date.getDay(); // 0=Ne, 1=Po...
    return config.availableDays.includes(day);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError(null);

    const selectedServiceId = formData.serviceId || (services.length > 0 ? services[0].id : '');

    if (!formData.date || !selectedServiceId || !formData.name || !formData.phone) {
      setError("Prosím vyplňte všechna povinná pole.");
      return;
    }

    if (!validateDay(formData.date)) {
      setError("V tento den máme bohužel zavřeno. Prosím vyberte jiný termín.");
      return;
    }

    onAddBooking({
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceId: selectedServiceId,
      date: formData.date,
      time: formData.time,
      note: formData.note
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceId: services[0]?.id || '',
      date: '',
      time: config.customTimeSlots[0] || '',
      note: ''
    });

    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <section id="rezervace" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{config.bookingTitle}</h2>
          <p className="text-slate-600 text-lg font-medium">{config.bookingSubtitle}</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 p-12 rounded-[2.5rem] text-center shadow-xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">✓</div>
            <h3 className="text-3xl font-black text-green-800 mb-4">Rezervace odeslána!</h3>
            <p className="text-green-700 font-bold text-lg">Děkujeme. Budeme vás kontaktovat pro potvrzení.</p>
            <button onClick={() => setSubmitted(false)} className="mt-8 text-green-600 font-black uppercase text-xs tracking-widest border-b-2 border-green-200">Nová rezervace</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl font-bold text-sm text-center border border-red-200">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Vaše jméno *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-medium bg-white" placeholder="Jan Novák" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-medium bg-white" placeholder="email@seznam.cz" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Telefon *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-medium bg-white" placeholder="+420 123 456 789" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ služby *</label>
                  <select required value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-bold bg-white">
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Datum *</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-bold bg-white ${formData.date && !validateDay(formData.date) ? 'border-red-500' : 'border-slate-200 focus:border-primary'}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Čas *</label>
                    <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-bold bg-white">
                      {config.customTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Poznámka</label>
                  <textarea rows={1} value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-medium bg-white resize-none" placeholder="Poznámka..." />
                </div>
              </div>
            </div>
            <button type="submit" className="mt-10 w-full py-6 bg-primary hover:brightness-110 text-white text-2xl font-black rounded-3xl shadow-2xl transition-all transform hover:-translate-y-1 uppercase tracking-widest">Potvrdit rezervaci</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
