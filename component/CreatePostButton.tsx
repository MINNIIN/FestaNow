import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CreatePostButtonProps = {
  onPress: () => void;
};

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.createButton} onPress={onPress}>
      <Text style={styles.createButtonText}>작성 완료</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: '#4374D9',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GothicA1-Regular'
  },
});

export default CreatePostButton;
