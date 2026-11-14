import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '@/i18n';
import { playBell } from '@/lib/sound';
import { useSound } from './SoundProvider';

export const SoundToggle = () => {
  const { enabled, toggle } = useSound();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => {
        // Ring once when turning sound back on, so the user hears what they enabled
        if (!enabled) playBell();
        toggle();
      }}
      aria-pressed={enabled}
      aria-label={t('nav.sound')}
      title={enabled ? t('nav.soundOn') : t('nav.soundOff')}
      className="inline-flex size-9 items-center justify-center rounded-control text-on-wood-muted transition-colors hover:bg-black/20 hover:text-on-wood"
    >
      {enabled ? (
        <Volume2 className="size-4" aria-hidden />
      ) : (
        <VolumeX className="size-4" aria-hidden />
      )}
    </button>
  );
};
