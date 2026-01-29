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
}
