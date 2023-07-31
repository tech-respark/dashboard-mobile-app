import React, { FC, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontSize, GlobalColors, GradientButtonColor } from '../Styles/GlobalStyleConfigs';
import { LinearGradient } from 'expo-linear-gradient';

type SwipablePillsType = {
  pills: string[],
  selectedPill: string,
  onSelectPill: (pill: string) => void,
}
const SwipeablePills: FC<SwipablePillsType> = ({ pills, selectedPill, onSelectPill }) => {

  return (
    <View style={{ backgroundColor: GlobalColors.lightGray2 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {pills.map((pill: any, index: number) => (
          selectedPill === pill ?
            <LinearGradient
              key={index}
              colors={GradientButtonColor}
              style={styles.pill}
              start={{ y: 0.0, x: 0.0 }}
              end={{ y: 0.0, x: 1.0 }}
            >
              <TouchableOpacity
                key={index}
                onPress={() => onSelectPill(pill)}
              >
                <Text style={styles.selectedPillText}>{pill}</Text>
              </TouchableOpacity>
            </LinearGradient> :
            <TouchableOpacity
              key={index}
              style={styles.pill}
              onPress={() => onSelectPill(pill)}
            >
              <Text style={styles.pillText}>{pill}</Text>

            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

  )
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: GlobalColors.blue
  },
  selectedPill: {
    backgroundColor: 'blue',
  },
  pillText: {
    color: GlobalColors.blue,
    fontSize: FontSize.regular,
  },
  selectedPillText: {
    color: "#fff",
    fontSize: FontSize.regular,
  }
});

export default SwipeablePills;
