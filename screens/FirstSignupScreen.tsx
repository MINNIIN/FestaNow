import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { signUp } from '../authService';

type FirstSignupScreenNavigationProp = StackNavigationProp<any, 'SecondSignup'>;

type Props = {
  navigation: FirstSignupScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const FirstSignupScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [nicName, setNicName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  
  // 중복 체크 상태
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isNicNameTaken, setIsNicNameTaken] = useState(false);

  // 이메일 유효성 검사
  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사
  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
  };

  // 이메일 및 닉네임 중복 체크
  const checkEmailAndNickName = async () => {
    try {
      // 이메일 중복 체크
      const emailSnapshot = await firestore().collection('users').where('email', '==', email).get();
      setIsEmailTaken(!emailSnapshot.empty);

      // 닉네임 중복 체크
      const nicNameSnapshot = await firestore().collection('users').where('nicName', '==', nicName).get();
      setIsNicNameTaken(!nicNameSnapshot.empty);

      const phoneSnapshot = await firestore().collection('users').where('phone', '==', phone).get();
      setIsNicNameTaken(!phoneSnapshot.empty);
    } catch (error) {
      console.error('중복 체크 오류:', error);
    }
  };

  const formatPhoneNumber = (input: string) => {
    // 숫자만 필터링
    const cleaned = input.replace(/[^\d]/g, '');

    // 전화번호 포맷 (010-xxxx-xxxx)으로 변환
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formattedPhone = formatPhoneNumber(text);
    setPhone(formattedPhone);
  };

  useEffect(() => {
    if (email || nicName) {
      checkEmailAndNickName(); // 이메일 또는 닉네임이 변경될 때마다 중복 체크
    }
  }, [email, nicName]);

  const handleSignup = async () => {
    if (!name || !nicName || !email || !password || !confirmPassword || !phone || !birthdate) {
      Alert.alert('오류', '모든 정보를 입력해주세요.');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('오류', '유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert('오류', '비밀번호는 문자, 숫자, 특수문자를 포함하여 8-20자로 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (isEmailTaken) {
      Alert.alert('오류', '이메일이 이미 존재합니다.');
      return;
    }

    if (isNicNameTaken) {
      Alert.alert('오류', '닉네임이 이미 존재합니다.');
      return;
    }

    try {
      const userCredential = await signUp({ email, password });
      const { uid } = userCredential.user;

      await firestore().collection('users').doc(uid).set({
        name,
        nicName,
        email,
        phone,
        birthdate,
      });

      Alert.alert('성공', '회원가입이 완료되었습니다.');
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = (error as Error).message || '회원가입에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require('../images/signup_background.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../images/left_icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>FestaNow가 처음이신가요?</Text>
          <Text style={styles.secondText}>아래 회원 정보를 입력해주세요.</Text>

          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={setName}
          />

<View style={styles.inputWithIcon}>
  <TextInput
    style={styles.input}
    placeholder="닉네임"
    value={nicName}
    onChangeText={setNicName}
  />
  {/* 닉네임 중복 확인 */}
  {nicName.length > 0 && (
    isNicNameTaken ? (
      <Image source={require('../images/x_icon.png')} style={styles.xIcon} />
    ) : (
      !isNicNameTaken && <Image source={require('../images/check_icon.png')} style={styles.checkIcon} />
    )
  )}
</View>

<View style={styles.inputWithIcon}>
  <TextInput
    style={styles.input}
    placeholder="이메일"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
  />
  {/* 이메일 중복 확인 */}
  {email.length > 0 && (
    isEmailTaken ? (
      <Image source={require('../images/x_icon.png')} style={styles.xIcon} />
    ) : (
      !isEmailTaken && <Image source={require('../images/check_icon.png')} style={styles.checkIcon} />
    )
  )}
</View>

          <TextInput
            style={styles.input}
            placeholder="비밀번호 (문자, 숫자, 특수문자 포함 8-20자)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
            {/* 패스워드가 같으면 체크 이미지 표시 */}
            {password === confirmPassword && confirmPassword.length > 0 && (
              <Image
                source={require('../images/check_icon.png')} 
                style={styles.checkIcon}
              />
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="전화번호"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="생년월일 (YYYYMMDD)"
            value={birthdate}
            onChangeText={setBirthdate}
          />

          <TouchableOpacity style={styles.nextButton} onPress={handleSignup}>
            <Text style={styles.nextButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일들 그대로 유지
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontSize: height * 0.033,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  secondText: {
    fontSize: height * 0.025,
    color: 'black',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  input: {
    width: width * 0.8,
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  inputWithIcon: {
    width: width * 0.8,
    height: height * 0.06,
    marginBottom: 15,
    position: 'relative',
  },
  checkIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  xIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  nextButton: {
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: '#A0BAED',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#4C4C4C',
    fontSize: height * 0.022,
  },
  backButton: {
    marginRight: 320,
    marginBottom: 20,
  },
  backIcon: {
    width: width * 0.06,
    height: height * 0.045
  },
});

export default FirstSignupScreen;
