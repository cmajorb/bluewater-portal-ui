export type ChecklistItem = {
  label: string;
  key: string;
  images?: string[];
};

export type Room = {
  id: number;
  name: string;
  min_people: number;
  max_people: number;
  floor: string;
  bed_size: string;
  notes: string;
};

export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_adult: boolean;
  is_admin: boolean;
}

export interface Member {
  profile: Profile;
  is_head: boolean;
}
export interface Family {
  id: number;
  name: string;
  members: Member[];
}
