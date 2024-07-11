'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react'
function page() {
  const [loginDetails, setLoginDetails] = useState({})
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter();
  const login = async () => {
    try {
      const res = await axios.post("/api/users/login", loginDetails);
      if(res.data?.success){
        router.push('/profile')
      }
      else {
        console.log("wrong login details")
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  useEffect(()=>{
    setLoginDetails({
      email,
      password
    })

  },[email, password])

  return (
    <div>
      <div>
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
      <button onClick={login}>Submit</button>
    </div>
    </div>
  )
}

export default page
