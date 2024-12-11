'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),   
        defaultValues: {
            username: params.username || "",
            code: "",
        } 
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            console.log("API Response:", response.data);
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`/sign-in`);

        } catch (error) {
            console.error("Error verifying the user: ", error)
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Verification Failed',
                description: axiosError.response?.data.message,
                variant: 'destructive',
            });
        }
    }

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Verification code has been sent to your provided email.</p>
            </div>
            <Form {...form}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const errors = form.formState.errors;
                    console.log("errors before submit: ", errors);
                    form.handleSubmit(onSubmit)(e)
                }}
                className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">Verify</Button>
                </form>
            </Form>
        </div>
    </div>
    )
}