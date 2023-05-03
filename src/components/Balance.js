import React, { useState } from 'react'

const Balance = () => {
    const[balance,setBalance]=useState(10000)


  return (
    <div className='balance'>
        Balance = {balance}
    </div>
    )
} 

export default Balance
