export type BackOfficeOptions = 'Home Page' | 'Services' | 'Product'| 'Staff Mgmt';
export type ServiceDetailsType = {
    service: { [key: string]: any },
    experts: { [key: string]: any }[],
    fromTime: string,
    toTime: string
};
