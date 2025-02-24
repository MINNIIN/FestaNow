import React from "react";
import { View, Text, Modal, Button, StyleSheet } from "react-native";

type Application = {
  id: string;
  message: string;
  author: string;
  status: string;
  authorId: string;  // 추가: 신청자 ID
};

type ApplicationModalProps = {
  visible: boolean;
  application: Application | null;
  onClose: () => void;
  onCancelApplication: (applicationId: string) => void;
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
  userId: string;  // 추가: 현재 사용자 ID
};

const ApplicationModal = ({
  visible,
  application,
  onClose,
  onCancelApplication,
  onAcceptApplication,
  onRejectApplication,
  userId,  // 프롭스로 전달받은 userId
}: ApplicationModalProps) => {
  if (!application) return null;

  // authorId 게시글 작성자(모임장)과 지금 로그인 되어 있는 사용자가 다르면 내가 신청한 모임 (isApplicant = true)
  const isApplicant = application.authorId !== userId;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>작성자: {application.author}</Text>
          <Text>내용: {application.message}</Text>
          <Text>상태: {application.status}</Text>

          {isApplicant ? (
            // 신청자일 때 (내가 신청한 모임)
            <>
              <Button title="신청 취소" onPress={() => onCancelApplication(application.id)} />
              <Button title="닫기" onPress={onClose} />
            </>
          ) : (
            // 모임장일 때
            <>
              <Button title="신청 승인" onPress={() => onAcceptApplication(application.id)} />
              <Button title="신청 거절" onPress={() => onRejectApplication(application.id)} />
              <Button title="닫기" onPress={onClose} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

export default ApplicationModal;
