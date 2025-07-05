"use client";
import { User, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setMenuOpen(false);
      setUserMenuOpen(false);
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Handle menu clicks without closing immediately
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    router.push("/");
  };

  return (
    <header className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
            quality={100}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/pages/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/pages/client" className="hover:underline">
            Clients
          </Link>
          <Link href="/pages/furniture" className="hover:underline">
            Furniture
          </Link>
          <Link href="/pages/report" className="hover:underline">
            Report
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* User Profile Section */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleUserMenuToggle}
            >
              <User className="w-6 h-6" />
              <span className="hidden sm:inline font-medium">
                {user ? user.name : "Guest"}
              </span>
            </div>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  Signed in as <br />
                  <span className="font-medium text-white">{user?.email}</span>
                </div>

                <Link
                  href="/pages/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Your Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign out</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={handleMenuToggle}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col bg-gray-700 p-4 mt-2 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/pages/dashboard" className="py-2 hover:underline">
            Dashboard
          </Link>
          <Link href="/pages/client" className="py-2 hover:underline">
            Clients
          </Link>
          <Link href="/pages/furniture" className="py-2 hover:underline">
            Furniture
          </Link>
          <Link href="/pages/report" className="py-2 hover:underline">
            Report
          </Link>

          {/* Mobile Logout Option */}
          <button
            onClick={handleLogout}
            className="text-left py-2 hover:underline flex items-center text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
