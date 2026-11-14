import { useI18n } from '@/i18n';

export const GofBadge = () => {
  const { t } = useI18n();
  return (
    <abbr
      title={t('catalog.gofTitle')}
      className="rounded border border-line px-1.5 py-px font-mono text-[0.7rem] text-kelp no-underline"
    >
      GoF
    </abbr>
  );
};
