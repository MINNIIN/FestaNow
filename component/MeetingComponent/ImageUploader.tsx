import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET, REGION, AWS_ACCESS, AWS_SECRET } from '@env';

const { width, height } = Dimensions.get('window'); // 화면 크기 가져오기

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS,
    secretAccessKey: AWS_SECRET,
  },
});

type ImageUploaderProps = {
  onUploadComplete: (imageUrl: string) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri || null);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('이미지를 선택해주세요.');
      return;
    }

    const fileExtension = selectedImage.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
      Alert.alert('지원되지 않는 파일 형식입니다. JPG, JPEG, PNG만 업로드 가능합니다.');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const fileName = selectedImage.split('/').pop() || `image-${Date.now()}.jpg`;

      let mimeType = 'image/jpeg';
      if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'jpeg') {
        mimeType = 'image/jpeg';
      }

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: blob,
        ContentType: mimeType,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
      onUploadComplete(imageUrl);
      Alert.alert('이미지가 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Alert.alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity onPress={selectImage} style={styles.imagePickerBox}>
          <Image source={require('../../images/camera_icon.png')} style={styles.cameraIcon} />
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}
      </View>

      <TouchableOpacity onPress={uploadImage} disabled={!selectedImage || uploading} style={styles.uploadButton}>
        <Text style={styles.uploadText}>선택 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: width * 0.05, 
    
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  imagePickerBox: {
    width: width * 0.2, 
    height: width * 0.2, 
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.05, 
    borderRadius: width * 0.05, 
  },
  cameraIcon: {
    width: width * 0.1,
    height: width * 0.1,
  },
  selectedImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.05, 
  },
  uploadButton: {
    marginTop: height * 0.015,
    backgroundColor: '#B2CCFF',
    width: width * 0.25, 
    height: height * 0.05, 
    borderRadius: width * 0.05, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#000',
    fontSize: width * 0.035, 
    
  },
});

export default ImageUploader;
