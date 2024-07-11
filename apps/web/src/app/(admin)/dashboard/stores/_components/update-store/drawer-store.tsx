import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Store } from '@/lib/types/store';
import { UpdateStoreForm } from './store-form';

export default function DrawerStore({
  store,
  handleClose,
}: {
  handleClose: () => void;
  store: Store
}) {
  return (
    <>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create new store</DrawerTitle>
          <DrawerDescription>
            Create new store here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[80vh]">
          <UpdateStoreForm store={store} handleClose={handleClose} className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </>
  );
}
