import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

type MeetingJoinButtonProps = {
  postId: string;     // 모임 ID
  userId: string;     // 현재 로그인한 사용자 ID
  onJoinPress: () => void;
};

const { width, height } = Dimensions.get('window');

const MeetingJoinButton = ({ postId, userId, onJoinPress }: MeetingJoinButtonProps) => {
  const [isAuthor, setIsAuthor] = useState(false);  // 작성자인지 여부

  useEffect(() => {
    const checkAuthor = async () => {
      try {
        const meetingDoc = await firestore().collection('meetings').doc(postId).get();
        if (meetingDoc.exists) {
          const data = meetingDoc.data();
          if (data?.authorId === userId) {
            setIsAuthor(true);  // 현재 사용자가 작성자라면 true
          }
        }
      } catch (error) {
        console.error('작성자 확인 오류:', error);
      }
    };

    checkAuthor();
  }, [postId, userId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isAuthor ? styles.disabledButton : styles.activeButton]}
        onPress={onJoinPress}
        disabled={isAuthor} // 작성자이면 버튼 비활성화
      >
        <View style={styles.buttonContent}>
          <Image source={require('../../images/letterPlus_icon.png')} style={styles.icon} />
          <Text style={styles.buttonText}>
            {isAuthor ? '작성자' : '참여'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: '#DAD9FF',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  icon: {
    // tintColor: '#fff',
    width: 30,  
    height: 30, 
    marginRight: 5, 
  },
});

export default MeetingJoinButton;
