import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const ImageUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      if (!selectedImageUri) {
        Alert.alert('이미지 선택에 실패했습니다.');
        return;
      }

      // 선택된 이미지를 상태에 저장
      setSelectedImage(selectedImageUri);
    } else {
      Alert.alert('이미지를 선택하지 않았습니다.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null); // 이미지 삭제
  };

  return (
    <View style={styles.imagePickerContainer}>
      {/* 사진 선택 버튼 */}
      <TouchableOpacity onPress={selectImage} style={styles.imagePickerBox}>
        <Image source={require('../../images/camera_icon.png')} style={styles.cameraIcon} />
      </TouchableOpacity>

      {/* 선택된 이미지 표시 */}
      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          {/* 선택된 이미지 오른쪽 상단에 X 버튼 */}
          <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
            <Image source={require('../../images/x_icon.png')} style={styles.removeIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imagePickerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: width * 0.05,
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
  selectedImageContainer: {
    position: 'relative', 
    width: width * 0.2, 
    height: width * 0.2,
  },
  selectedImage: {
    width: width * 0.2, 
    height: width * 0.2,
    borderRadius: width * 0.05,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // X 버튼 배경을 어두운 반투명 배경으로 설정
    borderRadius: 15,
    padding: 5,
  },
  removeIcon: {
    width: 15,
    height: 15,
    tintColor: '#fff', 
  },
});

export default ImageUploader;
