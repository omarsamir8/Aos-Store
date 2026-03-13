'use client'
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
export default function Navbar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);
  // const token = Cookies.get("token");
  return (
    <nav className="bg-blue-50 text-black px-6 py-4 flex items-center justify-between">
      
      
      <div className="text-xl font-bold">
        Aos Store
      </div>

      
      <div className="hidden md:flex gap-6">
        <a href="/" className="hover:text-gray-300">Home</a>
        <a href="/RegisterationPage" className="hover:text-gray-300">Register</a>
        <a href="/LoginPage" className="hover:text-gray-300">Login</a>
        <a href="/admindashboard" className="hover:text-gray-300">Dashboard</a>
      </div>

      <div className="flex items-center gap-4 font-bold">
       <h5>Welcom {user?user.name:null}</h5>
      </div>

    </nav>
  );
}