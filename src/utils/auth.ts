export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const handleGoogleLogin = async (): Promise<void> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/users/oauth2/login-url`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit', // No enviar cookies
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
        
    // Redirigir a Google OAuth2
    window.location.href = `${backendUrl}${data.loginUrl}`;
    
  } catch (error) {
    throw error;
  }
};