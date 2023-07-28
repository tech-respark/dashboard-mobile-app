export const makeAPIRequest = async (url: string, body?: any, options: RequestInit = { headers: { 'Content-Type': "application/json" } }, method: string = "POST"): Promise<any> => {
  options.method = method;  
  body ? options.body = JSON.stringify(body) : null;
  let response;
    try {
      response = await fetch(url, options);
      if(response.status != 200 || response.headers.get('content-length') === '0'){
        return null;
      } 
    } catch (error) {
      console.log(error);
      return null;
    }
    try{
      response = await response.json();
    }catch(error){
      console.log("Not able to parse JSON");
    }
    return response;
  };

  export const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };