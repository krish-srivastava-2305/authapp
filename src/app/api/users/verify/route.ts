import { connect } from "@/app/DBConnect/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/users.models";

export async function POST(req: NextRequest) {
    await connect();
    try {
        const reqBody = await req.json(); // Ensure proper handling of JSON
        // console.log("Request Body: ", reqBody); // Log the entire request body for debugging
        const { token }: { token: string } = reqBody;
        // console.log("Token: " + token); // Log the token value

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            // console.log("Token is invalid or has expired"); // Additional logging for debugging
            return NextResponse.json({ message: "Token invalid or expired" }, { status: 400 });
        }

        user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error: any) {
        console.error("Error verifying token: ", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
