'use client';

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
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedStore, getStores } from '@/lib/fetch-api/store/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { changeStore } from './action';
import { useMemo, useState } from 'react';

export const StoreSelector = ({
  storeId,
  className,
  disable,
}: {
  storeId?: string;
  className?: string;
  disable?: boolean;
}) => {
  const stores = useSuspenseQuery({
    queryKey: ['stores', 1, "", ""],
    queryFn: () =>  getStores(1, "", ""),
  });

  const selectedStore = useSuspenseQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const [open, setOpen] = useState(false);

  const superAdminOnly = userProfile.data?.user?.role === 'SUPER_ADMIN';

  const handleChangeStore = useMutation({
    mutationFn: async (storeId: string) => {
      await changeStore(storeId);
    },
  });

  const selectedStoreId = useMemo(() => {
    return storeId !== undefined && storeId !== selectedStore?.data?.store?.id
      ? storeId
      : selectedStore?.data?.store?.id;
  }, [selectedStore?.data?.store?.id, storeId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={!superAdminOnly || disable}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="max-w-28 truncate">
              {selectedStoreId
                ? stores.data.stores.find(
                    (store) => store.id === selectedStoreId,
                  )?.name
                : 'Select store...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {stores.data.stores.map((store) => (
                <CommandItem
                  key={store.id}
                  value={store.id}
                  onSelect={async (currentValue) => {
                    await handleChangeStore.mutateAsync(
                      currentValue === selectedStoreId
                        ? selectedStoreId || ''
                        : currentValue,
                    );

                    setOpen(() => false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedStoreId === store.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {store.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
