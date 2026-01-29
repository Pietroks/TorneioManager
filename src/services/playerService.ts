import api from "./api";
import type { Player } from "../types";

const adaptPlayer = (data: any): Player => ({
  id: data.Id,
  teamId: data.TeamId,
  name: data.Name,
  birthdate: data.Birthdate,
  cpf: data.Cpf,
  position: data.Position,
});

export const playerService = {
  async listPlayers(): Promise<Player[]> {
    const response = await api.get<Player[]>("/players");
    return response.data.map(adaptPlayer);
  },

  async listPlayersByTeam(teamId: string): Promise<Player[]> {
    const response = await api.get<Player[]>(`/team/${teamId}/players`);
    return response.data.map(adaptPlayer);
  },

  async createPlayer(teamId: string, data: Omit<Player, "id" | "teamId">): Promise<Player> {
    const payloadBackend = {
      Name: data.name,
      Cpf: data.cpf,
      Position: data.position,
      Birthdate: data.birthdate,
    };

    const response = await api.post<Player>(`/team/${teamId}/players`, payloadBackend);
    return adaptPlayer(response.data);
  },
};
