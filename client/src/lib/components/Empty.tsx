import React from 'react'
import NoDataImage from '../images/empty.png'


type Props = {
    message: string
    width?: string
}

const Empty = ({message,width}: Props) => {
  return (
    <div className={`${width ?? 'w-1/2'} flex flex-col justify-center items-center gap-y-5`}>
        <img src={NoDataImage} alt='No data' className='w-1/2 h-1/2' />
        <p className='text-lg text-gray-600'>{message}</p>
    </div>
  )
}

export default Empty