import {React,useState} from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between text-sm py-4 border-b border-gray-200 px-10'>
      <img onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className='w-44 cursor-pointer' src={assets.sgp_logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'>
          {({ isActive }) => (
            <li
              className='flex flex-col font-semibold items-center cursor-pointer'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              HOME
              <hr
                className={`border-none outline-none h-0.5 w-3/5 m-auto mt-1 ${isActive ? '' : 'hidden'}`}
                style={isActive ? { backgroundColor: '#606cfc' } : {}}
              />
            </li>
          )}
        </NavLink>
        <NavLink to='/predict'>
          {({ isActive }) => (
            <li
              className='flex flex-col font-semibold items-center cursor-pointer'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              PREDICTION
              <hr
                className={`border-none outline-none h-0.5 w-3/5 m-auto mt-1 ${isActive ? '' : 'hidden'}`}
                style={isActive ? { backgroundColor: '#606cfc' } : {}}
              />
            </li>
          )}
        </NavLink>
      </ul>
    </div>
  )
      
      
}

export default Navbar
