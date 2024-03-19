import React, { FC, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FontSize } from '../Styles/GlobalStyleConfigs';
import { GlobalStyles } from '../Styles/Styles';
import moment from 'moment';

interface ITransactionHistoryTable {
    data: { [key: string]: any }[],
    headerList: string[],
    keyList: string[]
}

const TransactionHistoryTable: FC<ITransactionHistoryTable> = ({ data, headerList, keyList }) => {

    const renderItem = ({ item }: any) => {
        return (
            <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'lightgray' }}>
                {keyList.map((keyName: any, index: number) => (
                    <Text key={index} style={[styles.tableCell]}>{["expiryDate", "purchaseDate"].includes(keyName) ? moment(item[keyName]).format('YYYY-MM-DD') : item[keyName]}</Text>
                ))}
            </View>
        )
    };

    return (
        <FlatList
            contentContainerStyle={[GlobalStyles.cardView, GlobalStyles.shadow]}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={() => (
                <View style={{ paddingVertical: 10, backgroundColor: 'lightgray', marginBottom: 5, borderRadius: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    {headerList.map((column: string, index: number) => (
                        <Text key={index} style={[styles.tableHeaderCell]}>{column}</Text>
                    ))}
                </View>
            )}
        />
    );
};

export default TransactionHistoryTable;

const styles = StyleSheet.create({
    tableHeaderCell: {
        flex: 1,
        fontSize: FontSize.small,
        textAlign: 'center',
        fontWeight: '500',
    },
    tableCell: {
        flex: 1,
        fontSize: FontSize.small,
        textAlign: 'center',
    },

});
