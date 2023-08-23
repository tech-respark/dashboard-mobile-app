import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';

interface Props {
  data: string[];
  onSelect: (item: string, index?: number) => void;
  renderContent: () => React.ReactElement<any, any>;
  optionWidth?: number;
  setX?: number
}

const Dropdown: FC<Props> = ({ data, onSelect, renderContent, optionWidth, setX=100 }) => {
  const DropdownButton = useRef(null);
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
      setDropdownLeft(_px + _w - setX);
    });
    setVisible(true);
  };

  const onItemPress = (item: any, index: number): void => {
    onSelect(item, index);
    setVisible(false);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity style={[styles.item, optionWidth ? {width: optionWidth}: {}]} onPress={() => onItemPress(item, index)}>
      <Text style={{textTransform: 'capitalize'}}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
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
    borderColor: 'gray'
  },
});

export default Dropdown;