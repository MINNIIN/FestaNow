// CreatePostButton.tsx
import React from 'react';
import { Button, StyleSheet } from 'react-native';

type CreatePostButtonProps = {
  onPress: () => void;
};

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onPress }) => {
  return (
    <Button title="작성 완료" onPress={onPress} />
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});

export default CreatePostButton;
