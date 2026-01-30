export interface Team {
  id?: string;
  name: string;
  tag: string;
  city: string;
  president: string;
}

export interface Player {
  id?: string;
  teamId?: string;
  name: string;
  birthdate: string;
  cpf: string;
  position: string;
}

export interface Tournament {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  format: string;
  baselocation: string;
  teamIds: string[];
}

export interface Standings {
  teamId: string;
  position?: number;
  points: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}
