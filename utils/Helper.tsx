import { useAppSelector } from "../redux/Hooks";
import { selectCurrentBranch, selectStoreData } from "../redux/state/UserStates";

export const makeAPIRequest = async (url: string, body?: any, method: string = "POST", options: RequestInit = { headers: { 'Content-Type': "application/json" } }): Promise<any> => {
  options.method = method;  
  body ? options.body = JSON.stringify(body) : null;
  let response;
    try {
      console.log("THE URL: ", url)
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

  export const getCurrentBranchId = () => {
    console.log(useAppSelector(selectCurrentBranch), useAppSelector(selectStoreData))
    const store = useAppSelector(selectStoreData)?.find(item => item.name === useAppSelector(selectCurrentBranch));
    console.log(store)

    return store ? store.storeId : null;
  };