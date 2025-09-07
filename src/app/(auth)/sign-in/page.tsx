"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"

export const page = ()  =>{
    const [username,setusername] = useState("");
    const [usernamemessage,setusernamemessage] = useState("");
    const [isLoading,setisLoading] = useState(false);
    const [isSubmitted,setisSubmitted] = useState(false);
    const debounceusername = useDebounceValue(username,500);
    const {toast} = useToast();


    return (
      <div></div>
    )
}