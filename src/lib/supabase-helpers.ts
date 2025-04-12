
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

export async function createMedicalVisit(visit: Omit<MedicalVisit, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('medical_visits')
    .insert({
      baby_id: visit.baby_id,
      visit_date: visit.visit_date,
      doctor_name: visit.doctor_name,
      visit_type: visit.visit_type,
      notes: visit.notes,
      height: visit.height,
      weight: visit.weight
    });
    
  if (error) throw error;
  return data;
}

export async function updateMedicalVisit(id: string, visit: Partial<MedicalVisit>) {
  const { data, error } = await supabase
    .from('medical_visits')
    .update({
      baby_id: visit.baby_id,
      visit_date: visit.visit_date,
      doctor_name: visit.doctor_name,
      visit_type: visit.visit_type,
      notes: visit.notes,
      height: visit.height,
      weight: visit.weight
    })
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

export async function createMedicalAppointment(appointment: Omit<MedicalAppointment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('medical_appointments')
    .insert({
      baby_id: appointment.baby_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      doctor_name: appointment.doctor_name,
      appointment_type: appointment.appointment_type,
      location: appointment.location,
      notes: appointment.notes,
      completed: appointment.completed
    });
    
  if (error) throw error;
  return data;
}

export async function updateMedicalAppointment(id: string, appointment: Partial<MedicalAppointment>) {
  const { data, error } = await supabase
    .from('medical_appointments')
    .update({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      doctor_name: appointment.doctor_name,
      appointment_type: appointment.appointment_type,
      location: appointment.location,
      notes: appointment.notes,
      completed: appointment.completed
    })
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

export async function createMedicalData(medicalData: Omit<MedicalData, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('medical_data')
    .insert({
      baby_id: medicalData.baby_id,
      blood_type: medicalData.blood_type,
      allergies: medicalData.allergies,
      chronic_conditions: medicalData.chronic_conditions,
      medications: medicalData.medications,
      pediatrician_name: medicalData.pediatrician_name,
      pediatrician_contact: medicalData.pediatrician_contact,
      health_insurance: medicalData.health_insurance,
      health_insurance_number: medicalData.health_insurance_number
    });
    
  if (error) throw error;
  return data;
}

export async function updateMedicalData(id: string, medicalData: Partial<MedicalData>) {
  const { data, error } = await supabase
    .from('medical_data')
    .update({
      blood_type: medicalData.blood_type,
      allergies: medicalData.allergies,
      chronic_conditions: medicalData.chronic_conditions,
      medications: medicalData.medications,
      pediatrician_name: medicalData.pediatrician_name,
      pediatrician_contact: medicalData.pediatrician_contact,
      health_insurance: medicalData.health_insurance,
      health_insurance_number: medicalData.health_insurance_number
    })
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

export async function createVaccine(vaccine: Omit<Vaccine, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('vaccines')
    .insert({
      baby_id: vaccine.baby_id,
      name: vaccine.name,
      date: vaccine.date,
      dose: vaccine.dose,
      completed: vaccine.completed,
      notes: vaccine.notes
    });
    
  if (error) throw error;
  return data;
}

export async function updateVaccine(id: string, vaccine: Partial<Vaccine>) {
  const { data, error } = await supabase
    .from('vaccines')
    .update({
      name: vaccine.name,
      date: vaccine.date,
      dose: vaccine.dose,
      completed: vaccine.completed,
      notes: vaccine.notes
    })
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
