import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CreatePostButtonProps = {
  onPress: () => void;
};

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>작성 완료</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4374D9', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white', 
    fontSize: 16, 
    
  },
});

export default CreatePostButton;
