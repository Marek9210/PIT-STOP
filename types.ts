
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'pneu' | 'servis';
  imageUrl: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  published: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  note?: string;
}

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  servicesTitle: string;
  servicesSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl1: string;
  aboutImageUrl2: string;
  bookingTitle: string;
  bookingSubtitle: string;
  articlesTitle: string;
  articlesSubtitle: string;
  footerAboutText: string;
  footerBottomText: string;
  facebookUrl: string;
  instagramUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  openingHoursWeek: string;
  openingHoursSat: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  adminPassword?: string;
  availableDays: number[];
  customTimeSlots: string[];
  articles: Article[];
  // EmailJS konfigurace
  emailNotificationsEnabled: boolean;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  recipientEmail: string;
}

export type ViewMode = 'client' | 'admin';
