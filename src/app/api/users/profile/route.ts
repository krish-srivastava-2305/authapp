import {connect} from "@/app/DBConnect/dbConnection"
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/users.models";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest){
    await connect();
    try {
        const token  = req.cookies.get("token")?.value || "";
        // console.log("token: " + token)
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!)
        const user = await User.findById(decodedToken.id).select("-password")
        return NextResponse.json({message: user, success: true}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}