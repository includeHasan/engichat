"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { AcademicCapIcon, ChatIcon, ClockIcon } from '@heroicons/react/outline'; // Import Heroicons for feature icons

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [collegeCourseName, setCollegeCourseName] = useState('');
  const [university, setUniversity] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0); // For slideshow animation
  const router = useRouter();

  // Handle switching between login/signup
  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setIsOtpStep(false); // Reset OTP step when switching
    resetFields(); // Reset input fields
  };

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCollegeCourseName('');
    setUniversity('');
    setOtp('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      router.push('/chat');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, collegeCourseName, university }),
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      toast.success(data.message);
      setIsOtpStep(true); // Move to OTP step after successful signup
    } catch (error) {
      console.error(error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    // Add your OTP verification logic here
    toast.success('OTP verified successfully!');
    // Continue to next step (e.g., navigate to another page or show a success message)
  };

  // Auto-switching slideshow for features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prevFeature) => (prevFeature + 1) % featureData.length);
    }, 3000); // Rotate features every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const featureData = [
    {
      icon: <AcademicCapIcon className="h-10 w-10 text-indigo-500" />,
      title: 'AI-Powered Assistance',
      description: 'Get instant help with your college studies using our AI assistant, designed for students.',
    },
    {
      icon: <ChatIcon className="h-10 w-10 text-indigo-500" />,
      title: '24/7 Chat Support',
      description: 'Connect with an academic bot any time of the day for guidance and advice on coursework.',
    },
    {
      icon: <ClockIcon className="h-10 w-10 text-indigo-500" />, // You can replace this with any other icon if desired
      title: 'Customizable Responses',
      description: 'Tailor the responses you receive from our bot to fit your specific needs and preferences.',
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Academia Bot
        </h2>
        <p className="mt-2 text-center text-sm text-indigo-200">
          Your AI-powered academic assistant
        </p>
      </div>

      {/* Feature Slideshow */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md text-white">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fade-in">
          {featureData[currentFeature].icon}
          <h3 className="mt-4 text-xl font-semibold text-indigo-600">{featureData[currentFeature].title}</h3>
          <p className="mt-2 text-sm text-gray-600">{featureData[currentFeature].description}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isOtpStep ? (
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify OTP</h1>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isLogin ? 'Login' : 'Signup'}
              </h1>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="collegeCourseName" className="block text-sm font-medium text-gray-700">
                      College Course Name
                    </label>
                    <input
                      type="text"
                      id="collegeCourseName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={collegeCourseName}
                      onChange={(e) => setCollegeCourseName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                      University
                    </label>
                    <input
                      type="text"
                      id="university"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? 'Login' : 'Signup'}
              </button>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button type="button" onClick={handleSwitch} className="font-medium text-indigo-600 hover:text-indigo-500">
                    {isLogin ? 'Create an account' : 'Already have an account?'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
