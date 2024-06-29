'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateStoreForm } from './store-form';
import dynamic from 'next/dynamic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';

const DrawerStore = dynamic(() => import('./drawer-store'));
const DialogStore = dynamic(() => import('./dialog-store'));

export default function CreateNewStore() {
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
          <Button>Create New Store</Button>
        </DialogTrigger>
        <DialogStore handleClose={handleClose} />
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create New Store</Button>
      </DrawerTrigger>
      <DrawerStore handleClose={handleClose} />
    </Drawer>
  );
}
