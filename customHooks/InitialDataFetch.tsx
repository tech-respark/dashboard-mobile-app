import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { setIsLoading } from '../redux/state/UIStates';
import { environment } from '../utils/Constants';
import { makeAPIRequest } from '../utils/Helper';
import { selectBranchId, selectTenantId, setConfig, setCurrrentStoreConfig, setStaffData, setStoreCount } from '../redux/state/UserStates';
import { setCustomerSources, setSegments } from '../redux/state/AppointmentStates';

const useInitialDataFetch = () => {
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const getUserConfig = async () => {
        let url = environment.documentBaseUri + `stores`;
        url += tenantId ? `/getStoreByTenantAndStoreId?storeId=${storeId}&tenantId=${tenantId}` : `/${storeId}`
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            dispatch(setConfig({ configs: response }));
        }
    };

    const getStaffDetails = async () => {
        let url = environment.sqlBaseUri + `staffs/${tenantId}/${storeId}`;
        let responseStaff = await makeAPIRequest(url, null, "GET");
        if (responseStaff) {
            dispatch(setStaffData({ staffData: responseStaff }));
        }
    };

    const getStoreConfig = async () => {
        let url = environment.documentBaseUri + `configs/tenant/${tenantId}/store/${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            dispatch(setCurrrentStoreConfig({ currentStoreConfig: response }));
        }
    };

    const getSegmentAndItsTypes = async () => {
        let urlSegments = environment.guestUrl + `segments?tenantId=${tenantId}&storeId=${storeId}`;
        let segments = await makeAPIRequest(urlSegments, null, "GET");
        let urlSegmentTypes = environment.guestUrl + `segmentTypes?tenantId=${tenantId}&storeId=${storeId}`;
        let segmentTypes = await makeAPIRequest(urlSegmentTypes, null, "GET");
        if (segments.code == 200 && segmentTypes.code == 200) {
            const result = segments.data.reduce((acc: any, curr: any) => {
                acc[curr.segName] = segmentTypes.data.filter((item: any) => item.segId === curr.id);
                return acc;
            }, {});
            result ? dispatch(setSegments({ segments: result })) : null;
        }
    };

    const getCustomerSources = async() => {
        let url = environment.guestUrl + `customer/sourceOfCustomer?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response && response.code == 200) {
            dispatch(setCustomerSources({ sources: response.data }));
        }
    };

    const getStoreCount = async() => {
        let url = environment.sqlBaseUri + `tenants/storeCount?tenantId=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if(response){
            dispatch(setStoreCount({storeCount: response["count"]}));
        }
    };

    useEffect(() => {
        dispatch(setIsLoading({ isLoading: true }));
        getUserConfig();
        getStaffDetails();
        getStoreConfig();
        getSegmentAndItsTypes();
        getCustomerSources();
        getStoreCount();
        dispatch(setIsLoading({ isLoading: false }));
    }, []);
};

export default useInitialDataFetch;
