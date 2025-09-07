"use client"
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/user';
import { ApiResonse } from '@/types/Apiresponse';
import axios, { AxiosError } from 'axios';
import React, { useCallback } from 'react'
import { Form, useForm } from 'react-hook-form';

function home() {
  const [messages , setMessages] = React.useState<Message[]>([]);
  const [ isloading , setisloading] = React.useState<boolean>(false);
  const [isSwitchloading , setIsSwitchloading] = React.useState<boolean>(false);
  const{toast} = useToast()

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
    const res = await axios.get<ApiResonse>('/api/get-messages')
    setMessages((res.data?.data as Message[]) ?? []);
    if(refresh)
    {
      toast({
        title:"Messages refreshed",
        description:res.data.message,
        variant:"default"
      })
    }
  },[])

}

export default home