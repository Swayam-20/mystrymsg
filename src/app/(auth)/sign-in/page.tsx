"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios,{AxiosError} from "axios"

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/Schemas/signupSchema"
import { ApiResonse } from "@/types/Apiresponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signinSchema } from "@/Schemas/signinSchema"
import { signIn } from "next-auth/react"

const signin = ()  =>{
    
    
    const [isSubmitting,setisSubmitting] = useState(false);
   
    const {toast} = useToast();
    const router =useRouter();
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    })
    

  const onsubmit = async(data:z.infer<typeof signinSchema>) =>{
      setisSubmitting(true);
      await signIn("credentials",{
        redirect:false,
        identifier:data.identifier,
        password:data.password,
      }).then((res)=>{
        console.log(res);
        if(res?.error)
        {
            toast({
                title:"Sign In Failed",
                description: res.error,
                variant:"destructive"
            })
        }
        if(!res?.url){
          toast({
            title:"Sign In Failed",
            description: "Something went wrong",
            variant:"destructive"
          });
        }
            toast({
                title:"Success",
                description:"You have successfully signed in"  ,
                variant:"default"
            })
            router.replace("/dashboard");
        
      }).catch((err)=>{
        const axioserror = err as AxiosError<ApiResonse>
        toast({
            title:"Sign In Failed",
            description: axioserror.response?.data.message || "Something went wrong",
            variant:"destructive"
        })
      }).finally(()=>{
        setisSubmitting(false);
      })
  }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">  
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}
                type="password"
                onChange={(e) =>{
                    field.onChange(e);
                }}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Sign in
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
    </div>
      </div>
    </div>
    )
}
export default signin