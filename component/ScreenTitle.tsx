import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onLeftPress: () => void;
  onLogoPress: () => void;
  onMyPagePress: () => void;
};

const ScreenTitle = ({ onLeftPress, onLogoPress, onMyPagePress }: Props) => {
  return (
    <View style={styles.titleContainer}>
      {/* 좌측 메뉴 버튼 */}
      <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
        <Image source={require('../images/left_icon.png')} style={styles.iconImage} />
      </TouchableOpacity>

      {/* 중앙 로고 */}
      <TouchableOpacity onPress={onLogoPress}>
      <Image source={require('../images/logo_white.png')} style={styles.titleLogo} />
      </TouchableOpacity>

      {/* 우측 버튼 */}
      <TouchableOpacity onPress={onMyPagePress} style={styles.iconButton}>
            <Image source={require('../images/mypage_icon.png')} style={styles.iconImage} />
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

export default ScreenTitle;
