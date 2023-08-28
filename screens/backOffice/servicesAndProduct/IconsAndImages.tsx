import React, { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import UploadImageField from "../../../components/UploadImageField";
import { FontSize } from "../../../Styles/GlobalStyleConfigs";
import * as ImagePicker from 'expo-image-picker';

type IconsAndImagesProp = {
    showIcons: boolean;
    itemName: string;
    gender?: string,
    bothIcon?: { [key: string]: any };
    setBothIcon?: (val: { [key: string]: any }) => void;
    maleIcon?: { [key: string]: any };
    setMaleIcon?: (val: { [key: string]: any }) => void;
    femaleIcon?: { [key: string]: any };
    setFemaleIcon?: (val: { [key: string]: any }) => void;
    displayImageObjects: { [key: string]: any }[];
    setDisplayImageObjects: (val: any) => void;
    setNewUploadIcon?: (val: boolean[]) => void;
    newImagesIndex: number[];
    setNewImagesIndex: (val: number[]) => void;
};

const IconsAndImages: FC<IconsAndImagesProp> = ({ showIcons, itemName, gender, bothIcon, maleIcon, femaleIcon, displayImageObjects, setBothIcon, setMaleIcon, setFemaleIcon, setDisplayImageObjects, setNewUploadIcon, newImagesIndex, setNewImagesIndex }) => {
   
    const createImageObject = (type: string, url: string) => {
        let index = type == "display" ? displayImageObjects.length + 1 : type == "both" ? 1 : type == "male" ? 2 : 3;
        return {
            active: true,
            deleted: false,
            group: type,
            imagePath: url,
            index: index,
            name: `${itemName}-${type}-${index}`,
        }
    };

    const selectImageFromLocal = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        return result.canceled ? "" : result.assets[0].uri;
    };

    const updateUploadIconAtIndex = (index: number, value: boolean) => {
        setNewUploadIcon!(prevState => {
            const updatedIcons = [...prevState];
            updatedIcons[index] = value;
            return updatedIcons;
          })
      };

    const handleImageUploadClick = async (type: string, isUpdate?: boolean, index?: number) => {
        switch (type) {
            case "both":
                setBothIcon!(createImageObject("both", await selectImageFromLocal()));
                updateUploadIconAtIndex(0, true);
                break;
            case "male":
                setMaleIcon!(createImageObject("male", await selectImageFromLocal()));
                updateUploadIconAtIndex(1, true);
                break;
            case "female":
                setFemaleIcon!(createImageObject("female", await selectImageFromLocal()));
                updateUploadIconAtIndex(2, true);
                break;
            case "display":
                let newImage = await selectImageFromLocal();
                console.log("DISPLAY After image select",isUpdate, newImagesIndex, index);
                !newImagesIndex.includes(index!) ? setNewImagesIndex([...newImagesIndex, displayImageObjects.length]) : null;
                if (isUpdate) {
                    const updatedObjects = [...displayImageObjects];
                    updatedObjects[index!] = { ...updatedObjects[index!], imagePath: newImage };
                    setDisplayImageObjects(updatedObjects);
                } else {
                    setDisplayImageObjects((prevObjects: any) => [...prevObjects, createImageObject("display", newImage)]);
                }
                break;
        }
    };

    const handleImageDelete = (index: number, type: string) => {
        switch (type) {
            case "both":
                setBothIcon!({});
                updateUploadIconAtIndex(0, false);
                break;
            case "male":
                setMaleIcon!({});
                updateUploadIconAtIndex(1, false);
                break;
            case "female":
                setFemaleIcon!({});
                updateUploadIconAtIndex(2, false);
                break;
            case "display":
                setDisplayImageObjects((prev: any) => { const updatedObjects = [...prev]; updatedObjects.splice(index, 1); return updatedObjects; });
        }
    };

    return (
        <>
            {showIcons &&
                <View style={styles.sectionView}>
                    <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Icons</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                        <View>
                            <Text style={{ color: 'gray', fontSize: FontSize.medium }}>Both</Text>
                            <UploadImageField imageUrl={bothIcon!.imagePath} handleImageUpload={handleImageUploadClick} type="both" handleImageDelete={handleImageDelete} />
                        </View>
                        <Text>OR</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                        {gender != "female" &&
                            <View style={{ marginRight: 10 }}>
                                <Text style={{ color: 'gray', fontSize: FontSize.medium }}>Male</Text>
                                <UploadImageField imageUrl={maleIcon!.imagePath} handleImageUpload={handleImageUploadClick} type="male" handleImageDelete={handleImageDelete} />
                            </View>
                        }
                        {gender != "male" &&
                            <View>
                                <Text style={{ color: 'gray', fontSize: FontSize.medium }}>Female</Text>
                                <UploadImageField imageUrl={femaleIcon!.imagePath} handleImageUpload={handleImageUploadClick} type="female" handleImageDelete={handleImageDelete} />
                            </View>
                        }
                    </View>
                </View>
            }
            <View style={styles.sectionView}>
                <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Display Images</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 10 }}
                >
                    {
                        displayImageObjects.map((item: any, index: number) => (
                            <UploadImageField imageUrl={item.imagePath} key={item.imagePath} type="display" handleImageDelete={handleImageDelete} index={index} handleImageUpload={handleImageUploadClick} />
                        ))
                    }
                    <UploadImageField imageUrl={""} handleImageUpload={handleImageUploadClick} type="display" />
                </ScrollView>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    sectionView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 5
    },

});

export default IconsAndImages;