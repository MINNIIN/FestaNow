import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

interface ImageUploaderProps {
  onImageSelect: (imageUri: string | null) => void; // 부모 컴포넌트에 이미지 전달
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      if (!selectedImageUri) {
        Alert.alert('이미지 선택에 실패했습니다.');
        return;
      }

      setSelectedImage(selectedImageUri);
      onImageSelect(selectedImageUri); // 부모 컴포넌트로 이미지 전달
    } else {
      Alert.alert('이미지를 선택하지 않았습니다.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelect(null); // 부모 컴포넌트에도 null 전달
  };

  return (
    <View style={styles.imagePickerContainer}>
      <TouchableOpacity onPress={selectImage} style={styles.imagePickerBox}>
        <Image source={require('../../images/camera_icon.png')} style={styles.cameraIcon} />
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
