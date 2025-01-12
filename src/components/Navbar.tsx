import { useRef, useState } from "react";
import { FaUserCircle, FaLightbulb } from "react-icons/fa"; // Using Font Awesome icons

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  // window.onclick = (event) => {
  //   if (
  //     event.target &&
  //     dropdownRef.current &&
  //     !dropdownRef.current.contains(event.target as Node)
  //   ) {
  //     setIsDropdownOpen(false);
  //   }
  // };
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaLightbulb className="text-white text-2xl mr-2" />
        <span className="text-white text-xl font-bold">IdeaTracker</span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <FaUserCircle
          className="text-white text-3xl cursor-pointer"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
