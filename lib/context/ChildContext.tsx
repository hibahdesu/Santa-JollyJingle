//lib/context/ChildContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

type ChildContextType = {
  childId: string | null;
  childName: string | null;
  wishList: string | null;
  setChildData: (id: string, name: string, wishList: string) => void;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children }: { children: React.ReactNode }) => {
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState<string | null>(null);
  const [wishList, setWishList] = useState<string | null>(null);

  const setChildData = (id: string, name: string, wishList: string) => {
    setChildId(id);
    setChildName(name);
    setWishList(wishList);
  };

  return (
    <ChildContext.Provider value={{ childId, childName, wishList, setChildData }}>
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
