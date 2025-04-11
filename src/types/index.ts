
export interface Baby {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  birth_date: string;
  weight: number;
  height: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryEntry {
  id: string;
  baby_id: string;
  title: string;
  content?: string;
  entry_date: string;
  image_url?: string[];
  video_url?: string[];
  milestone?: string;
  type: "note" | "photo" | "video";
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  min_age_months: number;
  max_age_months: number;
  materials?: string[];
  image_url?: string;
  video_url?: string;
  created_at?: string;
  saved?: boolean;
  completed?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  age_months: number;
  created_at?: string;
}

export interface BabyMilestone {
  id: string;
  baby_id: string;
  milestone_id: string;
  completed: boolean;
  completion_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  milestone?: Milestone;
}

export interface Event {
  id: string;
  baby_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}
