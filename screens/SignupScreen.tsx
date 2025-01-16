import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Firebase Authentication 사용


// 사용자별 관심사 카테고리 선택 페이지

type SignupScreenNavigationProp = StackNavigationProp<any, 'Signup'>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const interestsList = [
  '콘서트',
  '페스티벌',
  '뮤지컬',
  '클래식',
  '전시',
  '스포츠',
];

const SignupScreen = ({ navigation }: Props) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInterestSelect = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        Alert.alert('선택 불가', '최대 3개의 관심사를 선택할 수 있습니다.');
      }
    }
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert('오류', '최소 하나의 관심사를 선택해주세요.');
      return;
    }

    try {
      // Firebase 인증을 통해 현재 사용자 ID (uid) 가져오기
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        return;
      }

      // Firestore에 해당 사용자의 관심사 저장
      await firestore().collection('users').doc(user.uid).set({
        interests: selectedInterests,
      });

      console.log('관심사가 성공적으로 저장되었습니다:', selectedInterests);
      // 다음 페이지로 이동
      navigation.navigate('NextSignupPage');
    } catch (error) {
      console.error('Firebase 저장 오류:', error);
      Alert.alert('오류', '데이터 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <ImageBackground source={require('../images/signup_background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>환영합니다!</Text>
        <Text style={styles.secondText}>관심사를 최대 3개 선택해주세요.</Text>

        <View style={styles.interestsContainer}>
          {interestsList.map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestButton,
                selectedInterests.includes(interest) && styles.selectedButton,
              ]}
              onPress={() => handleInterestSelect(interest)}
            >
              <Text
                style={[
                  styles.interestButtonText,
                  selectedInterests.includes(interest) && styles.selectedButtonText,
                ]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSaveInterests}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    alignSelf: 'flex-start', // 왼쪽 정렬
  },
  secondText: {
    fontSize: height * 0.025,
    color: 'black',
    marginBottom: 80,
    alignSelf: 'flex-start',
  },
  interestsContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interestButton: {
    width: width * 0.4,
    height: height * 0.07,
    backgroundColor: '#f0f0f0',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: '#D9E5FF',
  },
  interestButtonText: {
    fontSize: height * 0.02,
    color: 'black',
  },
  selectedButtonText: {
    color: '#000',
  },
  nextButton: {
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: '#A0BAED',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 100,
  },
  nextButtonText: {
    color: '#4C4C4C',
    fontSize: height * 0.025,
  },
});

export default SignupScreen;
