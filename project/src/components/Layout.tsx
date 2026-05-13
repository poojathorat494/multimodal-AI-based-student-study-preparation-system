import React, { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, BookOpen, User, BarChart2, Menu, X,FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavItem = ({ to, icon, label }: { to: string; icon: ReactNode; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-primary-500 text-white font-medium'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="bg-primary-500 text-white p-2 rounded-lg">
            <MessageSquare size={24} />
          </div>
          <h1 className="font-semibold text-xl text-gray-800">PlaceAssist</h1>
        </div>
        
        <nav className="mt-8 flex flex-col gap-2">
          <NavItem to="/" icon={<MessageSquare size={20} />} label="Chat" />
          <NavItem to="/resources" icon={<BookOpen size={20} />} label="Resources" />
          <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
          <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
          <NavItem to="/quiz" icon={<FileText size={20} />} label="Quiz" />
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h1 className="font-semibold text-lg text-gray-800">PlaceAssist</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 pt-16 bg-white"
          >
            <nav className="flex flex-col gap-2 p-4">
              <NavItem to="/" icon={<MessageSquare size={20} />} label="Chat" />
              <NavItem to="/resources" icon={<BookOpen size={20} />} label="Resources" />
              <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
              <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
              <NavItem to="/quiz" icon={<FileText size={20} />} label="Quiz" />

            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pt-0 pt-16">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;