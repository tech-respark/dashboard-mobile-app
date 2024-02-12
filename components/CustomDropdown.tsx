import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { GlobalColors } from '../Styles/GlobalStyleConfigs';

interface Props {
  data: string[];
  onSelect: (item: string, index?: number) => void;
  renderContent: () => React.ReactElement<any, any>;
  optionWidth?: number;
  position?: 'top' | 'below'
}

const CustomDropdown: FC<Props> = ({ data, onSelect, renderContent, optionWidth, position='below' }) => {
  const DropdownButton = useRef(null);
  const MAX_DROPDOWN_HEIGHT = 280;
  const MAX_ELEMENT_HEIGHT = 40;
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState<number>(optionWidth ?? 0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, fy, _w, h, px, py) => {
      const itemCount = data.length;
      const dropdownHeight = Math.min(itemCount * MAX_ELEMENT_HEIGHT, MAX_DROPDOWN_HEIGHT);
      position=='below' ? setDropdownTop(py + h) : setDropdownTop(py - dropdownHeight);
      !optionWidth && setDropdownWidth(_w)
      setDropdownLeft(px);
    });
    setVisible(true);
  };

  const onItemPress = (item: any, index: number): void => {
    onSelect(item, index);
    setVisible(false);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={[styles.item, { width: dropdownWidth }]} onPress={() => onItemPress(item, index)}>
      <Text style={{ textTransform: 'capitalize', color: GlobalColors.grayDark }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.dropdown,
              { top: dropdownTop, left: dropdownLeft, maxHeight: MAX_DROPDOWN_HEIGHT },
            ]}
          >
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ maxHeight: MAX_DROPDOWN_HEIGHT }}
              showsVerticalScrollIndicator={true}
              
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };


  return (
    <TouchableOpacity
      ref={DropdownButton}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingVertical: 5,
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: 'lightgray'
  },
});

export default CustomDropdown;