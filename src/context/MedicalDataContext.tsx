
import { createContext, useState, useContext } from "react";
import { MedicalData, MedicalVisit, MedicalAppointment, Vaccine } from "@/types";

interface MedicalDataContextType {
  medicalData: MedicalData | null;
  medicalVisits: MedicalVisit[];
  medicalAppointments: MedicalAppointment[];
  vaccines: Vaccine[];
  setMedicalData: (data: MedicalData | null) => void;
  setMedicalVisits: (visits: MedicalVisit[]) => void;
  setMedicalAppointments: (appointments: MedicalAppointment[]) => void;
  setVaccines: (vaccines: Vaccine[]) => void;
}

export const MedicalDataContext = createContext<MedicalDataContextType>({
  medicalData: null,
  medicalVisits: [],
  medicalAppointments: [],
  vaccines: [],
  setMedicalData: () => {},
  setMedicalVisits: () => {},
  setMedicalAppointments: () => {},
  setVaccines: () => {},
});

export const MedicalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null);
  const [medicalVisits, setMedicalVisits] = useState<MedicalVisit[]>([]);
  const [medicalAppointments, setMedicalAppointments] = useState<MedicalAppointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);

  return (
    <MedicalDataContext.Provider
      value={{
        medicalData,
        medicalVisits,
        medicalAppointments,
        vaccines,
        setMedicalData,
        setMedicalVisits,
        setMedicalAppointments,
        setVaccines,
      }}
    >
      {children}
    </MedicalDataContext.Provider>
  );
};

export const useMedicalData = () => useContext(MedicalDataContext);
