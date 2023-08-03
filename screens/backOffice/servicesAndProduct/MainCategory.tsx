import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FontSize } from "../../../Styles/GlobalStyleConfigs";
import { environment } from "../../../utils/Constants";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import { setIsLoading } from "../../../redux/state/UIStates";
import Toast from "react-native-root-toast";
import CategoryList from "./CategoryList";

const MainCategory = ({ navigation,type }: any) => {
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [categoryList, setCategoryList] = useState<{ [key: string]: any }[]>([]);

    const getCategoryData = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        const subDomain = (type=='service') ? "getServiceCategoriesByTenantAndStore" : "getProductCategoriesByTenantAndStore";
        const url = environment.documentBaseUri + `stores/${subDomain}?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        if (response) {
            setCategoryList(response);
        } else {
            Toast.show("No Data Found");
        }
    };

    const onTextClickHandler = (item: {[key: string]: any}) => {
        if(item.categoryList.length > 0){
            navigation.navigate("SubCategory", {selectedItem: item, type: type})
        }else if(item.itemList.length > 0){
            navigation.navigate("ItemList", {selectedItem: item, routeName: item.name, type: type})
        }
    };

    const editCategory = () => {};

    const addNew = () => { };

    useEffect(() => {
        getCategoryData();
    }, []);

    return (
        <View style={{ padding: 10, flex: 1 }}>
            <Text style={{ fontSize: FontSize.large, fontWeight: 'bold', padding: 5 }}>Category</Text>
            <CategoryList dataList={categoryList} onTextClickHandler={onTextClickHandler} editItemHandler={editCategory} buttonClickHandler={addNew} buttonText="Add New"/>
        </View>
    )
};


export default MainCategory;