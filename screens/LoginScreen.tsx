import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Keyboard, ImageBackground, TextInput, Alert, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth'; 
import NaverLogin from '@react-native-seoul/naver-login';
import { signIn } from '../authService';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

// naver 로그인
const consumerKey = 'udfv0mbXi__1EYPdN65Y';
const consumerSecret = '8yIYzrkeOu';
const appName = 'festanow';
const serviceUrlScheme = 'naverlogin';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const userCredential = await signIn({email, password});
      console.log('로그인 성공:', userCredential);
      navigation.navigate('Home');
    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert('오류', '아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleKakaoLogin = () => {
    console.log('카카오톡 로그인 클릭');
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
  };

  const handleSignup = () => {
    navigation.navigate('FirstSignup');
  };

  const handleFindId = () => {
    Alert.alert('알림', '아이디 찾기 기능이 준비 중입니다.');
  };

  const handleFindPassword = () => {
    Alert.alert('알림', '패스워드 찾기 기능이 준비 중입니다.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../images/festanow_background.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={handleLogo}>
            <Image source={require('../images/festanow_logo_black_red.png')} style={styles.logoImage} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.textContainer}>
            <TouchableOpacity onPress={handleFindId}>
              <Text style={styles.findAccountText}>아이디 찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleFindPassword}>
              <Text style={styles.findAccountText}>패스워드 찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>회원가입</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.loginButton, styles.kakaoButton]} onPress={handleKakaoLogin}>
            <Text style={styles.kakaoButtonText}>카카오톡 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.naverButton]} onPress={handleNaverLogin}>
            <Text style={styles.naverButtonText}>네이버 로그인</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
  logoImage: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    height: height * 0.07,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  textContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 35,
    marginTop: 5,
  },
  findAccountText: {
    color: 'white',
    fontSize: height * 0.02,
    textDecorationLine: 'underline',
  },
  signupText: {
    color: 'white',
    fontSize: height * 0.02,
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: width * 0.9,
    height: height * 0.07,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5d5d5d',
  },
  loginButtonText: {
    color: 'white',
    fontSize: height * 0.022,
  },
  divider: {
    width: width * 0.9,
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    marginBottom: 50,
    marginTop: 30,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    color: '#000000',
    fontSize: height * 0.022,
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverButtonText: {
    color: 'white',
    fontSize: height * 0.022,
  },
});

export default LoginScreen;
