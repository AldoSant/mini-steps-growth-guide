
import { createContext, useState, useContext } from "react";
import { Activity } from "@/types";

interface ActivityContextType {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  createActivity: (activity: Omit<Activity, "id" | "created_at">) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getActivity: (id: string) => Activity | undefined;
}

export const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  setActivities: () => {},
  createActivity: async () => {},
  updateActivity: async () => {},
  deleteActivity: async () => {},
  getActivity: () => undefined,
});

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const createActivity = async (activity: Omit<Activity, "id" | "created_at">) => {
    // Implementation will be added in the future
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    // Implementation will be added in the future
  };

  const deleteActivity = async (id: string) => {
    // Implementation will be added in the future
  };

  const getActivity = (id: string) => {
    return activities.find(activity => activity.id === id);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        setActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        getActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
