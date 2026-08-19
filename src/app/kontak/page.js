import ContactView from '@/components/contact/ContactView';

// Metadata is server-rendered, so it is always Indonesian — locale only exists
// in the browser. Without its own entry this page inherited the site-wide title
// and competed with the homepage for the same searches.
export const metadata = {
  title: 'Kontak',
  description:
    'Email, WhatsApp, GitHub dan CV Utsman — fullstack developer di Banjarbaru, Kalimantan Selatan.',
};

export default function ContactPage() {
  return <ContactView />;
}
