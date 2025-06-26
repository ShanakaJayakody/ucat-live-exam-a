import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineMail, MdLockOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

// Fix for TypeScript type issue with react-icons
const MailIcon = MdOutlineMail as React.ElementType;
const LockIcon = MdLockOutline as React.ElementType;
const ArrowIcon = FaArrowRight as React.ElementType;
const GoogleIcon = FcGoogle as React.ElementType;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/exam');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/exam');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
            <img 
                src="https://ik.imagekit.io/mwp/MWP%20Color%20no%20background.png?updatedAt=1745982959141" 
                alt="MedwithPurpose Logo" 
                className="w-32 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
                {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 mt-2">
                {isSignUp ? 'Get started with your UCAT prep.' : 'Log in to access your UCAT prep.'}
            </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="relative">
              <MailIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
                <LockIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                />
            </div>
            
            {!isSignUp && (
                <div className="text-right">
                    <button type="button" className="text-sm text-blue-600 hover:underline font-medium">
                        Forgot Password?
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all font-semibold flex items-center justify-center"
            >
                {isSignUp ? 'Create Account' : 'Login'}
                {!isSignUp && <ArrowIcon className="ml-2" />}
            </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all font-medium flex items-center justify-center"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isSignUp ? 'Login' : 'Create Account'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login; 