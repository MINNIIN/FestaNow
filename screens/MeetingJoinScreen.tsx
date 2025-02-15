import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, Dimensions } from "react-native";
import ScreenTitle from "../component/ScreenTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import HomeBottomMenu from "../component/HomeBottomMenu";
import { RouteProp } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import MeetingSubmitButton from "../component/MeetingComponent/MeetingSubmitButton";
import axios from "axios"; 

type MeetingJoinScreenProps = StackNavigationProp<any, 'MeetingJoin'>;
type MeetingJoinScreenRouteProps = RouteProp<any, 'MeetingJoin'>;

type Props = {
    navigation: MeetingJoinScreenProps;
    route: MeetingJoinScreenRouteProps;
};

const { width, height } = Dimensions.get('window');

const MeetingJoinScreen = ({ navigation, route }: Props) => {
    const [message, setMessage] = useState("");
    const { postId, userId, authorId } = route.params ?? { postId: "", userId: "", authorId: "" };

    // 신청자 정보 가져옴
    const getApplicantNicName = async (userId: string) => {
        try {
            const userDoc = await firestore().collection("users").doc(userId).get();
            console.log("Firestore에서 가져온 신청자 문서:", userDoc.data()); 
            
            return userDoc.exists && userDoc.data()?.nicName ? userDoc.data()?.nicName : "unknown";   // nicName 없을 경우 기본값 설정
        } catch (error) {
            console.error("신청자의 nicName 조회 실패:", error);
            return "익명 사용자"; 
        }
    };

    // 모임장 정보 가져옴
    const getHostFcmToken = async (hostId: string) => {
        try {
            const hostDoc = await firestore().collection("users").doc(hostId).get();
            console.log("Firestore에서 가져온 host 문서:", hostDoc.data()); // 로그 추가
    
            const fcmToken = hostDoc.exists ? hostDoc.data()?.fcmToken : null;
            if (!fcmToken) {
                console.error("모임장의 FCM 토큰이 Firestore에 저장되어 있지 않습니다.");
            }
            return fcmToken;
        } catch (error) {
            console.error("모임장 FCM 토큰 조회 실패:", error);
            return null;
        }
    };

    const sendPushNotification = async (hostId: string, meetingTitle: string, applicantNicName: string) => {
        const fcmToken = await getHostFcmToken(hostId);
        if (!fcmToken) {
            console.error("모임장의 FCM 토큰이 없습니다.");
            return;
        }
        try {
            await axios.post("http://13.209.103.241:8080/api/send-notification", {
                targetToken: fcmToken,
                title: "새로운 모임 신청",
                message: `${applicantNicName}님이 "${meetingTitle}" 모임에 신청서를 보냈습니다!`,
            });
            console.log("모임장에게 푸시 알림 전송 성공");
        } catch (error) {
            console.error("푸시 알림 전송 실패:", error);
        }
    };

    const handleSubmit = async () => {
        if (message.trim() === "") {
            Alert.alert("알림", "자기소개와 메시지를 입력해 주세요.");
            return;
        }
        try {
            const db = firestore();
            const applicantNicName = await getApplicantNicName(userId);
            const meetingDoc = await db.collection("meetings").doc(postId).get();
            const meetingTitle = meetingDoc.exists ? meetingDoc.data()?.title : "모임";
            await db.collection("meetings").doc(postId).collection("applications").add({
                userId, 
                authorId, 
                message, 
                createdAt: firestore.FieldValue.serverTimestamp(),
                nicName: applicantNicName,  // 신청자의 nicName
                meetingTitle: meetingTitle,  // 모임의 title
                postId,  // 모임의 ID 추가
            });
            
            await sendPushNotification(authorId, meetingTitle, applicantNicName);
            Alert.alert("신청 완료", "모임 참여 신청이 완료되었습니다!");
            navigation.navigate("Home");
        } catch (error) {
            console.error("신청 실패:", error);
            Alert.alert("오류", "신청을 처리하는 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <ScreenTitle onLeftPress={() => navigation.goBack()} onLogoPress={() => navigation.navigate("Home")} onMyPagePress={() => navigation.navigate("FirstMypage")} />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>작성자의 승인이 필요해요</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="간단한 자기소개와 작성자에게 메시지를 남겨보세요!"
                    placeholderTextColor="#888"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                />
                <MeetingSubmitButton onPress={handleSubmit} />
            </View>
            <View style={styles.bottomMenuContainer}>
                <HomeBottomMenu
                    onHomePress={() => navigation.navigate("Home")}
                    onMeetingPress={() => navigation.navigate("Meeting")}
                    onChattingPress={() => navigation.navigate("Chatting")}
                    onCalendarPress={() => navigation.navigate("Schedule")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        marginTop: 100,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        color: '#4C4C4C',
        fontWeight: 'bold',
    },
    inputBox: {
        width: "100%",
        height: height * 0.3,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        textAlignVertical: "top",
        marginBottom: 20,
        fontSize: 16,
    },
    bottomMenuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

export default MeetingJoinScreen;
