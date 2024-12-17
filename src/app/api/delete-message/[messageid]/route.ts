import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  try {
    const messageId = (await params).messageid;

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete message route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
