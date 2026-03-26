import { Accordion } from '@/components/Accordion';
import { Stepper } from '@/components/Stepper';
import { type GroupType } from '@/mock/groupTypes.mock';

type GroupSectionProps = {
  groupType: GroupType | null;
  people: number;
  setPeople: (num: number) => void;
};

export default function GroupSection({
  groupType,
  people,
  setPeople
}: GroupSectionProps) {
  const groupSummary =
    [groupType?.label, people > 1 ? `${people} people` : null]
      .filter(Boolean)
      .join(' · ') || undefined;

  return (
    <Accordion
      icon="people-outline"
      title="Who are you traveling with?"
      summary={groupSummary}
      completed={!!groupType}
    >
      <Stepper
        label="How many people?"
        value={people}
        onChange={setPeople}
        min={1}
        max={50}
      />
    </Accordion>
  );
}
