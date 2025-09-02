import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Wallet, Trophy, User, Home } from "lucide-react";

// ...existing code...
const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/profile", label: "Profile", icon: User },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
  <nav className="fixed bottom-0 left-0 right-0 bg-black z-50 rounded-t-3xl" style={{height: 70, borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}>
      <div className="relative flex items-center justify-between px-2 py-2 h-full">
        {/* Left items */}
        <div className="flex flex-1 justify-evenly">
          <NavLink to="/" className={({isActive}) => `flex flex-col items-center text-center ${isActive ? 'text-red-600' : 'text-white'} w-16`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </NavLink>
          <NavLink to="/leaderboard" className={({isActive}) => `flex flex-col items-center text-center ${isActive ? 'text-red-600' : 'text-white'} w-16`}>
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-xs">Leaderboard</span>
          </NavLink>
        </div>
        {/* Center Bible button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-7">
          <NavLink to="/books" className={({isActive}) => `flex items-center justify-center rounded-full bg-white shadow-lg border-4 border-black w-16 h-16`} style={{zIndex: 2}}>
            <BookOpen className="w-7 h-7 text-black" />
          </NavLink>
        </div>
        {/* Right items */}
        <div className="flex flex-1 justify-evenly">
          <NavLink to="/wallet" className={({isActive}) => `flex flex-col items-center text-center ${isActive ? 'text-red-600' : 'text-white'} w-16`}>
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs">Wallet</span>
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center text-center ${isActive ? 'text-red-600' : 'text-white'} w-16`}>
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;