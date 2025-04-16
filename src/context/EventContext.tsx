
import { createContext, useState, useContext } from "react";
import { Event } from "@/types";

interface EventContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
  createEvent: (event: Omit<Event, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  setEvents: () => {},
  createEvent: async () => {},
  updateEvent: async () => {},
  deleteEvent: async () => {},
});

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const createEvent = async (event: Omit<Event, "id" | "created_at" | "updated_at">) => {
    // Implementation will be added in the future
  };

  const updateEvent = async (id: string, event: Partial<Event>) => {
    // Implementation will be added in the future
  };

  const deleteEvent = async (id: string) => {
    // Implementation will be added in the future
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
