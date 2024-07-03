'use client';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Store } from '@/lib/types/store';

const DrawerStore = dynamic(() => import('./drawer-store'));
const DialogStore = dynamic(() => import('./dialog-store'));

export default function UpdateStore({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const handleClose = () => setOpen(false);

  const [showOnMobile, setShowOnMobile] = useState(false);
  useEffect(() => {
    setShowOnMobile(isDesktop);
  }, [isDesktop]);

  if (showOnMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Edit Store</Button>
        </DialogTrigger>
        <DialogStore store={store} handleClose={handleClose} />
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full">Edit Store</Button>
      </DrawerTrigger>
      <DrawerStore store={store} handleClose={handleClose} />
    </Drawer>
  );
}
