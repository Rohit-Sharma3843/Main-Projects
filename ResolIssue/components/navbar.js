"use client";
import Link from 'next/link'
import Image from 'next/image';
import { useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { 
  Menu, 
  X,
  AlertCircle,
  Flag,
  PlusCircle,
  ListChecks,
  User,
  BarChart3
} from 'lucide-react';

const Navbar = async() => {
  const { isAuthenticated, user } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);
  const auth=await isAuthenticated();
  const menuItems = [
    { href: "/issue", label: "Issues", icon: Flag },
    { href: "/issue/create", label: "Raise an Issue", icon: PlusCircle },
    { href: "/issue/my", label: "My Issues", icon: ListChecks },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                IssueTracker
              </span>
            </div>
            <div className="flex items-center gap-3">
              {auth && user && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.given_name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {user.given_name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {auth && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors md:hidden"
                >
                  {isOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              {auth && (
                <div className="hidden md:flex items-center gap-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isOpen && auth && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 border-l border-gray-800 z-40 md:hidden overflow-y-auto">
            {user && (
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.given_name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {user.given_name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {user.given_name} {user.family_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
      <div className="h-16" />
    </>
  );
};

export default Navbar;