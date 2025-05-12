import React, { useState } from 'react';
import loginImg from "../../../assets/loginImg.png";
import { useNavigate, useLocation } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:3000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
  
      const data = await response.json();
      
      // Store both user data AND token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // Add this line
      
      // Redirect to the page they were trying to access or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
  
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">Welcome Back!</h3>
                <p className="text-slate-500 text-sm mt-6 leading-relaxed">Sign in to your account and continue your journey.</p>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[#885B3A]" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-[#885B3A]" 
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-[#885B3A] focus:ring-[#885B3A] border-slate-300 rounded" />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="javascript:void(0);" className="text-[#885B3A] hover:underline font-medium">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="!mt-12">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[#885B3A] hover:bg-[#774A2A] focus:outline-none hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign in'}
                </button>
                <p className="text-sm !mt-6 text-center text-slate-500">Don't have an account <span onClick={handleSignUp} className="text-[#885B3A] font-medium hover:underline ml-1 whitespace-nowrap hover:cursor-pointer">Register here</span></p>
              </div>
            </form>
          </div>

          <div className="max-md:mt-8">
            <img src={loginImg} className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover" alt="login img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;