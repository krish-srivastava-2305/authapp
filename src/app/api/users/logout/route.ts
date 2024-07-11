import {connect} from "@/app/DBConnect/dbConnection"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    await connect();
    try {
        const response = NextResponse.json({message: "logged out successfully", success: true}, {status: 200})
        response.cookies.set("token", "",
            {
                httpOnly: true
            }
        )
        return response

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}