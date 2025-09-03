"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios,{AxiosError} from "axios"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/Schemas/signupSchema"
import { ApiResonse } from "@/types/Apiresponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const signup = ()  =>{
    const [username,setusername] = useState("");
    const [usernamemessage,setusernamemessage] = useState("");
    const [ischeckingusername,setischeckingusername] = useState(false);
    const [isSubmitting,setisSubmitting] = useState(false);
    const debounceusername = useDebounceCallback(setusername,500);
    const {toast} = useToast();
    const router =useRouter();
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
    })
    useEffect(() =>{
        const checkUsername = async() =>{
        if(username.length >=2)
        {
            setischeckingusername(true);
            setusernamemessage("Checking username...");
            await axios.get(`/api/check-unique-username?username=${username}`)
            .then((res)=>{
                setusernamemessage(res.data.message);
            })
            .catch((err)=>{
                const axioserror = err as AxiosError<ApiResonse>
                setusernamemessage(axioserror.response?.data.message || "Error checking username");
            })
            .finally(()=>{
                setischeckingusername(false);
              }
              )
        }
        else
        {
            setusernamemessage("");
        }
    }
    checkUsername();
  },[username])

  const onsubmit = async(data:z.infer<typeof signupSchema>) =>{
      setisSubmitting(true);
      try {
        const response = await axios.post<ApiResonse>('/api/sign-up',data)
        toast({
            title:"Success",
            description:response.data.message,
            
        })
        router.replace(`/verify/${username}`);
      } catch (error) {
        console.error(error);
        const axioserror = error as AxiosError<ApiResonse>
        toast({
            title:"sign-up Error",
            description:axioserror.response?.data.message || "Something went wrong",
            variant:"destructive"
        })
      }
      setisSubmitting(false);
  }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">  
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e) =>{
                    
                    field.onChange(e);
                    debounceusername(e.target.value);
                }}
                
                />
              </FormControl>
              {ischeckingusername && <Loader2 className="animate-spin" />}
              <div className={`text-sm ${usernamemessage === "Username is available" ? 'text-green-500':'text-red-500'}`}> test {usernamemessage}</div>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
                type="email"
                />
              </FormControl>
              <FormMessage/>
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
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
              </>
            ) : ("Sign Up")
          }
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
    </div>
      </div>
    </div>
    )
}
export default signup