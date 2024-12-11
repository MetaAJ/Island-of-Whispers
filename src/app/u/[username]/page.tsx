'use client';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestButtonLoading, setIsSuggestButtonLoading] = useState(false);
  const { toast } = useToast();
  const [text, setText] = useState('');

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const watchContent = form.watch('content');

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const params = useParams<{ username: string }>();
  const specialChar = '||';

  const StringSplit = (sentence: string): string[] => {
    return sentence.split(specialChar);
  };

  async function onMessageSubmit(data: z.infer<typeof messageSchema>) {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content,
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
      }

      form.setValue('content', '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast({
        title: "error",
        description: error.response.data.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleTextMessage(data: string) {
    form.setValue('content', data);
  }

  async function onSuggestMessage() {
    setIsSuggestButtonLoading(true);
    try {
      const result = await axios.post('/api/suggest-messages');
      const response = result.data.message.candidates[0].content.parts[0].text;
      setText(response);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSuggestButtonLoading(false);
    }
  }

  return (
    <>
    <div className="container mx-auto mt-4 mb-6 p-2 rounded max-w-4xl bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-4 text-center">The Whisper Portal</h1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onMessageSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold ml-2'>Whisper a message to @{params.username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <Button disabled className='bg-purple-600 ml-1 font-bold'>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ....whispering
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !watchContent}
            className='font-bold ml-1 bg-gradient-to-r from-pink-700 to-purple-600 hover:scale-105 transition-transform'>
              Whisper
            </Button>
          )}
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            className="my-4 w-full font-bold bg-gradient-to-r from-pink-700 to-red-500 hover:scale-95 transition-transform"
            onClick={onSuggestMessage}
            disabled={isSuggestButtonLoading}
          >
            Shhh...uggestions
          </Button>
          <p className='font-bold ml-2'>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader className="font-bold">Messages</CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {isSuggestButtonLoading ? (
              //render skeletons while loading suggestions
              [...Array(3)].map((_, index) => (
                <Skeleton
                key={index}
                className='h-8 w-full rounded bg-gray-400 animate-pulse'
                />
              ))
            ) : text === '' ? (
              StringSplit(initialMessageString).map((data, index) => (
                <Button
                  className="border bg-gray-300 text-black hover:bg-gray-400 transition-colors rounded"
                  key={index}
                  onClick={() => handleTextMessage(data)}
                >
                  {data}
                </Button>
              ))
            ) : (
              StringSplit(text).map((data, index) => (
                <Button
                  className="border bg-gray-300 text-black hover:bg-gray-400 transition-colors rounded"
                  key={index}
                  onClick={() => handleTextMessage(data)}
                >
                  {data}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 font-bold font-serif">Become an Adventurer</div>
        <Link href={'/sign-up'}>
          <Button className='bg-black text-white hover:scale-105 transition-transform'>Create Account</Button>
        </Link>
      </div>
    </div>
    <footer className="text-center font-bold p-4 shadow-md bg-gradient-to-r from-black via-gray-900 to-black text-white">
    <p className="mb-4">© Island of Whispers. Have fun fellas. 🎉</p>
  </footer>
  </>
  );
}

export default Page;