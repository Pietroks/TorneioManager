import { useState } from "react";
import { TeamList } from "./components/TeamList";
import { Navbar } from "./components/Navbar";
import { PlayerList } from "./components/PlayerList";
import { TournamentList } from "./components/TournamentList";

function App() {
  const [currentView, setCurrentView] = useState("teams");

  return (
    <div className="w-full min-h-screen bg-[#0B1120]">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      <main className="fade-in">
        {currentView === "teams" && <TeamList />}
        {currentView === "tournaments" && <TournamentList />}
        {currentView === "players" && <PlayerList />}
      </main>
    </div>
  );
}

export default App;
