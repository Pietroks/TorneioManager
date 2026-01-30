import api from "./api";
import type { Standings, Tournament } from "../types";

const adptTournament = (data: any): Tournament => ({
  id: String(data.Id || data.id || "").trim(),
  name: data.Name || data.name,
  startDate: data.StartDate || data.startDate,
  endDate: data.EndDate || data.endDate,
  format: data.Format || data.format || "Padrao",
  baselocation: data.baselocation || "Local não definido",
  teamIds: data.teamIds || [],
});

export const tournamentServices = {
  async listTournaments(): Promise<Tournament[]> {
    const response = await api.get<any[]>("/tournaments");
    return response.data.map(adptTournament);
  },

  async createTournaments(data: Omit<Tournament, "id">): Promise<Tournament> {
    const payloadBackend = {
      name: data.name,
      format: data.format,
      startDate: data.startDate,
      endDate: data.endDate,
      teamIds: data.teamIds || [],
      baselocation: data.baselocation,
    };
    const response = await api.post<any>("/tournaments", payloadBackend);
    return adptTournament(response.data);
  },

  async startTournament(id: string): Promise<void> {
    await api.post(`/tournaments/${id}/start`);
  },

  async getStandings(id: string): Promise<Standings[]> {
    const response = await api.get(`/tournaments/${id}/standings`);
    return response.data.standings || response.data || [];
  },
};
