import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-fintech-card border-b border-fintech-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          className="p-2 mr-2 text-fintech-textMuted hover:text-fintech-text hover:bg-fintech-dark rounded-lg lg:hidden transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-fintech-text hidden sm:block">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-fintech-textMuted hover:text-fintech-text hover:bg-fintech-dark rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fintech-green rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fintech-green to-blue-500 p-0.5">
            <div className="w-full h-full bg-fintech-card rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-fintech-text">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
