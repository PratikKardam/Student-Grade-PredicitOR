import React, { useEffect } from 'react'
import { useContext } from 'react'
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const { prediction,setPrediction } = useContext(AppContext);

  const navigate = useNavigate();

    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className='max-w-2xl w-full border border-gray-300 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mt-10 mb-10'>
            <h3 className='text-lg font-semibold text-center py-7'>Your Final Grade Will Be : {prediction}</h3>
            <button onClick={() => {
              setPrediction(null);
              navigate('/predict');
            }} className='bg-primary hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-md'>Predict Again</button>
          </div>
        </div>
      </div>
    )
}

export default Result
