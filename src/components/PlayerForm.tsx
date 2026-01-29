import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import { playerService } from "../services/playerService";
import { AlertCircle, Briefcase, Calendar, CheckCircle, Hash, Save, Shield, User, X } from "lucide-react";
import type { Player, Team } from "../types";

interface PlayerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PlayerForm({ onSuccess, onCancel }: PlayerFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [formData, setFormData] = useState<Omit<Player, "id" | "teamId">>({
    name: "",
    birthdate: "",
    cpf: "",
    position: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const maxDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    teamService.listTeams().then(setTeams).catch(console.error);
    playerService.listPlayers().then(setExistingPlayers).catch(console.error);
  }, []);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFormData({ ...formData, cpf: value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    if (!selectedTeam) {
      setStatus({ type: "error", message: "Por favor, selecione um time para o jogador." });
      return;
    }

    if (formData.cpf.length < 14) {
      setStatus({ type: "error", message: "Cpf incompleto" });
      return;
    }

    const isDuplicateCpf = existingPlayers.some((p) => p.cpf === formData.cpf);
    if (isDuplicateCpf) {
      setStatus({ type: "error", message: "Já existe um jogador com esse CPF." });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPlayer = await playerService.createPlayer(selectedTeam, formData);
      setExistingPlayers([...existingPlayers, newPlayer]);
      onSuccess();
      setStatus({ type: "success", message: "Jogador criado com sucesso!" });
      setFormData({
        name: "",
        birthdate: "",
        cpf: "",
        position: "",
      });
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 3000);
    } catch (err) {
      setStatus({ type: "error", message: "Erro ao criar jogador. Tente novamente." });
      console.error(err);
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0b1120] border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#1e293b]/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User size={20} className="text-green-500" />
            Novo Jogador
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white cursor-pointer">
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
            <label className="text-sm font-medium text-slate-400">Time do jogador</label>
            <div className="relative">
              <select
                required
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:border-green-500 outline-none appearance-none pl-10 cursor-pointer"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Selecione um time...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.tag})
                  </option>
                ))}
              </select>
              <Shield className="absolute left-3 top-3 text-slate-500" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Nome completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-green-500 outline-none"
                  placeholder="Ex: Ronaldinho"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">CPF</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={14}
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-green-500 outline-none"
                  placeholder="Ex: 123.456.789-00"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  disabled={isSubmitting}
                />
                <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Data de nacimento</label>
              <div className="relative">
                <input
                  type="date"
                  max={maxDate}
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-green-500 outline-none"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Posição</label>
              <div className="relative">
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full rounded-lg bg-slate-900 border-slate-700 px-4 py-2.5 text-white pl-10 focus:border-green-500 outline-none appearance-none cursor-pointer"
                >
                  <option>Goleiro</option>
                  <option>Zagueiro</option>
                  <option>Lateral</option>
                  <option>Volante</option>
                  <option>Meia</option>
                  <option>Atacante</option>
                </select>
                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-300 hover:text-white cursor-pointer">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow-lg font-medium shadow-green-900/20 transition-all duration-700 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={18} /> Salvar jogador
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
