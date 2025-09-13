import { useState } from 'react';
import { motion } from 'framer-motion';

export function WelcomeScreen({ onVerify, loading, error }) {
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length === 16) onVerify(cardNumber);
  };

  return (
    <motion.div className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2>Bienvenido al Cajero Automático Virtual</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Ingrese su número de tarjeta"
          maxLength="16"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || cardNumber.length < 16}>
          {loading ? 'Verificando...' : 'Continuar'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </motion.div>
  );
}