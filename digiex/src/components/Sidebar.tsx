import { useState, type JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiGift, FiBriefcase, FiSettings, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = ()=> {
    navigate("/login");
  }

  return (
    <div
      className={`h-screen bg-white border-r transition-all duration-300 ease-in-out ${
        isHovered ? "w-64" : "w-20"
      } flex flex-col justify-between`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        <span className="text-purple-700 font-bold text-xl">TalentX</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-2">
        <NavItem icon={<FiUsers />} label="Talents" to="/dashboard" isHovered={isHovered} />
        <NavItem icon={<FiGift />} label="Clients" to="/clients" isHovered={isHovered} />
        <NavItem icon={<FiBriefcase />} label="Resellers" to="/resellers" isHovered={isHovered} />
        <NavItem icon={<FiSettings />} label="Settings" to="/settings" isHovered={isHovered} />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">KT</div>
          {isHovered && (
            <div>
              <div className="font-medium">khoa tran</div>
              <div className="text-xs text-gray-500">khoa.tran@yopmail.com</div>
              <button onClick={handleLogOut} className="mt-2 flex items-center text-purple-600 hover:underline">
                <FiLogOut className="mr-1" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  to,
  isHovered,
}: {
  icon: JSX.Element;
  label: string;
  to: string;
  isHovered: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {isHovered && <span className="ml-3 text-sm font-medium">{label}</span>}
    </NavLink>
  );
}
