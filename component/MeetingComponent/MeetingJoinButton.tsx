import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

type MeetingJoinButtonProps = {
  postId: string;     // 모임 ID
  userId: string;     // 사용자 ID (로그인한 사용자)
};

const { width, height } = Dimensions.get('window');

const MeetingJoinButton = ({ postId, userId }: MeetingJoinButtonProps) => {
  const [isJoined, setIsJoined] = useState(false);  // 참여 여부 상태

  useEffect(() => {
    const checkIfJoined = async () => {
      try {
        const doc = await firestore()
          .collection('meetings')
          .doc(postId)
          .collection('participants')  // 참가자 목록 하위 컬렉션
          .doc(userId)
          .get();

        setIsJoined(doc.exists);  // 문서가 존재하면 이미 참여한 상태로 설정
      } catch (error) {
        console.error('참여 여부 확인 오류:', error);
      }
    };

    checkIfJoined();
  }, [postId, userId]);

  const handleJoin = async () => {
    if (isJoined) {
      Alert.alert('이미 참여한 모임입니다.');
      return;
    }

    try {
      await firestore()
        .collection('meetings')
        .doc(postId)
        .collection('participants')
        .doc(userId)
        .set({
          joinedAt: firestore.FieldValue.serverTimestamp(),
        });

      setIsJoined(true);
      Alert.alert('참여 완료', '모임에 성공적으로 참여했습니다.');
    } catch (error) {
      console.error('모임 참여 오류:', error);
      Alert.alert('오류', '모임에 참여하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isJoined ? styles.joinedButton : styles.joinButton]}
        onPress={handleJoin}
        disabled={isJoined}  // 이미 참여했으면 버튼 비활성화
      >
        <Text style={styles.buttonText}>
          {isJoined ? '참여 완료' : '참여하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: width * 0.3,
    height: height * 0.07,
    position: 'absolute',
    bottom: height * 0.1,
    right: width * 0.05,   
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
  },
  joinedButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MeetingJoinButton;
