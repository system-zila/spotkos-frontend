import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface UserKost {
  id: string;
  name: string;
  location: string;
  address: string;
  price: number;
  gender: 'Putra' | 'Putri' | 'Campur';
  description: string;
  roomSize: string;
  capacity: string;
  bathroom: string;
  floor: string;
  ownerName: string;
  ownerPhone: string;
  facilities: string[];
  rules: string[];
  photos: string[];
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  myRating: number | null;
  myReview: string | null;
  paymentHistory: { month: string; date: string; amount: number; status: 'paid' | 'pending' }[];
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
}

export interface UserBooking {
  id: string;
  roomId: number;
  roomName: string;
  roomLocation: string;
  roomImage: string;
  bookingDate: string;
  moveInDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  duration: string;
}

interface UserDataContextType {
  myKosts: UserKost[];
  addKost: (kost: UserKost) => void;
  updateKost: (id: string, updates: Partial<UserKost>) => void;
  bookings: UserBooking[];
  addBooking: (booking: UserBooking) => void;
  updateBooking: (id: string, updates: Partial<UserBooking>) => void;
}

const UserDataContext = createContext<UserDataContextType>({
  myKosts: [],
  addKost: () => {},
  updateKost: () => {},
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
});

export function UserDataProvider({ children }: { children: ReactNode }) {
  const DATA_VERSION = 'v2';

  const [myKosts, setMyKosts] = useState<UserKost[]>(() => {
    try {
      const version = localStorage.getItem('spotkos_data_version');
      if (version !== DATA_VERSION) {
        localStorage.removeItem('spotkos_bookings');
        localStorage.removeItem('spotkos_my_kosts');
        localStorage.setItem('spotkos_data_version', DATA_VERSION);
        return [];
      }
      const stored = localStorage.getItem('spotkos_my_kosts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState<UserBooking[]>(() => {
    try {
      const version = localStorage.getItem('spotkos_data_version');
      if (version !== DATA_VERSION) return [];
      const stored = localStorage.getItem('spotkos_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('spotkos_my_kosts', JSON.stringify(myKosts));
  }, [myKosts]);

  useEffect(() => {
    localStorage.setItem('spotkos_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addKost = (kost: UserKost) => setMyKosts((prev) => [kost, ...prev]);

  const updateKost = (id: string, updates: Partial<UserKost>) =>
    setMyKosts((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));

  const addBooking = (booking: UserBooking) => setBookings((prev) => [booking, ...prev]);

  const updateBooking = (id: string, updates: Partial<UserBooking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  return (
    <UserDataContext.Provider value={{ myKosts, addKost, updateKost, bookings, addBooking, updateBooking }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);