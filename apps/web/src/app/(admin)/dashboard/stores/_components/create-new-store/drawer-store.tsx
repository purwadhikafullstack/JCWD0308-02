import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { CreateStoreForm } from './store-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DrawerStore({
  handleClose,
}: {
  handleClose: () => void;
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
          <CreateStoreForm handleClose={handleClose} className="px-4" />
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
