import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { signOut } from '../authService';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenTitle from '../component/ScreenTitle';
import MyPageCategory from '../component/MyPageComponent/MyPageCategory';
import HomeBottomMenu from '../component/HomeBottomMenu';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get('window');

type FirstMypageScreenNavigationProp = StackNavigationProp<any, 'FirstMypage'>;

type Props = {
  navigation: FirstMypageScreenNavigationProp;
};

const FirstMypageScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth().currentUser; // 현재 로그인한 사용자 가져오기
        if (currentUser) {
          const userDoc = await firestore()
            .collection("users")
            .doc(currentUser.uid) // Firestore에서 UID로 사용자 문서 조회
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserName(userData?.name || "알 수 없음"); // 이름 상태 설정
          } else {
            console.log("사용자 문서가 없습니다.");
          }
        } else {
          console.log("로그인한 사용자가 없습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 불러오기 오류:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  const handleCategoryPress = (id: number) => {
    // 클릭된 카테고리 ID에 따른 행동 처리
    const category = categoryButton.find((category) => category.id === id);
    if (category && category.action) {
      category.action(); // 로그아웃 버튼 클릭 시 handleSignOut 실행
    }
  };

  const categoryButton = [
    { id: 1, label: '회원정보수정', icon: require('../images/edit_user_icon.png') },
    { id: 2, label: '비밀번호변경', icon: require('../images/unlock_icon.png') },
    { id: 3, label: '설정', icon: require('../images/option_icon.png') },
    { id: 4, label: '로그아웃', icon: require('../images/exit_icon.png'), action: handleSignOut },
  ];

  return (
    <View style={styles.container}>
      <ScreenTitle
        onLeftPress={() => navigation.goBack()}
        onLogoPress={() => navigation.navigate('Home')}
        onMyPagePress={() => navigation.navigate('FirstMypage')}
      />

      <View style={styles.titleContainer}>
      <Text style={styles.greeting}>
        {userName ? `${userName}님, 환영합니다!` : "로그인이 필요합니다."}
      </Text>
      </View>
      

      <MyPageCategory categories={categoryButton} onCategoryPress={handleCategoryPress} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <HomeBottomMenu 
        onHomePress={() => navigation.navigate('Home')}
        onMeetingPress={() => navigation.navigate('Meeting')}
        onChattingPress={() => navigation.navigate('Chatting')}
        onCalendarPress={() => navigation.navigate('Calendar')}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  titleContainer: {
    width: width,
    height: height * 0.1,
    backgroundColor: '#ffffff',
    justifyContent: 'center', 
    alignItems: 'center', 
  }
});

export default FirstMypageScreen;
