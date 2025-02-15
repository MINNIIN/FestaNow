import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import notifee from '@notifee/react-native';

import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import ConcertScreen from './screens/ConcertScreen';
import MypageScreen from './screens/MypageScreen';
import MeetingScreen from './screens/MeetingScreen';
import MeetingCreateScreen from './screens/MeetingCreateScreen';
import MeetingContentScreen from './screens/MeetingContentScreen';
import SignupScreen from './screens/SignupScreen';
import LoginInputScreen from './screens/LoginInputScren';
import FirstSignupScreen from './screens/FirstSignupScreen';
import FirstMypageScreen from './screens/FirstMypageScreen';
import ScheduleScreen from './screens/ScheduleSceen';
import MeetingSearchScreen from './screens/MeetingSearchScreen';
import MeetingJoinScreen from './screens/MeetingJoinScreen';
import MyMeetingApplicationList from './screens/MyMeetingApplicationList';
import MeetingApplicationCheck from './screens/MeetingApplicationCheck';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Concert: undefined;
  Mypage: undefined;
  Meeting: undefined;
  MeetingCreate: undefined;
  MeetingContent: { postId: string };
  LoginInput: undefined;
  Signup: undefined;
  FirstSignup: undefined;
  FirstMypage: undefined;
  Schedule: undefined;
  MeetingSearch: undefined;
  MeetingJoin: undefined;
  MyMeetingApplication: undefined;
  ApplicationCheck: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const updateFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    const currentUser = auth().currentUser;
  
    if (currentUser) {
      // Firestore에 최신 FCM 토큰 저장 (.set을 사용하면 이전 토큰에 덮어씀)
      await firestore().collection('users').doc(currentUser.uid).set({
        fcmToken: fcmToken, // 기존 토큰 덮어쓰기
      });
    }
  };
  
  // FCM 토큰이 갱신될 때마다 호출되는 이벤트 핸들러
  messaging().onTokenRefresh(updateFCMToken);

  // iOS 권한 요청 및 FCM 토큰 가져오기
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('알림 권한 허용됨');
      getFcmToken();
    } else {
      console.log('알림 권한 거부됨');
    }
  };

  // FCM 토큰 가져오기 및 서버 전송
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      const currentUser = auth().currentUser;
      if (currentUser) {
        await firestore().collection('users').doc(currentUser.uid).set(
          {
            fcmToken: fcmToken, // FCM 토큰 저장
          },
          { merge: true } // 기존 데이터 덮어쓰지 않도록 merge 옵션 사용
        );
        console.log('FCM 토큰 Firestore에 저장 성공');
      }

      
      await axios.post('http://13.209.103.241:8080/api/fcm-token', {
        token: fcmToken,
      });

      console.log('FCM 토큰 서버로 전송 성공');
    } catch (error) {
      console.error('FCM 토큰 가져오기 또는 서버 전송 실패:', error);
    }
  };

  useEffect(() => {

    // 알림 채널 생성 20250222
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: '기본 채널',
        sound: 'default',
        vibration: true,
      });
    }

    createChannel();

    requestUserPermission(); // iOS 권한 요청 및 FCM 토큰 가져오기

    // 포그라운드 알림 수신
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('포그라운드 알림 메시지:', remoteMessage);

      //20250222 추가
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default', // 채널 ID 설정
        },
      });
    });

    // 백그라운드 알림 수신
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('백그라운드 알림 메시지:', remoteMessage);

      // 20250222
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default', // 채널 ID 설정
        },
      });
    });

    // ✅ 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Concert" component={ConcertScreen} />
        <Stack.Screen name="Mypage" component={MypageScreen} />
        <Stack.Screen name="Meeting" component={MeetingScreen} />
        <Stack.Screen name="MeetingCreate" component={MeetingCreateScreen} />
        <Stack.Screen name="MeetingContent" component={MeetingContentScreen} />
        <Stack.Screen name="LoginInput" component={LoginInputScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="FirstSignup" component={FirstSignupScreen} />
        <Stack.Screen name="FirstMypage" component={FirstMypageScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="MeetingSearch" component={MeetingSearchScreen} />
        <Stack.Screen name="MeetingJoin" component={MeetingJoinScreen} />
        <Stack.Screen name="MyMeetingApplication" component={MyMeetingApplicationList} />
        <Stack.Screen name="ApplicationCheck" component={MeetingApplicationCheck} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
