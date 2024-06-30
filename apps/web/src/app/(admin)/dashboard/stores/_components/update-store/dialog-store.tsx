import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UpdateStoreForm } from './store-form';
import { Store } from '@/lib/types/store';

export default function DialogStore({
  store,
  handleClose,
}: {
  handleClose: () => void;
  store: Store;
}) {
  return (
    <>
      <DialogContent className="min-h-max  sm:max-w-2xl">
        <DialogHeader className='p-2'>
          <DialogTitle>Update {store.name}</DialogTitle>
          <DialogDescription>
            Update {store.name} here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-[30vh] max-h-[60vh]">
          <UpdateStoreForm store={store} handleClose={handleClose} />
        </ScrollArea>
      </DialogContent>
    </>
  );
}
