import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from '../authService'; 
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

type FirstMypageScreenNavigationProp = StackNavigationProp<any, 'FirstMypage'>;

type Props = {
  navigation: FirstMypageScreenNavigationProp;
};

const FirstMypageScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState<boolean>(false); 

  const handleUserDataChange = () => {
    navigation.navigate('Home');
}

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>

      
      <Button 
        title="회원정보 수정" 
        onPress={() => handleUserDataChange()}
      />

      <Button 
        title="로그아웃" 
        onPress={handleSignOut} 
        disabled={loading} 
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default FirstMypageScreen;
