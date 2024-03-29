import Toast from "react-native-root-toast";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { AppDispatch } from "../redux/Store";
import { setCategoriesData } from "../redux/state/BackOfficeStates";
import { setIsLoading } from "../redux/state/UIStates";
import { selectCurrentBranch, selectStoreData, setCurrentBranch, setStoreIdData } from "../redux/state/UserStates";
import { environment } from "./Constants";
import { GlobalColors } from "../Styles/GlobalStyleConfigs";

export const makeAPIRequest = async (url: string, body?: any, method: string = "POST", allowEmptyRes: boolean = false, options: RequestInit = { headers: { 'Content-Type': "application/json" } }): Promise<any> => {
  options.method = method;
  body ? options.body = JSON.stringify(body) : null;
  let response;
  try {
    response = await fetch(url, options);
    if (response.status != 200 || (!allowEmptyRes && response.headers.get('content-length') === '0')) {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  try {
    response = await response.json();
  } catch (error) {
    console.log("Not able to parse JSON");
  }
  return response;
};

export const uploadImageAPI = async (uri: string, body: any) => {
  let options = {
    method: "POST",
    headers: { 'Content-Type': 'multipart/form-data' },
    body: body
  }
  let response = null;
  try {
    let response = await fetch(uri, options);
    if (response.status != 200) {
      return response;
    }
    return await response.text();
  } catch (error) {
    console.log("Internal Error");
  }
  return response;
}

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

export const getCategoryData = async (type: string, tenantId: number, storeId: number, dispatch: AppDispatch) => {
  dispatch(setIsLoading({ isLoading: true }));
  const subDomain = (type == 'service') ? "getServiceCategoriesByTenantAndStore" : "getProductCategoriesByTenantAndStore";
  const url = environment.documentBaseUri + `stores/${subDomain}?tenantId=${tenantId}&storeId=${storeId}`;
  let response = await makeAPIRequest(url, null, "GET");
  if (response) {
    dispatch(setCategoriesData({ categoriesData: response }));
  } else {
    Toast.show("No Data Found", { backgroundColor: GlobalColors.error });
  }
  dispatch(setIsLoading({ isLoading: false }));
};

export const uploadImageToS3 = async (imageUrl: string, tenantId?: number) => {
  const formData = new FormData();
  formData.append('id', String(tenantId));
  formData.append('type', 'curatedcategory');
  formData.append('file', {
    uri: imageUrl,
    name: 'image.jpg',
    type: 'image.jpeg'
  });
  let response = await uploadImageAPI(environment.documentBaseUri + 's3/uploadwithtype', formData);
  !response ? Toast.show("File Upload Error", { backgroundColor: GlobalColors.error, opacity: 1 }) : null;
  return response;
};


export const checkImageToUpload = async (displayImageList: { [key: string]: any }[], tenantId: number) => {
  let displayUploads = [...displayImageList];
  for (let index = 0; index < displayImageList.length; index++) {
    if (!displayUploads[index]["imagePath"].includes("https")) {
      let imageS3Url = await uploadImageToS3(displayUploads[index]["imagePath"], tenantId);
      displayUploads[index] = { ...displayUploads[index], imagePath: imageS3Url };
    }
  }
  return displayUploads;
}