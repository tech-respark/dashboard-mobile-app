import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../redux/Hooks';
import { selectBranchId, selectCurrentStoreConfig, selectTenantId } from '../redux/state/UserStates';
import { environment } from '../utils/Constants';
import { makeAPIRequest } from '../utils/Helper';
import { GlobalColors } from '../Styles/GlobalStyleConfigs';
import Toast from 'react-native-root-toast';

export const useTimeIntervalList = () => {
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const [timeIntervals, setTimeIntervals] = useState<{ [key: string]: string }>({});

    const getTimeIntervalList = () => {
        const timeObject: { [key: string]: string } = {};
        const start = new Date(`1970-01-01T${storeConfig!['startTime']}`);
        const end = new Date(`1970-01-01T${storeConfig!['closureTime']}`);
        while (start <= end) {
            const timeString = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
            const formattedTime = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            timeObject[timeString] = formattedTime;
            start.setMinutes(start.getMinutes() + 15);
        }
        setTimeIntervals(timeObject);
        return timeObject;
    };

    const memoizedTimeIntervalList = useMemo(() => {
        if (storeConfig) {
            return getTimeIntervalList();
        }
        return {};
    }, [storeConfig]);

    useEffect(() => {
        setTimeIntervals(memoizedTimeIntervalList);
    }, [memoizedTimeIntervalList]);

    return timeIntervals;
};

export const useDebounce = ({value, delay=500}: any) => {
    const [debouncedVal, setDebouncedVal] = useState<string>(value);

    useEffect(()=>{
        const timeout = setTimeout(() => {
            setDebouncedVal(value);
        }, delay);

        return () => clearTimeout(timeout);
    }, [value]);
};

export const useCustomerData = (modalVisible: boolean = false) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const [customers, setCustomers] = useState<{ [key: string]: any }[]>([]);

    const getCustomersData = async () => {
        const url = environment.guestUrl + `customer/getByTenantStoreMinimal?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            setCustomers(response);
        } else {
            Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
    };

    useEffect(()=>{
        if(!modalVisible){
            console.log("####5", modalVisible)

        getCustomersData();
        }
    }, [modalVisible]);

    return customers;
};