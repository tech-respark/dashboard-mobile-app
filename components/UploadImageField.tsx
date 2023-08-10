import React, { FC, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from 'react-native-image-picker';


type UploadImageFieldProps = {
    imageUrl: string
};

const UploadImageField: FC<UploadImageFieldProps> = ({ imageUrl }) => {

    const handleImageClick = () => {
        // if (!imageUrl) {
        //   ImagePicker.showImagePicker(
        //     {
        //       title: 'Select Image',
        //       mediaType: 'photo',
        //       quality: 0.5,
        //     },
        //     (response) => {
        //       if (!response.didCancel && !response.error) {
        //         setImageUrl(response.uri);
        //       }
        //     }
        //   );
        // } else {
        //   // Handle image edit or delete logic
        //   // For example, show a modal with edit/delete options
        // }
      };

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
                            <TouchableOpacity onPress={() => console.log('Delete clicked')} style={styles.imageTopIconView}>
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
