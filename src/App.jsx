import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Importando los componentes fragmentados
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { PinScreen } from './components/screens/PinScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { TransactionModal } from './components/ui/TransactionModal';
import { Toast } from './components/ui/Toast';

// Importando el servicio de API
import { verifyCardApi, authenticateApi, transactionApi, getProfileApi } from './services/api';

function App() {
  const [view, setView] = useState('welcome');
  // El estado de la sesión ahora incluye el token
  const [session, setSession] = useState({ cardNumber: '', userInitials: '', token: null, userData: null });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: null, title: '' });
  const [toast, setToast] = useState({ message: '', visible: false, type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ message, visible: true, type });
  };

  const closeToast = () => {
    setToast({ message: '', visible: false, type: 'error' });
  };
  
  const handleVerifyCard = useCallback(async (cardNumber) => {
    setLoading(true);
    try {
      const data = await verifyCardApi(cardNumber);
      setSession(prev => ({ ...prev, cardNumber, userInitials: data.iniciales }));
      setView('pin');
    } catch (err) {
      showToast(err.message || 'La tarjeta no es válida.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthenticate = useCallback(async (pin) => {
    setLoading(true);
    try {
      const authResponse = await authenticateApi(session.cardNumber, pin);
      const token = authResponse.token;
      
      localStorage.setItem('authToken', token);

      const userData = await getProfileApi(token);
      
      setSession(prev => ({ ...prev, token, userData }));
      setView('menu');
    } catch (err) {
      showToast(err.message || 'PIN incorrecto.');
    } finally {
      setLoading(false);
    }
  }, [session.cardNumber]);

  const handleTransaction = useCallback(async (amount, serviceName) => {
    setLoading(true);
    try {
      const updatedUser = await transactionApi(modal.type, amount, serviceName, session.token);
      setSession(prev => ({...prev, userData: updatedUser}));
      setModal({ isOpen: false, type: null, title: '' });
      showToast('Transacción realizada con éxito.', 'success');
    } catch (err) {
      showToast(err.message || 'La transacción falló.');
    } finally {
      setLoading(false);
    }
  }, [modal.type, session.token]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    setSession({ cardNumber: '', userInitials: '', token: null, userData: null });
    setView('welcome');
  }, []);
  
  const handleBackToWelcome = useCallback(() => {
    setView('welcome');
  }, []);

  const openModal = (type, title) => {
      setModal({ isOpen: true, type, title });
  };

  const closeModal = () => {
      setModal({ isOpen: false, type: null, title: '' });
  };

  return (
    <>
      <AnimatePresence>
        {toast.visible && <Toast message={toast.message} onClose={closeToast} type={toast.type} />}
      </AnimatePresence>
      
      <AnimatePresence>
          {modal.isOpen && (
              <TransactionModal
                  modalData={modal}
                  onClose={closeModal}
                  onSubmit={handleTransaction}
                  loading={loading}
                  error={null}
              />
          )}
      </AnimatePresence>

      <div className="app-container">
        <div className="cajero-container">
          <AnimatePresence mode="wait">
            {view === 'welcome' && <WelcomeScreen key="welcome" onVerify={handleVerifyCard} loading={loading} error={null} />}
            {view === 'pin' && <PinScreen key="pin" onAuthenticate={handleAuthenticate} onBack={handleBackToWelcome} userInitials={session.userInitials} loading={loading} error={null} />}
            {view === 'menu' && 
              <MenuScreen 
                key="menu" 
                onLogout={handleLogout} 
                userData={session.userData} 
                onWithdrawClick={() => openModal('withdraw', 'Realizar Retiro')}
                onDepositClick={() => openModal('deposit', 'Realizar Depósito')}
                onPayServiceClick={() => openModal('pay_service', 'Pagar Servicio')}
              />
            }
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;

