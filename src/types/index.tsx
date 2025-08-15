export type ChecklistItem = {
  id: number;
  text: string;
  order: number;
  checklist_id: number;
  required: boolean;
  picture_ids?: number[];
};

export type Checklist = {
  id: number;
  title: string;
  active: boolean;
  scope: "reminder" | "per_user" | "cumulative";
  items: ChecklistItem[];
  tags: Tag[];
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
export interface Event {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    invited_families: Family[];
}

export type Task = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  due_date: string;
  start_date: string;
  status: 'not_started' | 'assigned' | 'in_progress' | 'finished' | 'paused' | 'overdue';
  profiles: Profile[];
  tags: Tag[];
  pictures: any[];
};

export type Tag = {
  id: number;
  name: string;
  description: string;
}

export type Meal = {
  id: number;
  date: string;
  has_breakfast: boolean;
  has_lunch: boolean;
  has_dinner: boolean;
}

export type Guest = {
  id: number;
  profile_id: number;
  meals: Meal[];
  room_id?: number;
  room_name?: string;
}
export type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  arrival_time: string;
  departure_time: string;
  submitter_id: number;
  note: string;
  guests: Guest[];
};

export type MinimalProfile = {
    id: number;
    name: string;
};