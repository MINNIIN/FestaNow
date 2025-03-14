import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
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
    const [myApplications, setMyApplications] = useState<{ id: string; postId: string; message: string; createdAt: string; nicName: string; title: string; imageUrl: string; }[]>([]);
    const [receivedApplications, setReceivedApplications] = useState<{ id: string; postId: string; message: string; createdAt: string; nicName: string; title: string; imageUrl: string; }[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"received" | "sent">("received"); // 탭 상태 추가
    
    const user = auth().currentUser;
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        // 내가 신청한 신청서 내용 업데이트
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

            // 내 모임에 도착한 신청서 업데이트
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
        return null;
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

            {/* 탭 메뉴 */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, selectedTab === "received" && styles.activeTab]} 
                    onPress={() => setSelectedTab("received")}
                >
                    <Text style={[styles.tabText, selectedTab === "received" && styles.activeTabText]}>
                        도착한 신청서
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, selectedTab === "sent" && styles.activeTab]} 
                    onPress={() => setSelectedTab("sent")}
                >
                    <Text style={[styles.tabText, selectedTab === "sent" && styles.activeTabText]}>
                        신청한 신청서
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 선택된 탭에 따라 다른 내용 표시 */}
            {selectedTab === "received" ? (
                <MeetingApplicationContent  applications={receivedApplications} onApplicationClick={handleApplicationClick} />
            ) : (
                <MeetingApplicationContent  applications={myApplications} onApplicationClick={handleApplicationClick} />
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
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: "#FF4848",
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        color: "#FF4848",
        fontWeight: "bold",
    },
    bottomMenuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

export default MeetingApplicationCheck;
