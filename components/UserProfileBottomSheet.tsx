import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const UserProfileBottomSheet = () => {
  return (
    <BottomSheetModal
      index={1}
      snapPoints={['25%', '50%']} // Define the snap points as per your requirement
      style={{ margin: 20 }}
    >
      <View>
        {/* Your bottom sheet content */}
        <Text>User Profile</Text>
        {/* Add your user profile content here */}
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

export default UserProfileBottomSheet;
