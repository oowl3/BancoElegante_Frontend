import { useState } from 'react';
import { motion } from 'framer-motion';

export function PinScreen({ onAuthenticate, onBack, userInitials, loading, error }) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 4) onAuthenticate(pin);
  };

  return (
    <motion.div className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3>Hola, {userInitials}</h3>
      <p>Por favor, ingrese su PIN.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="****"
          maxLength="4"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || pin.length < 4}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <button className="secondary" onClick={onBack} disabled={loading}>Volver</button>
      {error && <p className="error">{error}</p>}
    </motion.div>
  );
}

