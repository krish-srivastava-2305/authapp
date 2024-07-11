'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function SignUpPage() {
  const [user, setUser] = useState({})
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const router = useRouter()

  const signUp = async () => {
        try {
            const res = await axios.post("/api/users/signup", user)
            console.log(res.data)
            if(res.data?.success){
                console.log("success signup")
                router.push("/login")
            }
            else{
                console.log("incorrect details")
            }
        } catch (error: any) {
            console.error(error.message)
            return
        }
    }
  useEffect(()=>{
    setUser({
        username,
        email,
        password
    })
  },[username, password, email])
  return (
    <div>
      <label htmlFor='username'>Username: <input 
        name="username" 
        id='username'
        placeholder='johnyyy' 
        onChange={(e)=>{setUsername(e.target.value)}}
        type='text'
      /></label>
      <label htmlFor='email'>Email: <input 
        name="email" 
        id='email'
        placeholder='johnyyy@123mail.com' 
        onChange={(e)=>{setEmail(e.target.value)}}
        type='text'
      /></label>
      <label htmlFor='password'>Password: <input 
        name="password" 
        id='password'
        placeholder='johnyyy' 
        onChange={(e)=>{setPassword(e.target.value)}}
        type='password'
      /></label>
      <button onClick={signUp}>Submit</button>
    </div>
  )
}
