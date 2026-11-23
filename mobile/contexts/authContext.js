import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const SESSION_TEMPORAIRE = {
  jeton: 'temporaire',
  utilisateur: { nomAffiche: 'Joueur démo' },
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [chargement, setChargement] = useState(true);

  const restaurerSession = async () => {
    setChargement(false);
  };

  const connecter = async (courriel, motDePasse) => {
    if (!courriel || !motDePasse) {
      throw new Error('Entrez un courriel et un mot de passe.');
    }
    setSession({ ...SESSION_TEMPORAIRE, utilisateur: { ...SESSION_TEMPORAIRE.utilisateur, courriel } });
  };

  const deconnecter = async () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, chargement, restaurerSession, connecter, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
