'use client'

import Image from 'next/image'
import React from 'react'
// import useActiveList from '../hooks/useActiveList'

interface AvaterProps{
    src: string
}

const Avater: React.FC<AvaterProps> = ({
    src
}) => {
  // const {members} = useActiveList()
  // const isActive = members.indexOf(user?.email!) !== -1
  return (
    <div className='relative'>
        <div className='
        relative
        overflow-hidden
        h-6
        w-6
        md:h-8
        md:w-8
        rounded-lg
        cursor-pointer
        '>
          <Image fill src={src} alt='user' />    
        </div>
    </div>
  )
}

export default Avater