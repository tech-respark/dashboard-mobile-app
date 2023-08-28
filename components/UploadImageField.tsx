import React, { FC, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";


type UploadImageFieldProps = {
    imageUrl: string,
    handleImageUpload?: (type: string, isUpdate?: boolean, index?: number) => void;
    handleImageDelete?: (index: number, type: string) => void;
    index?: number,
    type?: string,
};

const UploadImageField: FC<UploadImageFieldProps> = ({ imageUrl, handleImageUpload, handleImageDelete, index, type }) => {
    const [loading, setLoading] = useState<boolean>(true);
    return (
        <View>
            <TouchableOpacity onPress={() => handleImageUpload!(type!)}>
                <View>
                    {imageUrl ?
                        <View style={styles.container}>
                            <Image source={{ uri: imageUrl }} style={styles.imageView} onLoadEnd={() => { setLoading(false) }} />
                            <ActivityIndicator style={styles.activityIndicator} animating={loading} />
                        </View>
                        :
                        <View style={styles.noImageView}>
                            <Text style={{ color: GlobalColors.blue, fontSize: FontSize.small }}>Add Image</Text>
                        </View>
                    }
                    {imageUrl && !loading &&
                        <View style={styles.imageTop}>
                            <TouchableOpacity onPress={() => handleImageUpload!(type!, true, index!)} style={styles.imageTopIconView}>
                                <Ionicons name="pencil-outline" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleImageDelete!(index!, type!)} style={styles.imageTopIconView}>
                                <Ionicons name="trash" size={25} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imageView: {
        width: 140,
        height: 120,
        margin: 10,
        borderRadius: 10
    },
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
    imageTopIconView: {
        padding: 5,
        backgroundColor: 'lightgray',
        opacity: 0.8,
        borderRadius: 5
    },
    container: {
        flex: 1,
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
});

export default UploadImageField;
