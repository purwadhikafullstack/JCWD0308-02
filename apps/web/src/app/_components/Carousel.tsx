import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function CarouselComponent() {
  return (
    <div className="relative flex justify-center mt-3 mx-4 md:mx-10 lg:mx-20 xl:mx-40">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="flex w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
            >
              <div className="p-1">
                <Card className="h-[20rem] flex items-center justify-center">
                  <CardContent className="p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10" />
      </Carousel>
    </div>
  );
}
