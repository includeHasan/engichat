import Link from 'next/link'; // Use next/link instead of next/navigation
import { useRouter } from 'next/navigation'; // For programmatic navigation after logout
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Logout function to clear the token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token
    setIsLoggedIn(false);
    router.push('/');  // Redirect to login page after logout
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/chat">
          <h1 className="text-white font-bold text-xl">ACADEMIA ASSIST</h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <h1 className="text-white hover:underline">Profile</h1>
          </Link>

          {/* Show logout button if logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-white hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
