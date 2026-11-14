import { useI18n } from '@/i18n';

export const PageLoading = () => {
  const { t } = useI18n();
  return (
    <p role="status" className="px-4 py-24 text-center text-sm text-kelp">
      {t('common.loading')}
    </p>
  );
};
