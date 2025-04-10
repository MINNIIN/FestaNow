import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type MyPageStackParamList = {
  FavoritePerformances: undefined;
  PushNotificationSettings: undefined;
  AppGuide: undefined;
  Notices: undefined;
  AppUpdate: undefined;
};

type NavigationProp = StackNavigationProp<MyPageStackParamList>;

const MyPageMiddleContent = () => {
  const navigation = useNavigation<NavigationProp>();

  const middleContents = [
    { id: 1, label: '내가 찜한 공연', screen: 'FavoritePerformances' as const },
    { id: 2, label: '앱 가이드 & FAQ', screen: 'AppGuide' as const },
    { id: 3, label: '공지사항', screen: 'Notices' as const },
    { id: 4, label: '버전 정보 & 업데이트 확인', screen: 'AppUpdate' as const },
  ];

  return (
    <View style={styles.container}>
      {middleContents.map((content) => (
        <TouchableOpacity key={content.id} style={styles.item} onPress={() => navigation.navigate(content.screen)}>
          <Text style={styles.text}>{content.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyPageMiddleContent;
