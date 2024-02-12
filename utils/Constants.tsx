export const environment = {
    // sqlBaseUri: "https://dev-respark.respark.in:8081/pcs/v1/",
    // documentBaseUri: "https://dev-respark.respark.in:8082/pcs-catalog/v1/",
    // guestUrl: "https://dev-respark.respark.in:8083/pcs-guest/v1/",
    // appointmentUri: "https://dev-respark.respark.in:8084/pcs-txn/v1/"
    sqlBaseUri: "https://qa.respark.in:8081/pcs/v1/",
    documentBaseUri: "https://qa.respark.in:8082/pcs-catalog/v1/",
    guestUrl: "https://qa.respark.in:8083/pcs-guest/v1/",
    appointmentUri: "https://qa.respark.in:8084/pcs-txn/v1/"
}

export const mainTabsIconsMap: {[key: string]: string} = {
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

export const genderOptions: string[] = ["both", "male", "female"];

export const APPOINTMENT_FETCH_INTERVAL: number = 250000
