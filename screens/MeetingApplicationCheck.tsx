import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import ScreenTitle from "../component/ScreenTitle";
import HomeBottomMenu from "../component/HomeBottomMenu";
import MeetingApplicationContent from "../component/MeetingComponent/MeetingApplicationContent";
import ApplicationModal from "../component/MeetingComponent/ApplicationModal";

const { width, height } = Dimensions.get("window");

type MeetingApplicationCheckProps = StackNavigationProp<any, "MeetingApplication">;

type Props = {
    navigation: MeetingApplicationCheckProps;
};

const MeetingApplicationCheck = ({ navigation }: Props) => {
    const [myApplications, setMyApplications] = useState<{ id: string; message: string }[]>([]);
    const [receivedApplications, setReceivedApplications] = useState<{ id: string; message: string }[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const user = auth().currentUser;
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return; // 로그인한 사용자 ID가 없으면 실행하지 않음

        // 내가 신청한 모임 목록 실시간 업데이트.
        const unsubscribeMyApplications = firestore()
            .collectionGroup("applications")
            .where("userId", "==", userId)
            .onSnapshot(
                (snapshot) => {
                    if (snapshot) {
                        setMyApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
                    }
                },
                (error) => {
                    console.error("내 신청 내역을 가져오는 중 오류 발생:", error);
                }
            );

        // 내가 운영하는 모임에 도착한 신청서 실시간 업데이트
        const unsubscribeReceivedApplications = firestore()
            .collectionGroup("applications")
            .where("authorId", "==", userId)
            .onSnapshot(
                (snapshot) => {
                    if (snapshot) {
                        setReceivedApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
                    }
                },
                (error) => {
                    console.error("내 모임 신청 내역을 가져오는 중 오류 발생:", error);
                }
            );

        return () => {
            unsubscribeMyApplications();
            unsubscribeReceivedApplications();
        };
    }, [userId]);

    if (!userId) {
        console.error("사용자 ID를 가져올 수 없습니다.");
        return null; // 렌더링 방지
    }

    const handleApplicationClick = (application: any) => {
        setSelectedApplication(application);
        setModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedApplication(null);
      };
    
      const handleCancelApplication = (applicationId: string) => {
        // 신청 취소 로직 (Firebase, API 호출 등)
        console.log(`신청 취소: ${applicationId}`);
      };
    
      const handleAcceptApplication = (applicationId: string) => {
        // 신청 승인 로직 (Firebase, API 호출 등)
        console.log(`신청 승인: ${applicationId}`);
      };
    
      const handleRejectApplication = (applicationId: string) => {
        // 신청 거절 로직 (Firebase, API 호출 등)
        console.log(`신청 거절: ${applicationId}`);
      };

    return (
        <View style={styles.container}>
            <ScreenTitle
                onLeftPress={() => navigation.goBack()}
                onLogoPress={() => navigation.navigate("Home")}
                onMyPagePress={() => navigation.navigate("FirstMypage")}
            />

            {/* 본인이 신청한 모임 리스트 */}
      <MeetingApplicationContent title="내가 신청한 모임" applications={myApplications} onApplicationClick={handleApplicationClick} />

      {/* 본인 모임에 도착한 신청 리스트 (모임장일 경우만 표시) */}
      {receivedApplications.length > 0 && (
        <MeetingApplicationContent title="내 모임에 도착한 신청서" applications={receivedApplications} onApplicationClick={handleApplicationClick} />
      )}

            <View style={styles.bottomMenuContainer}>
                <HomeBottomMenu
                    onHomePress={() => navigation.navigate("Home")}
                    onMeetingPress={() => navigation.navigate("Meeting")}
                    onChattingPress={() => navigation.navigate("Chatting")}
                    onCalendarPress={() => navigation.navigate("Schedule")}
                />
            </View>

            {/* 신청서 모달 */}
      {selectedApplication && (
        <ApplicationModal
          visible={isModalVisible}
          application={selectedApplication}
          onClose={handleCloseModal}
          onCancelApplication={handleCancelApplication}
          onAcceptApplication={handleAcceptApplication}
          onRejectApplication={handleRejectApplication}
          userId={userId}
        />
      )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: "#fff",
    },
    bottomMenuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

export default MeetingApplicationCheck;
