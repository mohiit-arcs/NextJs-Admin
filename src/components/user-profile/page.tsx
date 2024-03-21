import { messages } from "@/messages/frontend/index.message";
import { setAuthToken } from "@/services/frontend/storage.service";
import { LoginResponseDataProfile } from "@/swagger";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

type UserProfileContextType = {
  userProfile?: LoginResponseDataProfile;
  setUserProfile: (profile: LoginResponseDataProfile) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

type UserProfileProviderProps = {
  children: ReactNode;
};

export const UserProfileProvider = ({ children }: UserProfileProviderProps) => {
  const [userProfile, setUserProfile] = useState<LoginResponseDataProfile>();

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error(messages.configuration.userProfileContext.error.noContext);
  }
  return context;
};
