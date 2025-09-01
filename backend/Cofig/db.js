import mongoose from 'mongoose';

export const databaseConn =async ()=>{
    try {
     const conn = await mongoose.connect(process.env.MONGODB_CONN_STRING)
        console.log(`Database connected sucessfuly ${mongoose.connection.host} `.bgCyan.white)
    } catch (error) {
        console.log("error in mongodb Connection!")
    }
}

