import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MyPageBottomContent = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 이용약관 & 개인정보처리방침 */}
      <View style={styles.policyContainer}>
        <TouchableOpacity>
          <Text style={styles.policyText}>이용약관</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity>
          <Text style={styles.policyText}>개인정보처리방침</Text>
        </TouchableOpacity>
      </View>

      {/* 앱 소개 및 저작권 정보 */}
      <Text style={styles.appInfo}>
        FestaNow
      </Text>
      <Text style={styles.appInfo}>
        공연을 사랑하는 사람들을 연결하고, 새로운 문화를 경험할 기회를 제공
      </Text>
      <Text style={styles.appInfo}>
      합니다. 앱 관련 문의는 문의하기 기능을 이용해 주세요.
      </Text>
      <Text style={styles.copyright}>© 2024 FestaNow. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  policyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  policyText: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 5,
  },
  appInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  copyright: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 10,
  },
});

export default MyPageBottomContent;
