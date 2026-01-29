import { Shield, Trophy, User } from "lucide-react";
import logoImg from "../assets/logo.png";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const navItems = [
    {
      id: "teams",
      label: "Times",
      icon: Shield,
      theme: {
        activeText: "text-blue-500",
        activeIcon: "text-blue-400",
        activeShadow: "shadow-blue-900/20",
      },
    },
    {
      id: "players",
      label: "Jogadores",
      icon: User,
      theme: {
        activeText: "text-emerald-500",
        activeIcon: "text-emerald-400",
        activeShadow: "shadow-emerald-900/20",
      },
    },
    {
      id: "tournaments",
      label: "Torneios",
      icon: Trophy,
      theme: {
        activeText: "text-amber-500",
        activeIcon: "text-amber-400",
        activeShadow: "shadow-amber-900/20",
      },
    },
  ];

  return (
    <nav className="border-b border-slate-800 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
        <div className="flex items-center gap-2 cursor-pointer " onClick={() => onNavigate("teams")}>
          <img src={logoImg} alt="Logo" className="h-16 w-16" />
          <span className="text-xl font-bold text-white tracking-tight">
            Torneio<span className="text-blue-600">Manager</span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-500 cursor-pointer
                            ${
                              isActive
                                ? `bg-slate-800 ${item.theme.activeText} shadow-lg ${item.theme.activeShadow} ring-1 ring-slate-700`
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }
                        `}
              >
                <Icon size={18} className={isActive ? item.theme.activeIcon : "text-slate-500"} />
                {item.label}
              </button>
            );
          })}
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
