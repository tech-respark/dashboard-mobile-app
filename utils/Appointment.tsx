import { SERVICES_INDEX } from "./Constants";
import { getTofixValue } from "./Helper";

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
    if (true) {
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
                value: getTofixValue(taxApplied, config),
            }
            txchrgs.push(taxObj);
        });
    }
    return txchrgs;
}