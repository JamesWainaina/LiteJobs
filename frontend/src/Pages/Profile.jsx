import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { app } from '../firebase/firebase.config'; // Ensure your firebase config is correctly imported

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        console.log("Current user", currentUser);
        if (currentUser) {
          // Assuming you might fetch additional backend data
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`);

          const data = await response.json();
          
          console.log("User data fecthed from the backend", data);
          if (response.ok) {
            setUser({ ...currentUser, ...data });
          } else {
            setError('Error fetching user data from backend');
          }
        } else {
          setError('No user logged in');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <img
              src={user.profilePic || '/default-avatar.png'}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full mr-6"
            />
            <div>
              <h2 className="text-2xl font-semibold">{user.displayName || 'User'}</h2>
              <p className="text-gray-600">{user.email}</p>
              {/* Optional additional data */}
              <p className="text-gray-500 mt-2">Joined: {user.joinDate || 'N/A'}</p>
            </div>
          </div>

          {/* Option to edit profile (if needed) */}
          <div className="mt-8">
            <Link to="/edit-profile" className="py-2 px-4 bg-blue-500 text-white rounded">
              Edit Profile
            </Link>
          </div>
        </div>
      ) : (
        <div>No user data found</div>
      )}
    </div>
  );
};

export default Profile;

