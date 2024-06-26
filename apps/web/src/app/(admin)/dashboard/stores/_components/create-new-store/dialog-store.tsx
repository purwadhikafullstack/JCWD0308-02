import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateStoreForm } from './store-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DialogStore({
  handleClose,
}: {
  handleClose: () => void;
}) {
  return (
    <>
      <DialogContent className="min-h-max  sm:max-w-2xl">
        <DialogHeader className="p-2">
          <DialogTitle>Create new store</DialogTitle>
          <DialogDescription>
            Create new store here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-[30vh] max-h-[60vh]">
          <CreateStoreForm handleClose={handleClose} />
        </ScrollArea>
      </DialogContent>
    </>
  );
}
