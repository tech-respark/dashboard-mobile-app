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
  setX?: number
}

const Dropdown: FC<Props> = ({ data, onSelect, renderContent, optionWidth, setX = 100 }) => {
  const DropdownButton = useRef(null);
  const DropdownList = useRef(null);
  const MAX_DROPDOWN_HEIGHT = 250;
  const MAX_ELEMENT_HEIGHT = 40;
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [scrollPosition, setScrollPosition] = useState(0);


  useEffect(() => {
    const onLayout = () => { setWindowHeight(Dimensions.get('window').height); };
    const subscription = Dimensions.addEventListener('change', onLayout);
    return () => { subscription.remove(); };
  }, []);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, fy, _w, h, px, py) => {
      const itemCount = data.length;
      const dropdownHeight = Math.min(itemCount * MAX_ELEMENT_HEIGHT, MAX_DROPDOWN_HEIGHT);
      const spaceBelow = py + h + dropdownHeight <= windowHeight;
      const spaceAbove = py - dropdownHeight >= 0;

      if (spaceBelow || (scrollPosition > 0 && spaceAbove)) {
        setDropdownTop(py + h);
      } else {
        setDropdownTop(py - dropdownHeight);
      }

      setDropdownLeft(px + _w - setX);
    });
    setVisible(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  const onItemPress = (item: any, index: number): void => {
    onSelect(item, index);
    setVisible(false);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={[styles.item, optionWidth ? { width: optionWidth } : {}]} onPress={() => onItemPress(item, index)}>
      <Text style={{ textTransform: 'capitalize' }}>{item}</Text>
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
              onScroll={handleScroll}
              ref={DropdownList}
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
    borderColor: GlobalColors.blue
  },
});

export default Dropdown;