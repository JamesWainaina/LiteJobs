import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase/firebase.config'; // Ensure this imports correctly

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: "/", title: "Start a search" },
    { path: "/my-job", title: "My Jobs" },
    { path: "/salary", title: "Salary Estimate" },
    { path: "/post-job", title: "Post a Job" }
  ];

  return (
    <header className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
      <nav className='flex justify-between items-center py-6'>
        <a href="/" className='flex items-center gap-2 text-2xl'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="30"
            viewBox="0 0 29 30"
            fill="none"
          >
            <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
          </svg>
          <span> Job Portal</span>
        </a>

        <ul className='hidden md:flex gap-12'>
          {navItems.map(({ path, title }) => (
            <li key={path} className='text-base text-primary'>
              <NavLink
                to={path}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                {title}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth buttons or user profile */}
        <div className='text-base text-primary font-medium space-x-5 hidden lg:flex items-center'>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName}
                className='w-10 h-10 rounded-full'
              />
              <span>{user.displayName}</span>
              <button onClick={handleLogout} className='py-2 px-5 border rounded bg-blue text-white'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 border rounded">Login</Link>
              <Link to="/sign up" className='py-2 px-5 border rounded bg-blue text-white'>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className='md:hidden block'>
          <button onClick={handleMenuToggle}>
            {isMenuOpen ? <FaXmark className='w-5 h-5 text-primary' /> :
             <FaBarsStaggered className='w-5 h-5 text-primary' />}
          </button>
        </div>
      </nav>

      {/* Mobile navItems */}
      <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {navItems.map(({ path, title }) => (
            <li key={path} className='text-base text-white py-1'>
              <NavLink
                to={path}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                {title}
              </NavLink>
            </li>
          ))}
          {loading ? (
            <li className='text-white py-1'>Loading...</li>
          ) : user ? (
            <>
              <li className='text-white py-1'>
                <Link to="/profile">Profile</Link>
              </li>
              <li className='text-white py-1'>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className='text-white py-1'>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
