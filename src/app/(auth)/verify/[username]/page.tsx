"use client"
import { verifySchema } from '@/Schemas/verifySchema';
import { useToast } from '@/components/ui/use-toast';
import { ApiResonse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
function verifyaccount () {
    const router = useRouter();
    const {toast} = useToast();
    const params = useParams<{username : string}>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema)
    })
    const onsubmit = async(data : z.infer<typeof verifySchema>) =>{
        try {
            const response = await axios.post('/api/verify-code',{
                username : params.username,
                code : data.code
            })
            toast ({
                title : "Success",
                description : response.data.message,
                variant : "default"
            })
            router.replace('/sign-in');
        } catch (error) {
            console.error(error);
        const axioserror = error as AxiosError<ApiResonse>
        toast({
            title:"verify account failed",
            description:axioserror.response?.data.message || "Something went wrong",
            variant:"destructive"
        })
        }
    }
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Verify code</FormLabel>
                <FormControl>
                <Input placeholder="verify code" {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <Button type="submit">
        Submit
        </Button>
        </form>
    </Form>
        </div>
    </div>

    )
}

export default verifyaccount 