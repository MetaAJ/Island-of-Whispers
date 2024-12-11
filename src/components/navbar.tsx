'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {

    const {data: session} = useSession()

    const user: User = session?.user

    return (
        <nav className='p-4 shadow-md bg-gradient-to-r from-black via-gray-900 to-black text-white'>
            <div className='container mx-auto flex justify-between items-center'>
                <a className="text-2xl font-extrabold" href="#" aria-label="Home">
                    Island of Whispers
                </a>
                {
                    session ? (
                        <>
                        <span className='mr-4 font-extrabold text-pretty font-mono'>Howdy, {user.username || user.email}😄 </span>
                        <Button className='w-full md:w-auto bg-slate-100 text-black hover:bg-slate-300' onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto bg-slate-100 text-black hover:bg-slate-300' variant={'outline'}>Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
  )
}

export default Navbar;