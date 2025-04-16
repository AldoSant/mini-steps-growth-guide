
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
  published?: boolean;
  creator_id?: string;
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

// Medical related types
export interface MedicalVisit {
  id?: string;
  baby_id: string;
  visit_date: string;
  doctor_name: string;
  visit_type: string;
  notes: string;
  height?: number;
  weight?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MedicalAppointment {
  id?: string;
  baby_id: string;
  appointment_date: string;
  appointment_time?: string;
  doctor_name: string;
  appointment_type: string;
  location?: string;
  notes?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MedicalData {
  id?: string;
  baby_id: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications?: string[];
  pediatrician_name?: string;
  pediatrician_contact?: string;
  health_insurance?: string;
  health_insurance_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vaccine {
  id?: string;
  baby_id: string;
  name: string;
  date?: string;
  dose?: string;
  completed: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'mensal' | 'anual';
  features: string[];
  isPopular?: boolean;
  color?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author?: string;
  published_date?: string;
  image_url?: string;
  categories?: string[];
  summary?: string;
  references?: string[];
  min_age_months?: number;
  max_age_months?: number;
  created_at: string;
  published?: boolean;
  author_id?: string;
}
