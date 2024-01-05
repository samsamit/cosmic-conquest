import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeamSelectProps<TOption extends object> = {
  value: TOption;
  onChange: (value: TOption) => void;
  options: TOption[];
  optionLabelKey: keyof TOption;
};
const TeamSelect = <TOption extends object>(
  props: TeamSelectProps<TOption>
) => {
  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
      placeholder="Select a fruit…"
      itemComponent={(itemProps) => (
        <SelectItem item={itemProps.item}>
          {itemProps.item.rawValue[props.optionLabelKey] as string}
        </SelectItem>
      )}
    >
      <SelectTrigger aria-label="Fruit" class="w-[180px]">
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export default TeamSelect;
