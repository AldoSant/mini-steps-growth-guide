
import { supabase } from "@/integrations/supabase/client";
import { 
  MedicalVisit, 
  MedicalAppointment, 
  MedicalData, 
  Vaccine 
} from "@/types";

// Medical Visits
export async function getMedicalVisits(babyId: string) {
  const { data, error } = await supabase
    .from('medical_visits')
    .select('*')
    .eq('baby_id', babyId)
    .order('visit_date', { ascending: false });
    
  if (error) throw error;
  return data as MedicalVisit[];
}

export async function createMedicalVisit(visit: Partial<MedicalVisit>) {
  const { data, error } = await supabase
    .from('medical_visits')
    .insert(visit);
    
  if (error) throw error;
  return data;
}

export async function updateMedicalVisit(id: string, visit: Partial<MedicalVisit>) {
  const { data, error } = await supabase
    .from('medical_visits')
    .update(visit)
    .eq('id', id);
    
  if (error) throw error;
  return data;
}

export async function deleteMedicalVisit(id: string) {
  const { error } = await supabase
    .from('medical_visits')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

// Medical Appointments
export async function getMedicalAppointments(babyId: string) {
  const { data, error } = await supabase
    .from('medical_appointments')
    .select('*')
    .eq('baby_id', babyId)
    .order('appointment_date', { ascending: true });
    
  if (error) throw error;
  return data as MedicalAppointment[];
}

export async function createMedicalAppointment(appointment: Partial<MedicalAppointment>) {
  const { data, error } = await supabase
    .from('medical_appointments')
    .insert(appointment);
    
  if (error) throw error;
  return data;
}

export async function updateMedicalAppointment(id: string, appointment: Partial<MedicalAppointment>) {
  const { data, error } = await supabase
    .from('medical_appointments')
    .update(appointment)
    .eq('id', id);
    
  if (error) throw error;
  return data;
}

export async function deleteMedicalAppointment(id: string) {
  const { error } = await supabase
    .from('medical_appointments')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

// Medical Data
export async function getMedicalData(babyId: string) {
  const { data, error } = await supabase
    .from('medical_data')
    .select('*')
    .eq('baby_id', babyId)
    .maybeSingle();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data as MedicalData | null;
}

export async function createMedicalData(medicalData: Partial<MedicalData>) {
  const { data, error } = await supabase
    .from('medical_data')
    .insert(medicalData);
    
  if (error) throw error;
  return data;
}

export async function updateMedicalData(id: string, medicalData: Partial<MedicalData>) {
  const { data, error } = await supabase
    .from('medical_data')
    .update(medicalData)
    .eq('id', id);
    
  if (error) throw error;
  return data;
}

// Vaccines
export async function getVaccines(babyId: string) {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('baby_id', babyId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data as Vaccine[];
}

export async function createVaccine(vaccine: Partial<Vaccine>) {
  const { data, error } = await supabase
    .from('vaccines')
    .insert(vaccine);
    
  if (error) throw error;
  return data;
}

export async function updateVaccine(id: string, vaccine: Partial<Vaccine>) {
  const { data, error } = await supabase
    .from('vaccines')
    .update(vaccine)
    .eq('id', id);
    
  if (error) throw error;
  return data;
}

export async function deleteVaccine(id: string) {
  const { error } = await supabase
    .from('vaccines')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}
