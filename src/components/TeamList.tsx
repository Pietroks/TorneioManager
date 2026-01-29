import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types";
import { AlertCircle, Loader2, MapPin, Shield, Trophy } from "lucide-react";
import { TeamForm } from "./TeamForm";

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    setLoading(true);
    try {
      const data = await teamService.listTeams();
      setTeams(data);
    } catch (err) {
      setError("Failed to load teams.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-700 tracking-tight">
              Times
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Gerencie os clubes e estatísticas da liga.</p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-700 cursor-pointer bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-[#0B1120]"
          >
            <span className="mr-2 text-xl">+</span>
            <span>Novo time</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 backdrop-blur-sm">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="text-blue-600 animate-spin" size={40} />
            <p className="text-slate-500 animate-pulse font-mono text-sm">Carregando times...</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id || team.name}
                className="group relative bg-[#1e293b]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <Shield className="text-blue-400 w-7 h-7" />
                    </div>

                    <span className="font-mono text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full tracking-wider">
                      {team.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{team.name}</h3>

                  <div className="w-full h-px bg-slate-700/50 my-4" />

                  <div className="space-y-3">
                    <div className="flex items-center text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                      <MapPin size={16} className="mr-3 text-slate-500 group-hover:text-blue-400" />
                      {team.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && teams.length === 0 && (
          <div className="text-center py-32 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-slate-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sem times cadastrados</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Comece a adicionar os clubes que farão parte do torneio para gerar as chaves.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors border-b border-blue-400/30 hover:border-blue-300 pb-0.5 cursor-pointer"
            >
              Criar primeiro time...
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TeamForm
          onCancel={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(true);
            loadTeams();
          }}
        />
      )}
    </div>
  );
}
