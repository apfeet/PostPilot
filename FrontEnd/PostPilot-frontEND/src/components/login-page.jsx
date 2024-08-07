import React from 'react'
import LOGO from '../assets/LOGO.webp'


const LoginPage = () => {
  return (
    <div className='bg-costom-grey h-screen flex items-center justify-center relative '>
      <div className='absolute top-0 left-0 p-5'>
        <img src={LOGO} alt="PostPilot" className='w-16 rounded' />
      </div>
      <div className=' p-10 rounded shadow-lg '>
        <span className='text-5xl text-white font-bold'>First Time</span> &nbsp; <span className='opacity-75 text-5xl text-white font-medium'>Here ?</span>
        <div className='mb-1'>
          <label htmlFor='username' className='block text-gray-700'>Username</label>
          <input id='username' type='text' className='w-full p-3 border  rounded mt-1 text-black opacity-90 bg-costom-cyan' placeholder='Email' />
        </div>
        <div className='mb-6'>
          <label htmlFor='password' className='block text-gray-700'>Password</label>
          <input id='password' type='password' className='w-full p-3 border border-gray-300 rounded bg-costom-cyan' placeholder='Password' />
        </div>
        <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700'>Login</button>
        <div className='mt-4 text-gray-700 text-sm'>
        </div>
      </div>
    </div>
  )
}

export default LoginPage