import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, Users, FileText, Images, BookOpen, MessageSquare, LogIn, LogOut, Settings, Award } from 'lucide-react';

const ModernNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();

  const publicNavItems = [
    { to: '/', label: 'Home', icon: Users },
    { to: '/articles', label: 'Articles', icon: FileText },
    { to: '/gallery', label: 'Gallery', icon: Images },
    { to: '/resources', label: 'Resources', icon: BookOpen },
    { to: '/community', label: 'Community Voice', icon: MessageSquare },
    { to: '/leadership', label: 'Leadership', icon: Award },
  ];

  const staffNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Settings },
    { to: '/cms', label: 'CMS', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dwhp5xrhn/image/upload/v1750059557/haki-yetu-pages-logo_zrunra.jpg"
              alt="Haki Yetu Logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="text-white font-bold text-xl">Haki Yetu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.to)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Staff Navigation */}
            {user && (userRole === 'admin' || userRole === 'staff') && (
              <>
                <div className="w-px h-6 bg-white/20 mx-2" />
                {staffNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        isActive(item.to)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm">
                  Welcome, <span className="text-green-400 font-medium">{user.email}</span>
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/50 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Staff Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="space-y-2">
              {publicNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      isActive(item.to)
                        ? 'bg-green-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Staff Navigation Mobile */}
              {user && (userRole === 'admin' || userRole === 'staff') && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  {staffNavItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                          isActive(item.to)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              <div className="border-t border-white/10 mt-4 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-gray-300 text-sm">
                      Signed in as <span className="text-green-400 font-medium">{user.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Staff Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNav;
