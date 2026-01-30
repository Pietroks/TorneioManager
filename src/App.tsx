import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { TeamList } from "./components/TeamList";
import { PlayerList } from "./components/PlayerList";
import { TournamentList } from "./components/TournamentList";

function App() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      <Navbar />

      <main className="fade-in">
        <Routes>
          <Route path="/" element={<Navigate to="/tournaments" replace />} />

          <Route path="/teams" element={<TeamList />} />
          <Route path="/players" element={<PlayerList />} />

          <Route path="/tournaments" element={<TournamentList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
