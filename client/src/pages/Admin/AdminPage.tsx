import React, { useState } from 'react';
import AdminProjectForm from '../Admin/AdminUploadForm';
import AdminBannerForm from '../Admin/AdminBannerForm';
import CategoriesPage from '../Admin/CategoriesPage'; // ⬅️ Add the new import
import AdminItemsPage from './AdminItemsPage';

type AdminView = 'projects' | 'banner' | 'categories'| 'items';

const AdminPage: React.FC = () => {
    const [currentView, setCurrentView] = useState<AdminView>('projects');

    const renderContent = () => {
        switch (currentView) {
            case 'projects':
                return <AdminProjectForm />;
            case 'banner':
                return <AdminBannerForm />;
            case 'categories':
                return <CategoriesPage />; // ⬅️ Show categories UI
            case "items":
                return <AdminItemsPage />;

            default:
                return <AdminProjectForm />;
        }
    };

    const NavButton: React.FC<{ view: AdminView; label: string }> = ({ view, label }) => (
        <button
            onClick={() => setCurrentView(view)}
            className={`
                w-full text-left py-3 px-4 font-semibold text-lg transition duration-200
                ${currentView === view
                    ? 'bg-indigo-600 text-white shadow-md rounded-lg'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md'
                }
            `}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl p-6 h-screen sticky top-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
                    🛠️ Admin Panel
                </h2>
                <nav className="space-y-3">
                    <NavButton view="projects" label="Projects" />
                    <NavButton view="banner" label="Homepage Banner" />
                    <NavButton view="categories" label="Product Categories" /> {/* ⬅️ Add Button */}
                    <NavButton view="items" label="Products" />

                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto py-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
