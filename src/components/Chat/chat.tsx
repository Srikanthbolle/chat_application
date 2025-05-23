import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import React from 'react'

type chatProps = {}

export default function Chat({}: chatProps) {
  return (
    <div>Chat
      <Button onClick={()=>signOut()} variant='contained'>Log Out</Button>
    </div>
  )
}