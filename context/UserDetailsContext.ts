import { createContext } from "react";

// types/UserDetailsContextType.ts

export interface UserType {
  id: number;
  email: string;
  name: string;
  picture: string;
  credits: number;
  created_at: string;
}

export interface UserDetailsContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
}

export const UserDetailsContext = createContext<
  UserDetailsContextType | undefined
>(undefined);
