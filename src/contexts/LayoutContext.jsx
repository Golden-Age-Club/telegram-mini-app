import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const useLayout = () => {
  return useContext(LayoutContext);
};

export const LayoutProvider = ({ children }) => {
  const [title, setTitle] = useState('');
  const [showBack, setShowBack] = useState(false);
  const [onBack, setOnBack] = useState(null);

  return (
    <LayoutContext.Provider value={{ 
      title, 
      setTitle, 
      showBack, 
      setShowBack, 
      onBack, 
      setOnBack 
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
