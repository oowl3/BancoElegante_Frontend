import { useState } from 'react';
import { motion } from 'framer-motion';

export function TransactionModal({ modalData, onClose, onSubmit, loading, error }) {
    const [amount, setAmount] = useState('');
    const [serviceName, setServiceName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const amountNumber = parseFloat(amount);
        if (amountNumber > 0) {
            onSubmit(amountNumber, serviceName);
        }
    };

    return (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <h3>{modalData.title}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        disabled={loading}
                        autoFocus
                    />
                    {modalData.type === 'pay_service' && (
                         <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            placeholder="Nombre del servicio"
                            disabled={loading}
                        />
                    )}
                    <button type="submit" disabled={loading || !amount}>
                        {loading ? 'Procesando...' : 'Confirmar'}
                    </button>
                </form>
                <button className="secondary" onClick={onClose} disabled={loading}>Cancelar</button>
                {error && <p className="error">{error}</p>}
            </motion.div>
        </motion.div>
    );
}