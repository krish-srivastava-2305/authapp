import {connect} from "@/app/DBConnect/dbConnection"
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/users.models";
import bcrypt from "bcryptjs";
import { mailer } from "@/app/heplers/mailer";

export async function POST(req: NextRequest) {
    try {
        await connect();  
        const { email, username, password }: any = await req.json(); 
        if (!email || !username || !password) {
            return NextResponse.json({ error: "One or more fields are missing" }, { status: 400 });
        }

        const user = await User.findOne({email});
        // console.log(user)
        if (user) {
            if (user.isVerfied) {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            } else {
                // console.log("entering mailer")
                const mail = await mailer({email, emailType: "VERIFY", userID: user._id})
                // console.log("mail sent")
                return NextResponse.json({ success: "Mail sent! Please verify your account" }, { status: 200 });
            }
        }

        const hashedPass = await bcrypt.hash(password, 10);  // Await the hashing process
        // const newUser = await User.create({
        //     email,
        //     username,
        //     password: hashedPass,
        //     isVerified: false,
        // });

        const newUser = new User({
            email,
            username,
            password: hashedPass,
            isVerfied: false,
        })

        const savedUser = await newUser.save()
        // console.log(savedUser)

        if (savedUser) {
            await mailer({email, emailType: "VERIFY", userID: savedUser._id})
            return NextResponse.json({ success: "Account created and mail sent! Please verify your account" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: "problem" }, { status: 500 });
    }
}
