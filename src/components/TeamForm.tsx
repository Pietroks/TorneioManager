import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import type { Team } from "../types";
import { AlertCircle, CheckCircle, Hash, MapPin, Save, Shield, User, X } from "lucide-react";

interface TeamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeamForm({ onSuccess, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState<Team>({
    name: "",
    tag: "",
    city: "",
    president: "",
  });
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  useEffect(() => {
    teamService
      .listTeams()
      .then(setExistingTeams)
      .catch((err) => console.error("Erro ao carregar validações:", err));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const isDuplicateName = existingTeams.some((t) => t.name.toLowerCase() === formData.name.toLowerCase());
    const isDuplicateTag = existingTeams.some((t) => t.tag.toLowerCase() === formData.tag.toLowerCase());

    if (isDuplicateName) {
      setStatus({ type: "error", message: "Já existe um time com esse nome." });
      return;
    }
    if (isDuplicateTag) {
      setStatus({ type: "error", message: "Já existe um time com essa sigla." });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTeam = await teamService.createTeam(formData);
      setExistingTeams([...existingTeams, newTeam]);
      onSuccess();
      setStatus({ type: "success", message: "Time criado com sucesso!" });
      setFormData({
        name: "",
        tag: "",
        city: "",
        president: "",
      });
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: "Erro ao conectar com o servidor." });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#0b1120] border border-slate-700 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#1e293b]/50 ">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="text-blue-500" size={20} />
            Novo Time
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-700 cursor-pointer "
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {status.type === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-800 text-red-400 text-sm animate-pulse">
              <AlertCircle size={18} />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === "success" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-800 text-gray-400 text-sm animate-pulse">
              <CheckCircle size={18} />
              <span>{status.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              Nome do clube <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-10"
                placeholder="Ex: Inter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Shield className="absolute left-3 top-3 text-slate-600 " size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                Sigla (3 letras) <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={3}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-10"
                  placeholder="INT"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                />
                <Hash className="absolute left-3 top-3 text-slate-600" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">Cidade</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-10"
                  placeholder="Ex: Porto Alegre"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <MapPin className="absolute left-3 top-3 text-slate-600" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">Presidente</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-10"
                value={formData.president}
                onChange={(e) => setFormData({ ...formData, president: e.target.value })}
              />
              <User className="absolute left-3 top-3 text-slate-600" size={18} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-700 rounded-lg font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-lg font-medium shadow-lg shadow-blue-950/20 transition-all duration-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={18} />
                  Salvar Time
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
