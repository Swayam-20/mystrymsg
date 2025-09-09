"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { ApiResonse } from "@/types/Apiresponse"
import { Message } from "@/model/user"
import { useToast } from "./ui/use-toast"
function MessageCard(
{message,onDeleteMessage}: {message: Message; onDeleteMessage: (messageId:string) => void ;}
) { 
    const {toast}   = useToast();
    const handleDeleteConfirm = async () => {
        try {
          const res = await axios.delete<ApiResonse>(
            `/api/delete-message/${message._id}`
          );
    
          toast({
            title: res.data?.message || "Message deleted successfully",
          });
    
          onDeleteMessage(message._id as string);
        } catch (error: any) {
          console.error("Delete error:", error);
          toast({
            title: "Failed to delete message",
            description:
              error?.response?.data?.message || "Please try again later.",
            variant: "destructive",
          });
        }
      };
  return (
    <Card>
   <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"> <X className="w-5 h-5"/> </Button>
            </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
            </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
    <p>Card Content</p>
    </CardContent>
</Card>

    )
}

export default MessageCard