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
