import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Concert: undefined;
  Mypage: undefined;
  Meeting: undefined;
  MeetingCreate: undefined;
  MeetingContent: { postId: string }; // MeetingContent 화면에 전달할 파라미터 타입
  LoginInput: undefined;
  Signup: undefined;
  FirstSignup: undefined;
  FirstMypage: undefined;
  Schedule: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
