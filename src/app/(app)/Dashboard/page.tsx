"use client"
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/user';
import { ApiResonse } from '@/types/Apiresponse';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback,useEffect } from 'react'
import { Form, useForm } from 'react-hook-form';

function dashboard() {
  const [messages , setMessages] = React.useState<Message[]>([]);
  const [ isloading , setisloading] = React.useState<boolean>(false);
  const [isSwitchloading , setIsSwitchloading] = React.useState<boolean>(false);
  const{toast} = useToast()
  const {data:session} = useSession();
  const handleDeleteConfirm = (messageId:string) => {
    setMessages(messages.filter((msg) => msg._id !== messageId));
  }
  const form = useForm()
  const {register,watch,setValue} = form;

  const acceptMessages = watch('acceptMessages');
  const fetchacceptMessages = useCallback(async() =>{
    setIsSwitchloading(true);
    try {
      const res  = await axios.get<{isAcceptingmsg:boolean}>('/api/accept-messages')
      setValue('acceptMessages',res.data.isAcceptingmsg)
    } catch (error) {
      const err = error as AxiosError<{message:string}>
      toast({
        title:"fetch accept message failed",
        description:err.response?.data.message || "something went wrong",
        variant:"destructive"
      })
    }
    finally{
      setIsSwitchloading(false);
    }
  },[setValue])// setvalue to update the form state and re-render the component
 
  const fetchMessages = useCallback(async(refresh:boolean=false) =>{
    setisloading(true)
    setIsSwitchloading(false)
    try {
      const res = await axios.get<ApiResonse>('/api/get-messages')
      setMessages(res.data?.Messages || [])
      if(refresh)
      {
        toast({
          title:"Messages refreshed",
          description:res.data.message,
          variant:"default"
        })
      }
    } catch (error) {
      const err= error as AxiosError<{message:string}>
      toast({
        title:"fetch messages failed",
        description:err.response?.data.message || "something went wrong",
        variant:"destructive"
      })
    }
    finally{
      setisloading(false)
    }
  },[setisloading,setMessages])// in dependancy array to avoid re-creation of function on every render
  // and to avoid infinite loop in useEffect
  useEffect(() =>{
    if(!session || !session.user)
    return 
    
    fetchMessages();
    fetchacceptMessages();
    
  },[
    fetchMessages,
    fetchacceptMessages,
    setValue,session
  ])
  // handle switch 
  const handleSwitchChange = async() =>{
     setIsSwitchloading(true);
     try {
      const res  = await axios.post<ApiResonse>('/api/accept-messages',{'acceptMessages':!acceptMessages})
      setValue('acceptMessages',!acceptMessages)
      toast({
        title:"Success",
        description:res.data.message,
        variant:"default"
      })
     } catch (error) {
      const err = error as AxiosError<{message:string}>
      toast({
        title:"update accept message failed",
        description:err.response?.data.message || "something went wrong",
        variant:"destructive"
      })
     }
  }
  if(!session || !session.user)
  { 
    return (
      <>
          <div>
            Please Login
            </div>
            </>
            )
  }
  
  const {username} = session.user as {username:string}
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipboard = async () =>{
    try {
      await navigator.clipboard.writeText(profileURL)
      toast({
        title:"Profile URL copied to clipboard",
        description:"URL copied successfully",
        variant:"default"
      })
    }
    catch (error) {
      toast({
        title:"Failed to copy profile URL",
        description:"Please try again",
        variant:"destructive"
      })
    }
  }
  return (
    <><div>
      home
      </div></>
  )
}

export default dashboard