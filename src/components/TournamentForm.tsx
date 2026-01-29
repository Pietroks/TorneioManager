import { useState } from "react";
import type { Tournament } from "../types";
import { tournamentServices } from "../services/tournamentService";
import { AlignLeft, Calendar, Calendar1, CheckCircle, Loader2, Save, Trophy, X } from "lucide-react";

interface TournamentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TournamentForm({ onSuccess, onCancel }: TournamentFormProps) {
  const [formData, setFormData] = useState<Omit<Tournament, "id">>({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      await tournamentServices.createTournaments(formData);
      setStatus({ type: "success", message: "Torneio criado com sucesso!" });
      onSuccess();
      setFormData({ name: "", startDate: "", endDate: "" });
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
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#0b1120] border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#1e293b]/50">
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

        <form className="p-6 space-y-5" onClick={handleSubmit}>
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

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
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
        </form>
      </div>
    </div>
  );
}
