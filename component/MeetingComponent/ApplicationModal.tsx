import React, { useState, useEffect } from "react";
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const {width, height} = Dimensions.get('window');

type Application = {
  id: string;
  message: string;
  status: string;
  userId: string; // 신청자 UID
  postId: string;
};

const userId = auth().currentUser;

type ApplicationModalProps = {
  visible: boolean;
  application: Application | null;
  onClose: () => void;
  onCancelApplication: (applicationId: string) => void;
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
  userId: string; // 현재 로그인한 사용자 UID
};

const ApplicationModal = ({
  visible,
  application,
  onClose,
  onCancelApplication,
  onAcceptApplication,
  onRejectApplication,
  userId,
}: ApplicationModalProps) => {
  // const [myNickName, setMyNickName] = useState<string | null>(null);
  // const [applicantNickName, setApplicantNickName] = useState<string | null>(null);
  // const [meetingTitle, setMeetingTitle] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchMyNickName = async () => {
  //     try {
  //       const userRef = firestore().collection("users").doc(userId);
  //       const userSnap = await userRef.get();
  //       if (userSnap.exists) {
  //         setMyNickName(userSnap.data()?.nicName || "NoNickName");
  //       } else {
  //         setMyNickName("UnknownUser!");
  //       }
  //     } catch (error) {
  //       setMyNickName("ERROR!");
  //     }
  //   };
  //   fetchMyNickName();
  // }, [userId]);

  // useEffect(() => {
  //   if (application?.userId) {
  //     const fetchApplicantNickName = async () => {
  //       try {
  //         const userRef = firestore().collection("users").doc(application.userId);
  //         const userSnap = await userRef.get();
  //         if (userSnap.exists) {
  //           setApplicantNickName(userSnap.data()?.nicName || "NoNickName");
  //         } else {
  //           setApplicantNickName("UnknownUser!");
  //         }
  //       } catch (error) {
  //         setApplicantNickName("ERROR!");
  //       }
  //     };
  //     fetchApplicantNickName();
  //   }
  // }, [application?.userId]);

  // useEffect(() => {
  //   if (application?.postId) {
  //     const fetchMeetingTitle = async () => {
  //       try {
  //         const meetingRef = firestore().collection("meetings").doc(application.postId);
  //         const meetingSnap = await meetingRef.get();
  //         if (meetingSnap.exists) {
  //           setMeetingTitle(meetingSnap.data()?.title || "Unknown Meeting");
  //         } else {
  //           setMeetingTitle("Unknown Meeting");
  //         }
  //       } catch (error) {
  //         setMeetingTitle("ERROR!");
  //       }
  //     };
  //     fetchMeetingTitle();
  //   }
  // }, [application?.postId]);

  // if (!application) return null;

  // const isApplicant = application.userId === userId;
  if (!application) return null; // application이 null이면 아무것도 렌더링하지 않음

  const isApplicant = application.userId === userId;;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <Text style={styles.contentText}>모임명 : {meetingTitle}</Text> 
          <Text style={styles.contentText}>신청자 : {isApplicant ? myNickName : applicantNickName}</Text>
          <Text style={styles.contentText}>내용 : {application.message}</Text> */}
          

          {isApplicant ? (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onCancelApplication(application.id)}
              >
                <Text style={styles.buttonText}>신청 취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onAcceptApplication(application.id)}
              >
                <Text style={styles.buttonText}>신청 승인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onRejectApplication(application.id)}
              >
                <Text style={styles.buttonText}>신청 거절</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
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
  contentText: {
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FF6450", // 버튼 색상 (파란색)
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ApplicationModal;