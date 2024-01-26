export const environment = {
    sqlBaseUri: "https://dev-respark.respark.in:8081/pcs/v1/",
    documentBaseUri: "https://dev-respark.respark.in:8082/pcs-catalog/v1/",
    appointmentUri: "https://dev-respark.respark.in:8084/pcs-txn/v1/"
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

export const genderOptions: string[] = ["both", "male", "female"];
