import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  whiteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  modalbackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
},
  isLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 5
  },
  justifiedRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
})