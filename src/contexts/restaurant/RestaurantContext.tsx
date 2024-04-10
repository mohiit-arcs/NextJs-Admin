import { RestaurantListResponseDataRowsInner } from "@/swagger";
import { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface RestaurantContextProps {
  defaultRestuarant: RestaurantListResponseDataRowsInner | null;
  setDefaultRestaurant: (
    restaurant: RestaurantListResponseDataRowsInner
  ) => void;
}

const RestaurantContext = createContext<RestaurantContextProps | null>(null);

type RestaurantProviderProps = {
  children: ReactNode;
};

export const RestaurantProvider = ({ children }: RestaurantProviderProps) => {
  const [defaultRestuarant, setDefaultRestaurant] =
    useState<RestaurantListResponseDataRowsInner | null>(null);

  return (
    <RestaurantContext.Provider
      value={{ defaultRestuarant, setDefaultRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export function useRestaurantContext() {
  const context = useContext(RestaurantContext);

  if (context === null) {
    throw new Error(
      "useRestaurantContext should be used within the RestaurantContext provider!"
    );
  }

  return context;
}
