export const environment = {
    sqlBaseUri: "https://dev-respark.respark.in:8081/pcs/v1/",
    documentBaseUri: "https://dev-respark.respark.in:8082/pcs-catalog/v1/",
    guestUrl: "https://dev-respark.respark.in:8083/pcs-guest/v1/",
    txnUrl: "https://dev-respark.respark.in:8084/pcs-txn/v1/"
    // sqlBaseUri: "https://qa.respark.in:8081/pcs/v1/",
    // documentBaseUri: "https://qa.respark.in:8082/pcs-catalog/v1/",
    // guestUrl: "https://qa.respark.in:8083/pcs-guest/v1/",
    // txnUrl: "https://qa.respark.in:8084/pcs-txn/v1/"
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

export const appointmentTabsColorCode: {[key: string]: string} = {
    "future": "#A020F0",
    "completed": "#197af1",
    "cancelled": "red",
    "confirmed": "#FFFF00"
}

export const genderOptions: string[] = ["both", "male", "female"];

export const APPOINTMENT_FETCH_INTERVAL: number = 250000

export const REGULAR_EXP: {[key: string] : any} = {
    mobile: /^[0-9]{10}$/
}

export const MEMBERSHIPCOLORS = [
    {shade1: '#f3f0f8', shade2: '#d3c3f1', shade3: "#9054ff"},
     {shade1: '#ffe9e1', shade2: '#ffd9cb', shade3: "#fa6b37"}, 
     {shade1: '#eefefc', shade2: '#b9e6e6', shade3: "#0d6161"},
     {shade1: '#ffe3b5', shade2: '#efa63d', shade3: "#80510f"},
     {shade1: '#c8f4ed', shade2: '#6ff0dc', shade3: "#197063"},
     {shade1: '#cdf9d9', shade2: '#6ff093', shade3: "#1c8539"}
    ]

export const SHOW_SHIFT_MEMBERSHIP_AFTER_DAYS: number = 10
