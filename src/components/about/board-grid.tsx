import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';

const boardMembers = [
  { name: 'Annette Foote', role: 'Board Member' },
  { name: 'Colleen James', role: 'Board Member' },
  { name: 'David Walter', role: 'Board Member' },
  { name: 'Gabby Ohmert', role: 'Board Member' },
  { name: 'Kristi Bruner', role: 'Board Member' },
  { name: 'Michelle Erwin', role: 'Board Member' },
  { name: 'Nicholas Ketelesen', role: 'Board Member' },
];

export function BoardGrid() {
  const t = useTranslations('about');

  return (
    <section className="py-(--section-padding) bg-stone-100">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-(--text-primary)">
          {t('board_title')}
        </h2>
        <p className="text-(--text-secondary) text-center mb-12 max-w-xl mx-auto">
          {t('board_subtitle')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {boardMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl p-5 text-center shadow-sm border border-stone-200"
            >
              <div className="w-16 h-16 rounded-full bg-stone-200/40 flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-terra-400" />
              </div>
              <h3 className="font-semibold text-sm text-(--text-primary)">
                {member.name}
              </h3>
              <p className="text-xs text-(--text-muted) mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
