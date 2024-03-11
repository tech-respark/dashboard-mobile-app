import React, { FC } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";
import moment from "moment";

interface IOrders {
    ordersHistory: { [key: string]: any }[],
}

const Orders: FC<IOrders> = ({ ordersHistory }) => {
    const showProductOrService = (type: string, item: any) => {
        let isTextShown = false;
        return (
            <View>
                {item.products && item.products?.map((product: any, sindex: number) => (
                    product.type == type &&
                    <View key={sindex}>
                        {!isTextShown && (
                            <React.Fragment>
                                {isTextShown = true}
                                <Text style={{ fontSize: FontSize.medium, fontWeight: '500', textTransform: 'capitalize' }}>{type}</Text>
                            </React.Fragment>
                        )
                        }
                        <View style={{ marginVertical: 5 }}>
                            <Text>{product.category}</Text>
                            <View style={GlobalStyles.justifiedRow}>
                                <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: '300', width: '50%' }}>{product.name}</Text>
                                    <Text style={{ fontWeight: '300', width: '50%' }}>{product.staff ? `(By ${product.staff})` : '-'}</Text>
                                </View>
                                <Text>₹{product.billingPrice}</Text>
                            </View>
                            {product.variations?.length > 0 && <Text style={{ fontWeight: '300' }}>({product.variations[0].name})</Text>}
                        </View>
                    </View>
                )
                )}
            </View>
        );
    };

    const renderItem = ({ item, index }: any) => {
        return (
            <View key={index} style={[styles.cardView, GlobalStyles.shadow, { marginVertical: 8 }]}>
                <Text style={{ color: GlobalColors.blue, marginBottom: 10 }}>{moment(item.orderDay).format("YYYY-MM-DD")}</Text>
                {showProductOrService('service', item)}
                {showProductOrService('product', item)}
                <View style={{ borderWidth: 0.5, marginVertical: 10, borderColor: 'lightgray', borderStyle: 'dotted', width: '100%', backgroundColor: 'lightgray' }} />
                <View style={[GlobalStyles.justifiedRow, {}]}>
                    <View style={{ flexDirection: 'row', width: '70%' }}>
                        <Text style={{ fontWeight: '300' }}>Paymode: </Text>
                        <View style={{ width: '75%', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {item.payments?.map((payment: any, tindex: number) => (
                                <Text key={tindex} style={{ fontWeight: '300' }}>{`${payment.name} (${payment.payment}), `}</Text>
                            ))}
                        </View>
                    </View>
                    <Text style={{ fontWeight: '500' }}>Total  ₹{item.paidAmount}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {
                ordersHistory.length > 0 ?
                    <FlatList
                        data={ordersHistory}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ width: '95%' }}
                        showsVerticalScrollIndicator={true}
                    />
                    :
                    <View>
                        <Text style={{ fontSize: FontSize.medium }}>No Orders Yet</Text>
                    </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    cardView: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: 'lightgray',
    },
});

export default Orders;