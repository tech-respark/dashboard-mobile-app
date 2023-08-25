import React, { FC, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector } from "../redux/Hooks";
import { selectTenantId } from "../redux/state/UserStates";
import { makeAPIRequest } from "../utils/Helper";
import { environment } from "../utils/Constants";


type UploadImageFieldProps = {
    imageUrl: string,
    handleImageClick?: () => void;
    handleImageDelete?: (index: number, type: string) => void;
    index? : number,
    type?: string
};

const UploadImageField: FC<UploadImageFieldProps> = ({ imageUrl, handleImageClick, handleImageDelete, index, type }) => {  
    return (
        <View>
            <TouchableOpacity onPress={handleImageClick}>
                <View>
                    {imageUrl ?
                        <Image source={{ uri: imageUrl }} style={styles.imageView} />
                        :
                        <View style={styles.noImageView}>
                            <Text style={{ color: GlobalColors.blue, fontSize: FontSize.small }}>Add Image</Text>
                        </View>
                    }
                    {imageUrl &&
                        <View style={styles.imageTop}>
                            <TouchableOpacity onPress={() => console.log('Edit clicked')} style={styles.imageTopIconView}>
                                <Ionicons name="pencil-outline" size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleImageDelete!(index!, type!)} style={styles.imageTopIconView}>
                            <Ionicons name="trash" size={25}/>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imageView: { width: 140, height: 120, margin: 10, borderRadius: 10 },
    noImageView: {
        width: 140,
        height: 120,
        margin: 10,
        borderRadius: 10,
        backgroundColor: GlobalColors.lightGray2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageTop: {
        position: 'absolute',
        width: 140,
        height: 120,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    imageTopIconView: {padding: 5, backgroundColor: 'lightgray', opacity: 0.8, borderRadius: 5}
});

export default UploadImageField;
