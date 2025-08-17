import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Prediction from './pages/Prediction';
import Navbar from './components/Navbar';
 import { ToastContainer, toast } from 'react-toastify';
import Footer from './components/Footer';
import Hero from './pages/Hero';
import Result from './pages/Result';

const App = () => {
  return (
    <div className='sm:mx-10 md:mx-20 mx-5'>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/predict" element={<Prediction />} />
        <Route path="/result" element={<Result />} />
      </Routes>
      <Footer className="absolute bottom-0 left-0 right-0" />
    </div>
  )
}

export default App
