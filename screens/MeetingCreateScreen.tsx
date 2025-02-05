import React, { useState } from "react";
import { View, TextInput, ScrollView, StyleSheet, Text, Alert, Dimensions, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from '@react-native-firebase/firestore';
import ScreenTitle from "../component/ScreenTitle";
import DateTimePicker from '@react-native-community/datetimepicker';
import DateSelect from '../component/DateSelect';
import CreatePostButton from "../component/CreatePostButton";
import auth from '@react-native-firebase/auth';
import ImageUploader from "../component/MeetingComponent/ImageUploader";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET, REGION, AWS_ACCESS, AWS_SECRET } from '@env';
import RNFS from 'react-native-fs';
import { Buffer } from "buffer";
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window');

// S3 클라이언트 초기화
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS,
    secretAccessKey: AWS_SECRET,
  },
});
console.log("S3_BUCKET:", S3_BUCKET);

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 이미지 S3 업로드 함수
  const uploadImageToS3 = async (imageUri: string) => {
    try {
      console.log('선택된 이미지 경로:', imageUri);
  
      const fileName = imageUri.split('/').pop(); // 파일 이름 추출
      const filePath = imageUri.replace('file://', ''); // file:// 제거
  
      // 이미지 파일을 base64로 변환
      const base64Image = await RNFS.readFile(filePath, 'base64');
  
      // Base64 데이터를 Buffer 형식의 바이너리 데이터로 변환
      const binaryData = Buffer.from(base64Image, 'base64');
  
      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: binaryData,  // 바이너리 데이터로 변환하여 업로드
        ContentType: 'image/jpeg', // 이미지 타입 지정
      };
  
      // S3에 업로드 실행
      const result = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("이미지 업로드 성공:", result);
  
      Alert.alert("이미지 업로드 성공", `파일 이름: ${fileName}`);
  
      // 업로드된 이미지의 URL 반환
      return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('이미지 업로드 실패:', error); // 에러 로그 확인
      return null;
    }
  };

  // 게시글 생성 처리
  const handleCreatePost = async () => {
    if (!title || !performanceName || !participants || !writeContent) {
      Alert.alert('모든 항목을 작성해주세요.');
      return;
    }

    const currentUser = auth().currentUser; // 현재 로그인된 사용자 정보
    if (!currentUser) {
      Alert.alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 현재 사용자 닉네임 가져오기
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      if (!userDoc.exists) {
        Alert.alert('사용자 정보를 찾을 수 없습니다.');
        return;
      }
      const userData = userDoc.data();
      const nicName = userData?.nicName || '익명';

      let uploadedImageUrl: string | null = null;

      // 이미지 업로드 처리
      if (selectedImage) {
        uploadedImageUrl = await uploadImageToS3(selectedImage);
      }
      
      // Firestore에 게시글 저장
      const newPost = {
        title,
        performanceName,
        performanceDate: performanceDate.toISOString(),
        participants: parseInt(participants, 10),
        writeContent,
        authorId: currentUser.uid,
        authorNicname: nicName,
        imageUrl: uploadedImageUrl, // S3 이미지 URL 저장
        createdAt: firestore.FieldValue.serverTimestamp(), // 작성 시간
      };

      await firestore().collection('meetings').add(newPost);
      console.log('모집글이 Firebase에 저장되었습니다.');
      navigation.navigate('Meeting');
    } catch (error) {
      console.error('Firebase 저장 중 오류 발생:', error);
      Alert.alert('게시글 저장 중 오류가 발생했습니다.');
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
        <ScrollView>
          {/* 이미지 업로더 */}
          <ImageUploader onImageSelect={setSelectedImage} />

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
        </ScrollView>
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
  scrollContainer: {},
});

export default MeetingCreateScreen;