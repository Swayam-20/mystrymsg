import { Message } from "@/model/user";

export interface ApiResonse {
    success: boolean;
    message: string;
    isAccepted?: boolean; // Optional field to indicate if the request was accepted
    Messages?: Array<Message> ; // Optional field for data, can be an array of messages or null
    statusCode?: number; // Optional field for HTTP status code
}
