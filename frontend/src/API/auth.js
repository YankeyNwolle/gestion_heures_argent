const API_BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    throw error;
  }
};