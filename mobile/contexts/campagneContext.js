import { createContext, useContext, useState } from 'react';

const CampagneContext = createContext();

export const CampagneProvider = ({ children }) => {
  const [campagneActive, setCampagneActive] = useState(null);

  const choisirCampagne = (campagne) => {
    setCampagneActive(campagne);
  };

  const quitterCampagne = () => {
    setCampagneActive(null);
  };

  return (
    <CampagneContext.Provider value={{ campagneActive, choisirCampagne, quitterCampagne }}>
      {children}
    </CampagneContext.Provider>
  );
};

export const useCampagne = () => useContext(CampagneContext);
