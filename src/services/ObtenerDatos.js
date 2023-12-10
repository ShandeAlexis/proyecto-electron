

const fetchData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`${apiUrl}${paginadoEndpoint}`, requestOptions);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  export default {fetchData}