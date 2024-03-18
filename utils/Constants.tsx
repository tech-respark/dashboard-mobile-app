export const environment = {
    sqlBaseUri: "https://dev-respark.respark.in:8081/pcs/v1/",
    documentBaseUri: "https://dev-respark.respark.in:8082/pcs-catalog/v1/",
    guestUrl: "https://dev-respark.respark.in:8083/pcs-guest/v1/",
    txnUrl: "https://dev-respark.respark.in:8084/pcs-txn/v1/",
    // sqlBaseUri: "https://qa.respark.in:8081/pcs/v1/",
    // documentBaseUri: "https://qa.respark.in:8082/pcs-catalog/v1/",
    // guestUrl: "https://qa.respark.in:8083/pcs-guest/v1/",
    // txnUrl: "https://qa.respark.in:8084/pcs-txn/v1/"
}

export const mainTabsIconsMap: { [key: string]: string } = {
    "POS": "tv",
    "Appointment": "calendar-o",
    "Backoffice": "file-text-o",
    "CRM": "refresh",
    "Setting": "cog",
    "Reports": "line-chart",
    "Expenses": "rupee",
    "Campaign": "bullhorn"
};

export const appointmentColorCodes: { [key: string]: string } = {
    "CONFIRMED": "#f8c068",
    "CHECKIN": "#77e63d",
    "CANCELLED": "#ff8787",
    "COMPLETED": "#6cd6cc"
};

export const appointmentTabsColorCode: { [key: string]: string } = {
    "future": "#A020F0",
    "completed": "#197af1",
    "cancelled": "red",
    "confirmed": "#FFFF00"
}

export const genderOptions: string[] = ["both", "male", "female"];

export const APPOINTMENT_FETCH_INTERVAL: number = 30000

export const REGULAR_EXP: { [key: string]: any } = {
    mobile: /^[0-9]{10}$/
}

export const MEMBERSHIPCOLORS: { [key: string]: any } = {
    '2': "#9054ff",
    '1': "#fa6b37",
    '5': "#0d6161",
    '4': "#80510f",
    '3': "#197063",
    '6': "#1c8539"
}

export const MEMBERSHIPBACKGROUNDS: { [key: string]: any } = {
    '1': require('../assets/backgroundMembershipCards/1.png'),
    '2': require('../assets/backgroundMembershipCards/2.png'),
    '3': require('../assets/backgroundMembershipCards/3.png'),
    '4': require('../assets/backgroundMembershipCards/4.png'),
    '5': require('../assets/backgroundMembershipCards/5.png'),
    '6': require('../assets/backgroundMembershipCards/6.png'),
}

export const SHOW_SHIFT_MEMBERSHIP_AFTER_DAYS: number = 10
export const DEFAULT_SERVICE_DURATION = 30;
export const SERVICES_INDEX = 0;
export const PRODUCTS_INDEX = 1;
export const MEMBERSHIPS_INDEX = 2;
export const PACKAGES_INDEX = 3;
export const APPOINTMENT_CREATED = "CREATED";
export const APPOINTMENT_RUNNING = "RUNNING";
export const APPOINTMENT_CONFIRMED = "CONFIRMED";
export const APPOINTMENT_CHECKIN = "CHECKIN";
export const APPOINTMENT_UPDATED = "UPDATED";
export const APPOINTMENT_COMPLETED = "COMPLETED";
export const APPOINTMENT_DELETED = "DELETED";
export const APPOINTMENT_CANCELLED = "CANCELLED";