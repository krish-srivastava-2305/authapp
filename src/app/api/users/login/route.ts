import {connect} from "@/app/DBConnect/dbConnection"
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/users.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest){
    await connect();
    try {
        const reqBody = await req.json();
        // console.log(reqBody)
        const {email, password} = reqBody;

        const user = await User.findOne({email});
        // console.log(user)
        if(!user) return NextResponse.json({message: "User not found"}, {status:400})

        const correctPass = await bcrypt.compare(password, user.password)
        // console.log(correctPass)
        if(!correctPass) return NextResponse.json({message: "Pasword Incorrect"}, { status : 400})
        // console.log("creating token")
        const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        // console.log("token")
        const response = NextResponse.json({message: "Login Succes", success: true}, {status: 200})

        response.cookies.set("token", token,{
            httpOnly:true
        })

        return response 
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}