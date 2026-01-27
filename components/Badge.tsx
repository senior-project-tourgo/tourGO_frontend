import { AppText } from './Text';

export function Badge({ label }: { label: string }) {
  return (
    <AppText className="bg-secondary rounded-full px-3 py-1 text-xs text-white">
      {label}
    </AppText>
  );
}
