import { useTranslations } from 'next-intl';
import { ContactForm } from '@/components/contact/contact-form';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact MVVCSO. Reach out with questions, ideas, or to get involved with the Ranchita community.',
};

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            {t('title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-(--text-primary) mb-6">
                  {t('info_title')}
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-100/15 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-medium text-(--text-primary) text-sm">Address</p>
                      <p className="text-(--text-secondary) text-sm">{t('address')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-100/15 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-medium text-(--text-primary) text-sm">Phone</p>
                      <p className="text-(--text-secondary) text-sm">{t('phone')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-100/15 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-medium text-(--text-primary) text-sm">Email</p>
                      <p className="text-(--text-secondary) text-sm">{t('email')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden border border-stone-200 h-64">
                <iframe
                  title="MVVCSO Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3359.5!2d-116.467!3d33.055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db8c3e7f7b0001%3A0x1!2s37370+Montezuma+Valley+Rd%2C+Ranchita%2C+CA+92066!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
