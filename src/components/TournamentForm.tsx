import { useEffect, useState } from "react";
import type { Team, Tournament } from "../types";
import { tournamentServices } from "../services/tournamentService";
import { AlignLeft, Calendar, Calendar1, Check, CheckCircle, Loader2, MapPin, Save, Trophy, TrophyIcon, X } from "lucide-react";
import { teamService } from "../services/teamService";

interface TournamentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TournamentForm({ onSuccess, onCancel }: TournamentFormProps) {
  const [formData, setFormData] = useState<Omit<Tournament, "id">>({
    name: "",
    startDate: "",
    endDate: "",
    format: "LEAGUE",
    baselocation: "",
    teamIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [avaliableTeams, setAvaliableTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function loadTeams() {
      try {
        const teams = await teamService.listTeams();
        setAvaliableTeams(teams);
      } catch (err) {
        console.error("Erro ao carregar times:", err);
      }
    }
    loadTeams();
  }, []);

  function toggleTeam(teamId: string) {
    setFormData((prev) => {
      const currentIds = prev.teamIds || [];
      if (currentIds.includes(teamId)) {
        return { ...prev, teamIds: currentIds.filter((id) => id !== teamId) };
      } else {
        return { ...prev, teamIds: [...currentIds, teamId] };
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setStatus({ type: "error", message: "A data de término não pode ser anterior à data de início." });
      return;
    }

    if (formData.teamIds.length < 2) {
      setStatus({ type: "error", message: "Selecione pelo menos dois times para o torneio." });
      return;
    }

    setIsSubmitting(true);

    try {
      await tournamentServices.createTournaments(formData);
      setStatus({ type: "success", message: "Torneio criado com sucesso!" });
      onSuccess();
      setFormData({ name: "", startDate: "", endDate: "", format: "LEAGUE", baselocation: "", teamIds: [] });
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Erro ao criar o torneio." });
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm z-50">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col transform overflow-hidden rounded-2xl bg-[#0b1120] border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#1e293b]/50 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            Novo torneio
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white cursor-pointer rounded-full p-1 transition-colors duration-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <form id="tournament-form" onSubmit={handleSubmit}>
            {status.type === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-800 text-red-400 text-sm animate-pulse">
                <CheckCircle size={18} /> <span>{status.message}</span>
              </div>
            )}
            {status.type === "success" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-800 text-gray-400 text-sm animate-pulse">
                <CheckCircle size={18} /> <span>{status.message}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Nome do torneio</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Champions League"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-amber-500 outline-none disabled:opacity-50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                <AlignLeft className="absolute left-3 top-3 text-slate-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Localização (Pais/Cidade)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Santo Angelo"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-amber-500 outline-none disabled:opacity-50"
                  value={formData.baselocation}
                  onChange={(e) => setFormData({ ...formData, baselocation: e.target.value })}
                  disabled={isSubmitting}
                />
                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Formato do torneio</label>
              <div className="relative">
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-amber-500 outline-none appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="LEAGUE">Pontos Corridos (Liga)</option>
                  <option value="MATA_MATA">Eliminacao Direta (Mata-Mata)</option>
                </select>
                <TrophyIcon className="absolute left-3 top-3 text-slate-500" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Data de Inicio</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 pl-10 focus:border-amber-500 outline-none disabled:opacity-50"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-sky-400">Data da Final</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white px-4 py-2.5 pl-10 focus:border-amber-500 outline-none disabled:opacity-50"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={isSubmitting}
                  />
                  <Calendar1 className="absolute left-3 top-3 text-slate-500" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">Selecionar Times</label>
                <span className="text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {formData.teamIds.length} selecionados
                </span>
              </div>

              <div className="border border-slate-700 rounded-lg bg-slate-900/50 p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {avaliableTeams.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                    <p>Nenhum time cadastrado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {avaliableTeams.map((team) => {
                      const isSelected = formData.teamIds.includes(team.id || "");
                      return (
                        <div
                          key={team.id}
                          onClick={() => !isSubmitting && toggleTeam(team.id || "")}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-500 border
                        ${
                          isSelected
                            ? "bg-amber-600/20 border-amber-500/50 hover:bg-amber-900/20"
                            : "bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                        }
                      `}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? "bg-amber-500 text-slate-900" : "bg-slate-700 text-slate-400"}`}
                            >
                              {team.tag || team.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-300"}`}>{team.name}</span>
                          </div>

                          {isSelected && <Check size={16} className="text-amber-400" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-[#1e293b]/30 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-slate-300 hover:text-white cursor-pointer disabled:opacity-50 transition-colors duration-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="tournament-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-lg font font-medium shadow-amber-900/20 transition-all duration-500 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Criando Torneio...
              </>
            ) : (
              <>
                <Save size={18} /> Criar Torneio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
