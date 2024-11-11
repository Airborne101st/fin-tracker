// auth.js
export const isTokenValid = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return false;
    }
  
    // Decode the token to check expiration
    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
  
      return decodedPayload.exp > currentTime;
    } catch (error) {
      console.error("Invalid token", error);
      return false;
    }
  };
  