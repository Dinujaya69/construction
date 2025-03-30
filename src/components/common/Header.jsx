"use client";
import { User, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
            className="  object-contain"
            priority
            quality={100}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/pages/client" className="hover:underline">
            Clients
          </Link>
          <Link href="/pages/furniture" className="hover:underline">
            Furniture
          </Link>
          <Link href="#" className="hover:underline">
            Report
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/" className="py-2 hover:underline">
            
            <User className="w-6 h-6 cursor-pointer" />
          </Link>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col bg-gray-700 p-4 mt-2 rounded-lg">
          <Link href="#" className="py-2 hover:underline">
            Dashboard
          </Link>
          <Link href="#" className="py-2 hover:underline">
            Clients
          </Link>
          <Link href="#" className="py-2 hover:underline">
            Furniture
          </Link>
          <Link href="#" className="py-2 hover:underline">
            Report
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
