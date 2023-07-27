export const makeAPIRequest = async (url: string, body?: any): Promise<any> => {
    const options: RequestInit = { headers: { 'Content-Type': "application/json" } }
    if (body) {
      options.method = "POST";
      options.body = JSON.stringify(body)
    } else {
      options.method = "GET"
    }
    try {
      let response = await fetch(url, options);
      let parsedData = await response.json();
      return parsedData
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  export const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };