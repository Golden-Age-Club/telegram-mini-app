import { createContext, useContext } from 'react';
import { useApi } from './ApiContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { isConnected, deposit, withdraw } = useApi();
  const { user } = useAuth();
  const toast = useToast();

  const updateBalance = async (amount) => {
    if (user && isConnected) {
      try {
        if (amount > 0) {
          await deposit(amount);
        } else if (amount < 0) {
          await withdraw(Math.abs(amount));
        }
      } catch (error) {
        console.warn('Balance update via API failed, using local update');
      }
    }
    
    if (amount > 0) {
      toast.success(`+${amount.toLocaleString()} USDT added to your balance!`);
    } else if (amount < 0) {
      toast.warning(`-${Math.abs(amount).toLocaleString()} USDT deducted from balance`);
    }
  };

  return (
    <WalletContext.Provider value={{ updateBalance }}>
      {children}
    </WalletContext.Provider>
  );
};
