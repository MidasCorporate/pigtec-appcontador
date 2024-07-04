import * as React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import cap1 from '../assets/cap1.jpeg'
// import cap2 from '../assets/cap2.jpeg'
// import cap3 from '../assets/cap3.jpeg'
import cap4 from '../assets/cap4.jpeg'
import cap5 from '../assets/cap5.jpeg'
import cap6 from '../assets/cap6.jpeg'
import cap7 from '../assets/cap7.jpeg'

export function CarouselHome() {
  return (
    <Carousel className="m-auto w-full max-w-md">
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap1}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        {/* <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap2}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap3}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem> */}
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap4}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap5}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap6}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <img
                  src={cap7}
                  alt="imagem_background"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
