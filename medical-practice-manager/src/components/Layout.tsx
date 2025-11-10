import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Moon,
  Sun,
  Menu,
  X,
  UserPlus,
  Stethoscope,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onNewPatient: () => void;
  onNewVisit: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onNewPatient,
  onNewVisit,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Patients', icon: Users, page: 'patients' },
    { name: 'Templates', icon: FileText, page: 'templates' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Stethoscope className="text-primary-600 dark:text-primary-500" size={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  MedPractice
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Patient Management
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
            <Button
              variant="primary"
              className="w-full justify-start"
              size="sm"
              onClick={onNewPatient}
            >
              <UserPlus size={16} className="mr-2" />
              New Patient
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              size="sm"
              onClick={onNewVisit}
            >
              <FileText size={16} className="mr-2" />
              New Visit
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.page)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
              Keyboard Shortcuts:
            </p>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>New Patient</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                  Ctrl+N
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>New Visit</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                  Ctrl+V
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Search</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                  Ctrl+F
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
