import { Shield, Trophy, User } from "lucide-react";
import logoImg from "../assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      path: "/teams",
      label: "Times",
      icon: Shield,
      activeClass: "text-blue-500 bg-slate-800 shadow-lg shadow-blue-900/20 ring-1 ring-slate-700",
    },
    {
      path: "/players",
      label: "Jogadores",
      icon: User,
      activeClass: "text-emerald-500 bg-slate-800 shadow-lg shadow-emerald-900/20 ring-1 ring-slate-700",
    },
    {
      path: "/tournaments",
      label: "Torneios",
      icon: Trophy,
      isActive: (path: string) => location.pathname.startsWith(path),
      activeClass: "text-amber-500 bg-slate-800 shadow-lg shadow-amber-900/20 ring-1 ring-slate-700",
    },
  ];

  return (
    <nav className="border-b border-slate-800 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
        <NavLink to={"/"} className="flex items-center gap-2 cursor-pointer ">
          <img src={logoImg} alt="Logo" className="h-16 w-16" />
          <span className="text-xl font-bold text-white tracking-tight">
            Torneio<span className="text-blue-600">Manager</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                const active = isActive || (item.isActive && item.isActive(item.path));
                return `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-500 ${active ? item.activeClass : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`;
              }}
            >
              {({ isActive }) => {
                const active = isActive || (item.isActive && item.isActive(item.path));
                return (
                  <>
                    <item.icon size={18} className={active ? "currentColor" : "text-slate-500"} />
                    {item.label}
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-600 border-2 border-[#0b1120] ring-1 ring-slate-700"></div>
          <div className="text-sm">
            <p className="text-white font-medium leading-none">Admin</p>
            <p className="text-slate-500 text-xs mt-0.5">Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
