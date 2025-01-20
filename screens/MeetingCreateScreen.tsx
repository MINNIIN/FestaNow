import React, { useState } from "react";
import { View, TextInput, Button, ScrollView, StyleSheet, Text, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from '@react-native-firebase/firestore'; 
import ScreenTitle from "../component/ScreenTitle";
import DateTimePicker from '@react-native-community/datetimepicker';
import DateSelect from '../component/DateSelect'; 
import CreatePostButton from "../component/CreatePostButton";
import auth from '@react-native-firebase/auth';
// import ImageUploader from "../component/MeetingComponent/ImageUploader";

const { width, height } = Dimensions.get('window');

type MeetingCreateScreenNavigationProp = StackNavigationProp<any, 'MeetingCreate'>;

type Props = {
  navigation: MeetingCreateScreenNavigationProp;
};

const MeetingCreateScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState("");
  const [performanceName, setPerformanceName] = useState("");
  const [performanceDate, setPerformanceDate] = useState(new Date()); 
  const [participants, setParticipants] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  

  const handleCreatePost = async () => {

    if (!title || !performanceName || !participants || !writeContent) {
      window.alert('모든 항목을 작성해주세요.');
      return;
    }

  const currentUser = auth().currentUser; // 현재 로그인된 사용자 정보 가져옴
  if (!currentUser) {
    window.alert('로그인이 필요합니다.');
    return;
  }

  try {
    // 현재 사용자 uid로 users 컬렉션에서 nicName 가져오기
    const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
    if (!userDoc.exists) {
      window.alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }
    
    const userData = userDoc.data();
    const nicName = userData?.nicName || '익명';

    const newPost = {
      title,
      performanceName,
      performanceDate: performanceDate.toISOString(),
      participants: parseInt(participants, 10),
      writeContent,
      authorId: currentUser.uid,
      authorNicname: nicName,
      imageUrl,
    };

    
      await firestore().collection('meetings').add(newPost);
      console.log('모집글이 Firebase에 저장되었습니다.');
      navigation.navigate('Meeting');
    } catch (error) {
      console.error('Firebase 저장 중 오류 발생:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScreenTitle
          onLeftPress={() => navigation.goBack()} 
          onLogoPress={() => navigation.navigate('Home')}
          onMyPagePress={() => navigation.navigate('FirstMypage')}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="제목"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="모집 인원"
            value={participants}
            onChangeText={setParticipants}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="공연 이름"
            value={performanceName}
            onChangeText={setPerformanceName}
            style={styles.input}
          />

          
          <DateSelect
            performanceDate={performanceDate}
            setPerformanceDate={setPerformanceDate}
            setShowDatePicker={setShowDatePicker}
          />

          {/* DateTimePicker가 화면에 보이도록 처리 */}
          {showDatePicker && (
            <DateTimePicker
              value={performanceDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || performanceDate;
                setShowDatePicker(false);
                setPerformanceDate(currentDate);
              }}
            />
          )}

          <ScrollView style={styles.scrollContainer}>

            

            <TextInput
              placeholder="내용을 입력해주세요."
              value={writeContent}
              onChangeText={setWriteContent}
              style={styles.contentInput}
              multiline={true} 
            />
          </ScrollView>
        </View>

        <CreatePostButton onPress={handleCreatePost} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  contentInput: {
    height: 320,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    textAlignVertical: 'top',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    marginBottom: 15,
  },
});

export default MeetingCreateScreen;
