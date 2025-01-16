import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginInputNavigationProp = StackNavigationProp<any, 'LoginInput'>;

type Props = {
  navigation: LoginInputNavigationProp;
};

const LoginInputScreen = ({ navigation }: any) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (id === '' || password === '') {
      Alert.alert('오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    // 로그인 처리 로직 추가 (Firebase auth 등)
    Alert.alert('로그인 시도', `ID: ${id}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="로그인" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('비밀번호 찾기', '비밀번호 찾기 기능은 준비 중입니다.')}>
        <Text style={styles.forgotPasswordText}>아이디 또는 비밀번호를 잊어버리셨나요?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  signupText: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginInputScreen;
