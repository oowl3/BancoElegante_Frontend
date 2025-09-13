import { motion } from 'framer-motion';

export function MenuScreen({ onLogout, userData, onWithdrawClick, onDepositClick, onPayServiceClick }) {
  if (!userData) {
    return <div className="screen">Cargando...</div>;
  }
  return (
    <motion.div className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3>Menú Principal</h3>
      <div className="balance-display">
        <span>Saldo Disponible</span>
        <strong>${userData.balance.toFixed(2)}</strong>
      </div>
      <div className="menu-options">
        <button onClick={onWithdrawClick}>Realizar un Retiro</button>
        <button onClick={onDepositClick}>Realizar un Depósito</button>
        <button onClick={onPayServiceClick}>Pagar un Servicio</button>
        <button className="secondary" onClick={onLogout}>Salir</button>
      </div>
    </motion.div>
  );
}

