import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
    whiteContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff"
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
})