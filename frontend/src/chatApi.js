const API_URL = 'http://localhost:5000/api/chats';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getChats = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać czatów.');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas pobierania czatów:', error);
        throw error;
    }
};

export const createChat = async () => {
    try {
        const response = await fetch(`${API_URL}/new`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Nie udało się utworzyć czatu.');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas tworzenia czatu:', error);
        throw error;
    }
};

export const getChatDetails = async (chatId) => {
    try {
        const response = await fetch(`${API_URL}/${chatId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać szczegółów czatu.');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas pobierania szczegółów czatu:', error);
        throw error;
    }
};

export const sendMessage = async (chatId, message) => {
    try {
        console.log('Wysyłanie wiadomości do czatu:', chatId);
        console.log('Treść wiadomości:', message);
        
        const url = `${API_URL}/${chatId}/messages`;
        console.log('URL żądania:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            console.error('Status odpowiedzi:', response.status);
            console.error('Tekst odpowiedzi:', await response.text());
            throw new Error('Nie udało się wysłać wiadomości.');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas wysyłania wiadomości:', error);
        throw error;
    }
};