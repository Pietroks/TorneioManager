import { useEffect, useState } from "react";
import type { Tournament } from "../types";
import { tournamentServices } from "../services/tournamentService";
import { AlertCircle, Calendar, Calendar1, Loader2, Plus, Trophy, TrophyIcon } from "lucide-react";
import { TournamentForm } from "./TournamentForm";

export function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoaging] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoaging(true);
    try {
      const data = await tournamentServices.listTournaments();
      setTournaments(data);
    } catch (err) {
      setError("Falha ao carregar os torneios.");
      console.error(err);
    } finally {
      setLoaging(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-700 tracking-tight">
              Torneios
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Gerencie suas competiçoes</p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-500 bg-amber-600 rounded-full hover:bg-amber-700 cursor-pointer"
          >
            <Plus className="mr-2" size={20} />
            <span>Novo Torneio</span>
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
            <Loader2 className="text-amber-600 animate-spin" size={40} />
            <p className="text-slate-500 animate-pulse font-mono text-sm">Carregando times...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="group relative bg-[#1e293b]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Trophy className="text-amber-500 w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    Em andamento
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-500">{t.name}</h3>

                <div className="space-y-3 p-4 border-t border-slate-700/50">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar size={16} className="mr-3 text-slate-500" />
                    <span>
                      Inicio: <span className="text-slate-300">{t.startDate}</span>
                    </span>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar1 size={16} className="mr-3 text-slate-500" />
                    <span>
                      Final: <span className="text-slate-500">{t.endDate}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <div className="text-center py-32 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="text-slate-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum torneio criado</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">Crie uma nova competiçao para começar a gerenciar partidas.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-amber-400 hover:text-amber-600 font-medium text-sm transition-colors border-b border-amber-400/30 hover:border-amber-300 pb-0.5 cursor-pointer duration-500"
            >
              Criar primeiro Torneio
            </button>
          </div>
        )}

        {isFormOpen && (
          <TournamentForm
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
