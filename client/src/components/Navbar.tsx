import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Gallery', path: '/gallery' },
        
    ];

    return (
        <nav className="bg-white/80 shadow-lg py-4">
            <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo/Brand Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl  text-gray-800">
                            WELLWALLED HABITAT
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                // Simple active style check (requires useLocation for proper highlighting, but this is a start)
                                className={`text-grey-800 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium 
                                    ${location.pathname === item.path ? 'border-white' : 'border-transparent hover:border-gray-300'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;