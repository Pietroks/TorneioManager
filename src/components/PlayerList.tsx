import { useEffect, useState } from "react";
import type { Player, Team } from "../types";
import { playerService } from "../services/playerService";
import { teamService } from "../services/teamService";
import { AlertCircle, Loader2, User, User2Icon, UserPlus } from "lucide-react";
import { PlayerForm } from "./PlayerForm";

export function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [playersData, teamsData] = await Promise.all([playerService.listPlayers(), teamService.listTeams()]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch (err) {
      setError("Failed to load players or teams.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getTeamTag = (teamId?: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.tag : "---";
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-500 to-emerald-700 tracking-tight">
              Jogadores
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Elenco completo do torneio.</p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-700 bg-emerald-600 rounded-full hover:bg-emerald-800 cursor-pointer"
          >
            <UserPlus className="mr-2" size={20} />
            <span>Novo jogador</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 backdrop-blur-sm">
            <AlertCircle size={40} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-slate-500 animate-pulse font-mono text-sm">Carregando jogadores...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <div
                key={player.id}
                className="group relative bg-[#1e293b]/40 backdrop-blur-md rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 bg-slate-800 text-xs font-mono font-bold px-2 py-1 rounded border border-slate-700 text-slate-300">
                  {getTeamTag(player.teamId)}
                </div>

                <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                  <User className="text-slate-400" size={32} />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-600 transition-colors">{player.name}</h3>
                <p className="text-emerald-500 text-sm font-medium mb-4">{player.position}</p>

                <div className="border-t border-slate-700/50 pt-3 space-y-2">
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="w-20">Nascimento:</span>
                    <span className="text-slate-300">{player.birthdate}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="w-20">CPF:</span>
                    <span className="text-slate-300">{player.cpf}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="text-center py-32 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User2Icon className="text-slate-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sem jogadores cadastrados</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">Comece a adicionar os jogadores que farão parte dos times do torneio.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors border-b border-green-400/30 hover:border-green-300 pb-0.5 cursor-pointer"
            >
              Criar primeiro jogador...
            </button>
          </div>
        )}

        {isFormOpen && (
          <PlayerForm
            onCancel={() => setIsFormOpen(false)}
            onSuccess={() => {
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}
