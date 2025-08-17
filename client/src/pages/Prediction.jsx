import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Prediction = () => {
  const [form, setForm] = useState({
    sex: '',
    age: '',
    address: '',
    famsize: '',
    Pstatus: '',
    Medu: '',
    Fedu: '',
    Mjob: '',
    Fjob: '',
    guardian: '',
    traveltime: '',
    studytime: '',
    failures: '',
    feespaid: '',
    ecactivities: '',
    internet: '',
    Ssupport: '',
    Gsupport: '',
    freetime: '',
    goout: '',
    health: '',
    absences: '',
    G1: '',
    G2: '',
  });

  const { prediction, setPrediction } = useContext(AppContext);
  // Reset prediction state to null on mount (reload)
  useEffect(() => {
    setPrediction(null);
    // eslint-disable-next-line
  }, []);
  const navigate = useNavigate();

  // Numeric fields
  const numberFields = [
    "age",
    "Medu", "Fedu",
    "traveltime", "studytime", "failures", "absences",
    "freetime", "goout", "health",
    "G1", "G2"
  ];

  // Slider ranges for each numeric field
  const sliderRanges = {
    age: { min: 15, max: 22 },
    Medu: { min: 0, max: 4 },
    Fedu: { min: 0, max: 4 },
    traveltime: { min: 1, max: 4 },
    studytime: { min: 1, max: 4 },
    failures: { min: 0, max: 3 },
    freetime: { min: 1, max: 5 },
    goout: { min: 1, max: 5 },
    health: { min: 1, max: 5 },
    absences: { min: 0, max: 50 },
    G1: { min: 0, max: 20 },
    G2: { min: 0, max: 20 }
  };

  // Checkbox fields 
  const checkboxFields = [
    "sex", "address", "famsize", "Pstatus",
    "Mjob", "Fjob", "guardian",
    "Ssupport", "Gsupport",
    "feespaid", "ecactivities", "internet"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (numberFields.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value)
      }));
    } else if (checkboxFields.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for empty values for number and checkbox fields
    for (const key of [...numberFields, ...checkboxFields]) {
      if (form[key] === "" || form[key] === null) {
        toast.error(`All fields must be filled`);
        return;
      }
      if (numberFields.includes(key)) {
        const { min, max } = sliderRanges[key];
        if (form[key] < min || form[key] > max) {
          toast.error(`${key} must be between ${min} and ${max}`);
          return;
        }
      }
    }

    navigate('/result');

    try {
      const response = await axios.post("http://localhost:5000/predict", form);
      setPrediction(response.data.predicted_G3);
    } catch (error) {
      console.error(
        "Prediction failed:",
        error.response?.data || error.message
      );
    }
  };


  return (
    <div>
      <div className='py-10'>
        <h1 className='text-4xl  font-bold text-center'>Enter Your Details</h1>
        <hr className='w-60 mx-auto my-4 border-2 border-black' />
      </div>

      {/* Show form only if prediction is not available */}
      {prediction === null && (
        <div className='max-w-2xl mx-auto border border-gray-300 p-6 rounded-lg shadow-lg'>
          <form onSubmit={handleSubmit}>
            {/* ...existing code... (all form fields and submit button) */}
            <h3 className='text-lg font-semibold py-4'>Demographic and Family Details : </h3>
            <div className="">
              <div className="flex flex-col gap-2 py-4">
                <label>Student’s gender: </label>
                <label><input type="checkbox" name="sex" value="M" checked={form.sex === "M"} onChange={handleChange} /> Male</label>
                <label><input type="checkbox" name="sex" value="F" checked={form.sex === "F"} onChange={handleChange} /> Female</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Student’s age (in years): {form.age}</label>
                <input
                  className='input-field'
                  type="range"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min={sliderRanges.age.min}
                  max={sliderRanges.age.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Student’s home address type: </label>
                <label><input type="checkbox" name="address" value="urban" checked={form.address === "urban"} onChange={handleChange} /> Urban</label>
                <label><input type="checkbox" name="address" value="rural" checked={form.address === "rural"} onChange={handleChange} /> Rural</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Family size: </label>
                <label><input type="checkbox" name="famsize" value="LE3" checked={form.famsize === "LE3"} onChange={handleChange} /> Less than or equal to 3</label>
                <label><input type="checkbox" name="famsize" value="GT3" checked={form.famsize === "GT3"} onChange={handleChange} /> Greater than 3</label>
              </div>

              <div className="flex flex-col gap-2 py-4">
                <label>Parent's cohabitation status: </label>
                <label><input type="checkbox" name="Pstatus" value="T" checked={form.Pstatus === "T"} onChange={handleChange} /> Living together</label>
                <label><input type="checkbox" name="Pstatus" value="A" checked={form.Pstatus === "A"} onChange={handleChange} /> Apart</label>
              </div>
            </div>

            <h3 className='text-lg font-semibold py-4'>Parental Background: </h3>
            <div className=''>
              <div className="flex flex-col gap-2 py-4">
                <label>Mother's education level: {form.Medu} (0 = none, 4 = higher)</label>
                <input
                  className='input-field'
                  type="range"
                  name="Medu"
                  value={form.Medu}
                  onChange={handleChange}
                  min={sliderRanges.Medu.min}
                  max={sliderRanges.Medu.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Father's education level: {form.Fedu} (0 = none, 4 = higher)</label>
                <input
                  className='input-field'
                  type="range"
                  name="Fedu"
                  value={form.Fedu}
                  onChange={handleChange}
                  min={sliderRanges.Fedu.min}
                  max={sliderRanges.Fedu.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Mother's Job: </label>
                <label><input type="checkbox" name="Mjob" value="teacher" checked={form.Mjob === "teacher"} onChange={handleChange} /> Teacher</label>
                <label><input type="checkbox" name="Mjob" value="health" checked={form.Mjob === "health"} onChange={handleChange} /> Health</label>
                <label><input type="checkbox" name="Mjob" value="services" checked={form.Mjob === "services"} onChange={handleChange} /> Services</label>
                <label><input type="checkbox" name="Mjob" value="at_home" checked={form.Mjob === "at_home"} onChange={handleChange} /> At Home</label>
                <label><input type="checkbox" name="Mjob" value="other" checked={form.Mjob === "other"} onChange={handleChange} /> Other</label>
              </div>

              <div className="flex flex-col gap-2 py-4">
                <label>Father's Job: </label>
                <label><input type="checkbox" name="Fjob" value="teacher" checked={form.Fjob === "teacher"} onChange={handleChange} /> Teacher</label>
                <label><input type="checkbox" name="Fjob" value="health" checked={form.Fjob === "health"} onChange={handleChange} /> Health</label>
                <label><input type="checkbox" name="Fjob" value="services" checked={form.Fjob === "services"} onChange={handleChange} /> Services</label>
                <label><input type="checkbox" name="Fjob" value="at_home" checked={form.Fjob === "at_home"} onChange={handleChange} /> At Home</label>
                <label><input type="checkbox" name="Fjob" value="other" checked={form.Fjob === "other"} onChange={handleChange} /> Other</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Student's Guardian: </label>
                <label><input type="checkbox" name="guardian" value="mother" checked={form.guardian === "mother"} onChange={handleChange} /> Mother</label>
                <label><input type="checkbox" name="guardian" value="father" checked={form.guardian === "father"} onChange={handleChange} /> Father</label>
                <label><input type="checkbox" name="guardian" value="other" checked={form.guardian === "other"} onChange={handleChange} /> Other</label>
              </div>
            </div>

            <h3 className='text-lg font-semibold py-4'>Academic Support and Study Habits: </h3>
            <div className=''>
              <div className="flex flex-col gap-2 py-4">
                <label>Travel time: {form.traveltime} (1 = &lt;15 min, 4 = &gt;1 hr)</label>
                <input
                  className='input-field'
                  type="range"
                  name="traveltime"
                  value={form.traveltime}
                  onChange={handleChange}
                  min={sliderRanges.traveltime.min}
                  max={sliderRanges.traveltime.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Weekly study time: {form.studytime} (1 = &lt;2 hrs, 4 = &gt;10 hrs)</label>
                <input
                  className='input-field'
                  type="range"
                  name="studytime"
                  value={form.studytime}
                  onChange={handleChange}
                  min={sliderRanges.studytime.min}
                  max={sliderRanges.studytime.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Number of past class failures: {form.failures}</label>
                <input
                  className='input-field'
                  type="range"
                  name="failures"
                  value={form.failures}
                  onChange={handleChange}
                  min={sliderRanges.failures.min}
                  max={sliderRanges.failures.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Extra tutoring provided by the family/guardian: </label>
                <label><input type="checkbox" name="Ssupport" value="1" checked={form.Ssupport === "1"} onChange={handleChange} /> Yes</label>
                <label><input type="checkbox" name="Ssupport" value="0" checked={form.Ssupport === "0"} onChange={handleChange} /> No</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Extra educational support at school: </label>
                <label><input type="checkbox" name="Gsupport" value="1" checked={form.Gsupport === "1"} onChange={handleChange} /> Yes</label>
                <label><input type="checkbox" name="Gsupport" value="0" checked={form.Gsupport === "0"} onChange={handleChange} /> No</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Number of absences in institute: {form.absences}</label>
                <input
                  className='input-field'
                  type="range"
                  name="absences"
                  value={form.absences}
                  onChange={handleChange}
                  min={sliderRanges.absences.min}
                  max={sliderRanges.absences.max}
                  required
                />
              </div>
            </div>

            <h3 className='text-lg font-semibold py-4'>Lifestyle and Access: </h3>
            <div className=''>
              <div className="flex flex-col gap-2 py-4">
                <label>Whether the student has paid school fees: </label>
                <label><input type="checkbox" name="feespaid" value="1" checked={form.feespaid === "1"} onChange={handleChange} /> Yes</label>
                <label><input type="checkbox" name="feespaid" value="0" checked={form.feespaid === "0"} onChange={handleChange} /> No</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Participation in extracurricular activities: </label>
                <label><input type="checkbox" name="ecactivities" value="1" checked={form.ecactivities === "1"} onChange={handleChange} /> Yes</label>
                <label><input type="checkbox" name="ecactivities" value="0" checked={form.ecactivities === "0"} onChange={handleChange} /> No</label>
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Internet access at home: </label>
                <label><input type="checkbox" name="internet" value="1" checked={form.internet === "1"} onChange={handleChange} /> Yes</label>
                <label><input type="checkbox" name="internet" value="0" checked={form.internet === "0"} onChange={handleChange} /> No</label>
              </div>
            </div>

            <h3 className='text-lg font-semibold py-4'>Social Time and Health: </h3>
            <div className=''>
              <div className="flex flex-col gap-2 py-4">
                <label>Free time after school: {form.freetime}</label>
                <input
                  className='input-field'
                  type="range"
                  name="freetime"
                  value={form.freetime}
                  onChange={handleChange}
                  min={sliderRanges.freetime.min}
                  max={sliderRanges.freetime.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Going out with friends: {form.goout}</label>
                <input
                  className='input-field'
                  type="range"
                  name="goout"
                  value={form.goout}
                  onChange={handleChange}
                  min={sliderRanges.goout.min}
                  max={sliderRanges.goout.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Current health status: {form.health}</label>
                <input
                  className='input-field'
                  type="range"
                  name="health"
                  value={form.health}
                  onChange={handleChange}
                  min={sliderRanges.health.min}
                  max={sliderRanges.health.max}
                  required
                />
              </div>
            </div>

            <h3 className='text-lg font-semibold py-4'>Previous Academic Performance: </h3>
            <div className=''>
              <div className="flex flex-col gap-2 py-4">
                <label>First period grade: {form.G1}</label>
                <input
                  className='input-field'
                  type="range"
                  name="G1"
                  value={form.G1}
                  onChange={handleChange}
                  min={sliderRanges.G1.min}
                  max={sliderRanges.G1.max}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 py-4">
                <label>Second period grade: {form.G2}</label>
                <input
                  className='input-field'
                  type="range"
                  name="G2"
                  value={form.G2}
                  onChange={handleChange}
                  min={sliderRanges.G2.min}
                  max={sliderRanges.G2.max}
                  required
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className='mt-4 flex justify-center'>
              <button onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' });}} className='bg-primary w-[60vw] text-white px-10 py-2 rounded-xl mb-5' type="submit">
                Predict
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Prediction;
