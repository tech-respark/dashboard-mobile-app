import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { AppDispatch } from "../redux/Store";
import { selectCurrentBranch, selectStoreData, setCurrentBranch, setStoreIdData } from "../redux/state/UserStates";
import { environment } from "./Constants";

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

  export const getBranchesAndStoreId = async (staffId: number, dispatch: AppDispatch) => {
    let res: { [key: string]: any }[] = await makeAPIRequest(environment.sqlBaseUri + "ssroles/staff/custom/staffid/" + staffId, null, "GET");
    if (res.length > 0) {
      dispatch(setStoreIdData({ StoreIdData: res }));
      dispatch(setCurrentBranch({ currentBranch: res[0].name }));
    }
  };