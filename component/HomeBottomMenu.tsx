import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Image, Text, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const bottomAnim = new Animated.Value(0); // 애니메이션 값

let lastScrollY = 0; // 이전 스크롤 위치

// handleScroll 도 export
export const handleScroll = (event: any) => {
  const currentScrollY = event.nativeEvent.contentOffset.y;

  if (currentScrollY > lastScrollY + 10) {
    // 아래로 스크롤 시 bottomContainer 숨김
    Animated.timing(bottomAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start();
  } else if (currentScrollY < lastScrollY - 10) {
    // 위로 스크롤 시 bottomContainer 표시
    Animated.timing(bottomAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  lastScrollY = currentScrollY;
};

const HomeBottomMenu = () => {
  return (
    <Animated.View
      style={[
        styles.bottomContainer,
        { transform: [{ translateY: bottomAnim }] }, // 애니메이션 적용
      ]}
    >
      <TouchableOpacity style={styles.bottomButton}>
        <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
        <Text style={styles.bottomButtonText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomButton}>
        <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
        <Text style={styles.bottomButtonText}>사람 모집</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomButton}>
        <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
        <Text style={styles.bottomButtonText}>Known</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomButton}>
        <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
        <Text style={styles.bottomButtonText}>Known</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.08, 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#BDBDBD',
  },
  bottomButton: {
    width: width * 0.2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  bottomButtonText: {
    color: '#000000',
    fontSize: width * 0.04,
  },
  bottomImage: {
    width: width * 0.08, 
    height: height * 0.04,
    resizeMode: 'contain',
  },
});

export default HomeBottomMenu;