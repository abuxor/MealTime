import { Button, IconButton, Popover } from "@radix-ui/themes";
import {PlusIcon} from "@/components/icons";
import RecipeSelectorCompact from "@/app/(user)/meal-plan/RecipeSelectorCompact";
import React from "react";

export interface AddMealPopoverProps {
  onAdd: (recipeId: string, mealType: string, date: string) => void;
  mealType: string;
  date: string;
}
export function AddMealPopover({ onAdd, mealType, date }: AddMealPopoverProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton size="3" radius="full" variant="soft">
          <PlusIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content>
        <RecipeSelectorCompact
          onSelect={({ id }) => {
            onAdd(id, mealType, date);
            btnRef.current.click();
          }}
        />
        <Popover.Close>
          <Button className="sr-only" ref={btnRef}>
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}