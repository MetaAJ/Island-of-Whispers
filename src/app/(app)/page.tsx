'use client'
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-24 py-12 bg-gray-100">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-justify mb-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 leading-relaxed bg-clip-text text-transparent">
            Dive into the world of explicit anonymity
          </h1>
          <p className="mt-4 text-base font-semibold md:text-lg text-gray-700 max-w-2xl mx-auto">
            The only thing secret here is your.....🤫
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className='overflow-x-scroll'>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-bold p-4 shadow-md bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <p className="mb-4">© Island of Whispers. Have fun fellas. 🎉</p>
      </footer>
    </>
  );
}