import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get('window');

type Props = {
    onWritingPress: () => void;
}

const Writing = ( {onWritingPress}: Props ) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onWritingPress}>
        <Image 
          source={require('../images/writing_icon.png')} 
          style={styles.icon}
        />
        <Text style={styles.buttonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: width * 0.3,
    height: height * 0.07,
    position: 'absolute',
    bottom: height * 0.1,
    right: width * 0.05,   
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    width: width * 0.05,
    height: height * 0.03,
    marginRight: 8,
    tintColor: '#fff'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    
  },
});

export default Writing;
