import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import NaverLogin, { NaverLoginResponse, GetProfileResponse } from '@react-native-seoul/naver-login';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const consumerKey = 'udfv0mbXi__1EYPdN65Y';
const consumerSecret = '8yIYzrkeOu';
const appName = 'festanow';

/** setup in iOS */
const serviceUrlScheme = 'naverlogin';

const LoginScreen = ({ navigation }: Props) => {

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const handleLogin = () => {
    console.log("일반 로그인 클릭");
  };

  const handleKakaoLogin = () => {
    console.log("카카오톡 로그인 클릭");
  };

  const handleNaverLogin = async () => {
    try {
      const { successResponse, failureResponse } = await NaverLogin.login();
      if (successResponse) {
        console.log('네이버 로그인 성공:', successResponse);
      } else {
        console.error('네이버 로그인 실패:', failureResponse);
      }
    } catch (error) {
      console.error('네이버 로그인 에러:', error);
    }
  };
  
  const handleLogo = () => {
    navigation.navigate('Home');
  }


  return (
    <ImageBackground
      source={require('../images/festanow_background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <TouchableOpacity onPress={handleLogo}>
          <Image source={require('../images/festanow_logo_black_red.png')} style={styles.logoImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleKakaoLogin}>
          <Text style={styles.kakaoButtonText}>카카오톡 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, styles.naverButton]} onPress={handleNaverLogin}>
          <Text style={styles.naverButtonText}>네이버 로그인</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  logoImage: {
    width: 320, 
    height: 80,
    resizeMode: 'cover', 
    marginBottom: 20,
  },
  loginButton: {
    width: 300,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#5d5d5d', 
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    color: '#000000', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
