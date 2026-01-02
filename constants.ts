
import { SiteConfig, Service } from './types';

export const INITIAL_CONFIG: SiteConfig = {
  siteName: "AutoPneu Pro",
  siteTagline: "Pneuservis & Autoservis",
  heroTitle: "Profesionální péče o váš vůz",
  heroSubtitle: "Rychlý pneuservis a spolehlivý autoservis s tradicí. Rezervujte si svůj termín online během pár vteřin.",
  heroImageUrl: "https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=800",
  servicesTitle: "Kvalitní péče o váš vůz",
  servicesSubtitle: "Nabízíme kompletní portfolio služeb pro osobní i užitkové vozy.",
  aboutTitle: "O našem servisu",
  aboutText: "Jsme tým nadšenců do aut, kteří věří, že kvalita a osobní přístup jsou základem spokojenosti. Od přezouvání pneumatik až po složité motorové opravy - váš vůz je u nás v nejlepších rukou.",
  aboutImageUrl1: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400",
  aboutImageUrl2: "https://images.unsplash.com/photo-1487754180451-c456f719c141?auto=format&fit=crop&q=80&w=400",
  bookingTitle: "Rezervace termínu",
  bookingSubtitle: "Vyberte si službu a čas, který vám vyhovuje. My se o zbytek postaráme.",
  articlesTitle: "Aktuality z našeho servisu",
  articlesSubtitle: "Sledujte novinky, tipy pro údržbu a speciální akce, které pro vás připravujeme.",
  footerAboutText: "Jsme moderní servis, který si zakládá na férovosti, profesionalitě a rychlosti. Vaše auto je naše starost.",
  footerBottomText: "Vytvořeno pro váš bezpečný dojezd",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  contactEmail: "info@autopneu-pro.cz",
  contactPhone: "+420 777 888 999",
  contactAddress: "Autoopravářská 123, 150 00 Praha 5",
  openingHoursWeek: "8:00 - 18:00",
  openingHoursSat: "9:00 - 13:00",
  logoUrl: "https://picsum.photos/id/1072/200/200",
  primaryColor: "#2563eb",
  accentColor: "#4f46e5",
  adminPassword: "admin",
  availableDays: [1, 2, 3, 4, 5, 6],
  customTimeSlots: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  articles: [
    {
      id: 'a1',
      title: 'Příprava na zimní sezónu',
      content: 'Nezapomeňte na včasné přezutí. Doporučujeme kontrolu dezénu a stavu akumulátoru před prvními mrazy.',
      date: '2024-10-15',
      imageUrl: 'https://images.unsplash.com/photo-1578844541663-47139a331df5?auto=format&fit=crop&q=80&w=600',
      published: true
    }
  ],
  // Výchozí hodnoty pro emaily
  emailNotificationsEnabled: false,
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: "",
  recipientEmail: ""
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Kompletní přezutí kol',
    description: 'Demontáž, montáž a vyvážení kol včetně kontroly stavu pneumatik.',
    price: 'od 1 200 Kč',
    category: 'pneu',
    imageUrl: 'https://images.unsplash.com/photo-1545094348-735990267c7e?auto=format&fit=crop&q=80&w=600'
  }
];
