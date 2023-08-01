import { Ionicons } from "@expo/vector-icons";

export const environment = {
    sqlBaseUri: "https://dev-respark.respark.in:8081/pcs/v1/",
    documentBaseUri: "https://dev-respark.respark.in:8082/pcs-catalog/v1/",
}

export const mainTabsIconsMap: {[key: string]: string} = {
    "POS": "tv-outline",
    "Appointment": "calendar-outline",
    "Backoffice": "document-outline",
    "CRM": "refresh-circle-outline",
    "Setting": "settings-outline",
    "Reports": "trending-up-outline",
    "Expenses": "logo-euro",
    "Campaign": "golf-outline"
};