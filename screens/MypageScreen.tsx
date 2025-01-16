import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from '../authService'; // signOut 함수 불러오기
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';

type MypageScreenNavigationProp = StackNavigationProp<any, 'Mypage'>;

type Props = {
  navigation: MypageScreenNavigationProp;
};

// 사용자 데이터 타입 정의
interface UserData {
  email: string;
  birthdate?: string;
  phone?: string;
}

const MypageScreen = ({ navigation }: Props) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [authError, setAuthError] = useState<string | null>(null); // 에러 상태 추가

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // Firebase Realtime Database에서 사용자 데이터 불러오기
        const userRef = database().ref(`/users/${user.uid}`);
        userRef
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
            } else {
              console.log('사용자 데이터가 존재하지 않습니다.');
              setUserData(null);
            }
            setLoading(false); // 로딩 종료
          })
          .catch((error) => {
            console.error('데이터 불러오기 실패:', error);
            setAuthError('데이터를 불러오지 못했습니다.');
            setLoading(false);
          });
      } else {
        console.log('사용자가 로그인되어 있지 않습니다.');
        setAuthError('로그인되지 않은 사용자입니다.');
        setLoading(false);
      }
    });

    return unsubscribe; // Cleanup: auth 상태 리스너 제거
  }, []);

  // 로그아웃 버튼 핸들러
  const handleSignOut = async () => {
    try {
      await signOut(); // 로그아웃 처리
      navigation.replace('Login'); // 로그인 화면으로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (loading) {
    // 로딩 중일 때 표시할 컴포넌트
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (authError) {
    // 에러가 발생했을 때 표시할 컴포넌트
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{authError}</Text>
        <Button title="로그아웃" onPress={handleSignOut} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      {userData ? (
        <>
          <Text>이메일: {userData.email}</Text>
          <Text>생년월일: {userData.birthdate || '없음'}</Text>
          <Text>전화번호: {userData.phone || '없음'}</Text>
        </>
      ) : (
        <Text>사용자 데이터가 없습니다.</Text>
      )}
      <Button title="로그아웃" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
  },
});

export default MypageScreen;
