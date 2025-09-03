"use client"
import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from "@/message.json"
import Autoplay from "embla-carousel-autoplay"
function home() {
  return (<>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
  <section className='text-centre mb-8 md:mb-12'>
    <h1 className='text-3xl md:text-5xl font-bold'> Dive into the World of Anonymous Conversations</h1>
    <p className='mt-4 md:text-lg md:mt-4 text-base'> 
      explore msytry message from around the world
    </p>
  </section>
  <Carousel 
  plugins={[Autoplay({ delay: 2500 })]}
  className="w-full max-w-xs">
      <CarouselContent>
        {message.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader > {message.title}</CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-xl font-semibold">{message.content}</span>
                </CardContent>
                <footer className="w-full border-t-2 text-center p-4 text-sm ">{message.recieved}</footer>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
</main>
<footer>
  <div className="w-full border-t text-center p-4 text-sm text-muted-foreground">
    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
  </div>
</footer>
</>
  )
}

export default home