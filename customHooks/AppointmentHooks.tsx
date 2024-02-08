import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../redux/Hooks';
import { selectCurrentStoreConfig } from '../redux/state/UserStates';

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