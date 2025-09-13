// --- Capa de Servicio de API (Actualizada para JWT) ---

const API_BASE_URL = 'http://localhost:8080/api/cajero';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error del servidor: ${response.statusText}`);
    }
    // Si la respuesta no tiene contenido (ej. 204 No Content), no intentes parsearla
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

// --- Endpoints Públicos ---
export const verifyCardApi = async (cardNumber) => {
    const response = await fetch(`${API_BASE_URL}/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTarjeta: cardNumber }),
    });
    return handleResponse(response);
};

export const authenticateApi = async (cardNumber, pin) => {
    const response = await fetch(`${API_BASE_URL}/autenticar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTarjeta: cardNumber, pin }),
    });
    return handleResponse(response);
};

// --- Endpoints Protegidos ---
export const getProfileApi = async (token) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    return handleResponse(response);
};

export const transactionApi = async (type, amount, serviceName = null, token) => {
    let endpoint = '';
    let body = {};

    switch (type) {
        case 'withdraw':
            endpoint = '/retiro';
            body = { monto: amount }; // Ya no se necesita la tarjeta
            break;
        case 'deposit':
            endpoint = '/deposito';
            body = { monto: amount }; // Ya no se necesita la tarjeta
            break;
        case 'pay_service':
            endpoint = '/pago-servicio';
            body = { monto: amount, nombreServicio: serviceName }; // El nombre del servicio aún es necesario
            break;
        default:
            throw new Error('Tipo de transacción no válido.');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Se adjunta el token
        },
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

