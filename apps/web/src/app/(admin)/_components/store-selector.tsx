'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Store } from 'lucide-react';

const frameworks = [
  {
    value: 'GrosiRunp',
    label: 'GrosiRun Pusat',
  },
  {
    value: 'GrosiRunBDG',
    label: 'GrosiRun Bandung',
  },
  {
    value: 'GrosiRunJKT',
    label: 'GrosiRun Jakarta',
  },
  {
    value: 'GrosiRunBSD',
    label: 'GrosiRun BSD',
  },
  {
    value: 'GrosiRunDPK',
    label: 'GrosiRun Depok',
  },
];
export const StoreSelector = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('GrosiRunp');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className='flex items-center gap-2'>
            <Store className="h-4 w-4" />
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : 'Select framework...'}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === framework.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
