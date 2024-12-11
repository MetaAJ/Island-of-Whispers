import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: {path: '$messages', preserveNullAndEmptyArrays: true}},
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        return Response.json(
            {
                success: true,
                //other methods are also available to get messages, check em out on aggregation pipeline videos from chai aur code.
                messages: user[0].messages
            },
            {status: 200}
        )

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { 
                message: 'Internal server error', success: false 
            },
            { status: 500 }
        );
    }
}