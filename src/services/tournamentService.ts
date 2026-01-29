import api from "./api";
import type { Tournament } from "../types";

const adptTournament = (data: any): Tournament => ({
  id: data.Id || data.id,
  name: data.Name || data.name,
  startDate: data.StartDate || data.startDate,
  endDate: data.EndDate || data.endDate,
});

export const tournamentServices = {
  async listTournaments(): Promise<Tournament[]> {
    const response = await api.get<any[]>("/tournaments");
    return response.data.map(adptTournament);
  },

  async createTournaments(data: Omit<Tournament, "id">): Promise<Tournament> {
    const payloadBackend = {
      Name: data.name,
      StartDate: data.startDate,
      EndDate: data.endDate,
    };
    const response = await api.post<any>("/tournaments", payloadBackend);
    return adptTournament(response.data);
  },
};
