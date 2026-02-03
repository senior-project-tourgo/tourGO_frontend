import { AppText } from './AppText';

export function Badge({ label }: { label: string }) {
  return (
    <AppText className="rounded-full bg-colors-brand-neutrals px-3 py-2 text-xs">
      {label}
    </AppText>
  );
}
