import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { subscribeAuth } from '../authService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth'; 

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 3초 후에 Firebase 인증 상태 확인
      const unsubscribe = subscribeAuth((user: FirebaseAuthTypes.User | null) => {
        if (user) {
          navigation.replace('Home'); // 로그인 상태이면 Home 화면으로 이동
        } else {
          navigation.replace('Login'); // 로그인 상태가 아니면 Login 화면으로 이동
        }
      });

      // 구독 해제
      return () => unsubscribe();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../images/festanow_splash.png')}
      style={styles.backgroundImage}
    />
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default SplashScreen;
