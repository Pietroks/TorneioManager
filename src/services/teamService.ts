import api from "./api";
import type { Team } from "../types";

export const teamService = {
  async listTeams(): Promise<Team[]> {
    const response = await api.get<Team[]>("/teams");
    return response.data;
  },

  async createTeam(data: Team): Promise<Team> {
    const response = await api.post<Team>("/teams", data);
    return response.data;
  },
};
