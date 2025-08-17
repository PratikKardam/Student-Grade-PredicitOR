import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()


  return (
    <div className='bg-primary sm:mt-16 text-white min-h-screen rounded-lg flex flex-col-reverse md:flex-row items-center justify-center px-4 sm:px-8 md:px-16 py-8 gap-8'>
      {/* Image section */}
      <div className='w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0'>
        <img 
          src={assets.students} 
          alt="Students" 
          className='w-4/5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain drop-shadow-lg' 
        />
      </div>
      {/* Text section */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-start md:pl-10'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight'>Welcome to GradeWise</h1>
        <h2 className='text-xl sm:text-2xl md:text-3xl mb-4'>Predict Your Success</h2>
        <p className='text-base sm:text-lg md:text-xl mb-2'>
          Simply enter your study details and get accurate grade predictions. Track your progress, improve performance, and plan your academic journey with ease.
        </p>
        <button 
          onClick={() => navigate('/predict')} 
          className='bg-white text-[#606cfc] font-bold w-full sm:w-fit my-4 py-3 px-4 rounded-lg hover:cursor-pointer hover:scale-105 transition-all duration-200 shadow-md'
        >
          Make Prediction
        </button>
      </div>
    </div>
  )
}

export default Hero
