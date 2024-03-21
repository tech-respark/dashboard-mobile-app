import { setSelectedGuest } from "../redux/state/AppointmentStates";
import { SERVICES_INDEX, environment } from "./Constants";
import { getTofixValue, makeAPIRequest } from "./Helper";

export const isActiveAtBinaryIndex = (value: any, index: any) => {
    return Boolean((value >> index) % 2)
}

export const calculateTaxes = (taxebalePrice: number, config: any) => {
    let applicableTaxes: {[key: string]: any}[] = [];
    let txchrgs: {[key: string]: any}[] = [];
    config.txchConfig.map((taxData: any) => {
        if (taxData.active && isActiveAtBinaryIndex(taxData.applyOn, SERVICES_INDEX) && !taxData.charge) {
            applicableTaxes.push({ ...taxData });
        }
    });
    if (config.storeConfig.settingsConfig.taxes) {
        applicableTaxes.map((taxData: any) => {
            let taxApplied = 0;
            if (taxData.isInclusive) {
                let totalTaxesApplied = config.txchConfig.reduce((a: any, b: any) => a + Number(b.value), 0);
                let itemActualPrice = ((taxebalePrice * 100) / (100 + totalTaxesApplied));
                taxApplied = (itemActualPrice * taxData.value) / 100;
            } else {
                taxApplied = (taxebalePrice / 100) * parseFloat(taxData.value)
            }
            const taxObj = {
                id: taxData.id,
                name: taxData.name,
                type: taxData.type,
                isInclusive: taxData.isInclusive,
                taxRate: taxData.value,
                value: getTofixValue(config, taxApplied),
            }
            txchrgs.push(taxObj);
        });
    }
    return txchrgs;
};

export function getActiveStaffsForAppointment(latestStaffList: { [key: string]: any }[], mainStaffList: { [key: string]: any }[]): { [key: string]: any }[] {
    mainStaffList = mainStaffList.filter(item => item.enableAppointments && item.active);
    latestStaffList = latestStaffList.filter(item => !item.onLeave);
  
    const commonStaffList = latestStaffList.filter(latestStaff => {
      const mainStaff = mainStaffList.find(mainStaff => mainStaff.id === latestStaff.staffId);
      if (mainStaff) {
        latestStaff.name = `${mainStaff.firstName} ${mainStaff.lastName}`;
        return true;
      }
      return false;
    });
    return commonStaffList;
  };

export const getAddedMembersObjects = (selectedFamily: string[], customer: {[key: string]: any}) => {
    const objects = selectedFamily.map(item => {
        const foundObject = customer.familyMembers.find((obj:any) => obj.name === item);
        if (foundObject) {
            const { id, ...rest } = foundObject; 
            return { ...rest, sharedId: id }; 
        } else {
            return null;
        }
    });
    return objects;
  };

  export const getGuestDetails = async (customerId: string, tenantId: number, storeId: number, dispatch: (val: any) => any) => {
    const url = environment.guestUrl + `customers/userbyguestid?tenantId=${tenantId}&storeId=${storeId}&guestId=${customerId}`;
    let response = await makeAPIRequest(url, null, "GET");
    if (response) {
        dispatch(setSelectedGuest({ selectedGuest: response }));
    } else {
        dispatch(setSelectedGuest({ selectedGuest: {} }));
    }
};

