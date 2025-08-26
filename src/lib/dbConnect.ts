import { Promise } from "mongoose";
import mongoose from "mongoose";


interface ConnectionObject  {
    isConnected?: number
}

const  connection: ConnectionObject = {
    
}

async function dbConnect() : Promise<void> {
        if(connection.isConnected){
        console.log("DataBase is connected")
        return ;
        }
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI as string)
            connection.isConnected = db.connections[0].readyState; 
            console.log("Database connected successfully")
        } catch (error) {
            console.log("Database is not connected" , error)
            process.exit(1)
        }
}

export default dbConnect;