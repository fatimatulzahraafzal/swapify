import { Link } from 'react-router-dom'; // New in L3: For SPA navigation without reload
import logo from '../assets/logo.png';

function Navbar({ className = '', isLoggedIn, onLogout, onLoginClick }) { // Updated in L3: Added props for conditional UI
  return (
    <nav className={`bg-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-50 ${className}`}> 
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Swapify Logo" className="h-8 mr-2" />
          {/*Updated in L3: Use Link for URL path-based navigation*/}
          <Link to="/" className="text-2xl font-bold">Swapify</Link> 
        </div>
        <div className="flex items-center gap-6">
          {/* New in L3: Wrapper for buttons */}
          {isLoggedIn ? ( // New in L3: Conditional for role-based view (owner vs visitor)
            <button
              onClick={onLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Owner Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;