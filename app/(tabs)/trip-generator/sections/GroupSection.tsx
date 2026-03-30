import { Accordion } from '@/components/Accordion';
import { Stepper } from '@/components/Stepper';
import SelectableChips from '@/components/SelectableChips';
import { GROUP_TYPES, type GroupType } from '@/mock/groupTypes.mock';

type GroupSectionProps = {
  groupType: GroupType | null;
  setGroupType: (gt: GroupType) => void;
  people: number;
  setPeople: (num: number) => void;
};

export default function GroupSection({
  groupType,
  setGroupType,
  people,
  setPeople
}: GroupSectionProps) {
  const handleGroupTypeSelect = (gt: GroupType) => {
    setGroupType(gt);
    setPeople(gt.defaultPeople);
  };

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
      <SelectableChips
        title="Group type"
        options={GROUP_TYPES}
        selectedOption={groupType}
        onSelect={handleGroupTypeSelect}
      />
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
