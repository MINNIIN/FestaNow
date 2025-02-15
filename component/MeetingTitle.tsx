import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onLeftPress: () => void;
  onLogoPress: () => void;
  onSearchPress: () => void;
};

const MeetingTitle = ({ onLeftPress, onLogoPress, onSearchPress }: Props) => {
  return (
    <View style={styles.titleContainer}>
      
      <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
        <Image source={require('../images/left_icon.png')} style={styles.iconImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogoPress}>
      <Image source={require('../images/logo_white.png')} style={styles.titleLogo} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Image source={require('../images/search_icon.png')} style={styles.iconImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: height * 0.08,
    paddingHorizontal: width * 0.05, 
    backgroundColor: '#ffffff',
  },
  iconButton: {
    width: width * 0.1,  
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: width * 0.08,  
    height: width * 0.08,
    resizeMode: 'contain',
  },
  titleLogo: {
    width: width * 0.4,   
    height: height * 0.07, 
    resizeMode: 'contain',
  },
});

export default MeetingTitle;
