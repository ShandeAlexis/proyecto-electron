const obtenerToken = async (email, password) => {
    const base64Credentials = btoa("tr:12345");
  
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", `Basic ${base64Credentials}`);
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", email);
    urlencoded.append("password", password);
  
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: urlencoded,
      redirect: 'follow',
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8080/oauth/token", requestOptions);
      const data = await response.json();
      return data.accessToken; // Modificado para devolver solo el token de acceso
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw error;
    }
  };
  
  export default obtenerToken;
  