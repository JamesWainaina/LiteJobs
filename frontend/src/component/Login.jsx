import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom'; 
import { app } from '../firebase/firebase.config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      console.log(token);
      // Navigate to the homepage with the user's ID
      navigate(`/home?userId=${user.uid}`, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      
      // Navigate to the homepage with the user's ID
      navigate(`/home?userId=${user.uid}`, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl mb-4'>Login</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleEmailPasswordLogin}>
          <div className='mb-4'>
            <label className='block mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              placeholder='Enter your password'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='my-4 text-center'>or</div>

        <button
          onClick={handleGoogleLogin}
          className='w-full bg-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
          disabled={loading}
        >
          {loading ? 'Logging in with Google...' : 'Login with Google'}
        </button>

        <div className='mt-4 text-center'>
          <p>Don't have an account?</p>
          <Link
            to='/sign up'
            className='text-blue hover:underline'
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
