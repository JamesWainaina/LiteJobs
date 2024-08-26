import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase/firebase.config';// Ensure this imports correctly
import { Link } from 'react-router-dom';



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate programmatically

  const auth = getAuth();

 const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccessMessage('');

  // Validate password and confirm password
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user object to send to your server
    const userData = {
      email,
      username,
      password,
      profilePic: profilePic ? URL.createObjectURL(profilePic) : ''
    };

    // Send user data to your server
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (response.ok) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after 2 seconds
      }, 2000);
    } else {
      setError(result.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl mb-4 text-center'>Register</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {successMessage && <p className='text-green-500 mb-4'>{successMessage}</p>}
        <form onSubmit={handleRegister}>
          <div className='mb-4'>
            <label className='block mb-2'>Username</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              placeholder='Enter your username'
              required
            />
          </div>
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
          <div className='mb-4'>
            <label className='block mb-2'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              placeholder='Confirm your password'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Profile Picture</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setProfilePic(e.target.files[0])}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p>Already have an account?</p>
          <Link
            to='/login'
            className='text-blue hover:underline'
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
