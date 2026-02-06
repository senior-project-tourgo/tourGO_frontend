import { AppText } from './AppText';

export function Badge({ label }: { label: string }) {
  return (
    <AppText className="rounded-full bg-colors-brand-neutrals px-2 py-1 text-xs">
      {label}
    </AppText>
  );
}
