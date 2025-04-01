import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import ScreenTitle from "../component/ScreenTitle";
import HomeBottomMenu from "../component/HomeBottomMenu";
import MeetingApplicationContent from "../component/MeetingComponent/MeetingApplicationContent";
import ApplicationModal from "../component/MeetingComponent/ApplicationModal";
import axios from "axios";

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
    
    const userId = auth().currentUser?.uid ?? "";

    useEffect(() => {
        if (!userId) return;

        fetchMyApplications();
        fetchReceivedApplications();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
    
        const unsubscribeReceived = firestore()
            .collection("meetings")
            .where("authorId", "==", userId)
            .onSnapshot((snapshot) => {
                console.log("Firestore snapshot:", snapshot.docs.map(doc => doc.data())); // 데이터 확인
    
                const receivedApps = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    console.log("Received application data:", data); // 개별 데이터 확인
                    return {
                        id: doc.id,
                        postId: data.postId || "",  // 필드가 존재하지 않을 경우 기본값 설정
                        message: data.message || "",
                        createdAt: data.createdAt || "",
                        nicName: data.nicName || "",
                        title: data.title || "",
                        imageUrl: data.imageUrl || "",
                    };
                });
    
                setReceivedApplications(receivedApps);
            });
    
        return () => unsubscribeReceived();
    }, [userId]);

    const fetchMyApplications = async () => {
    // const userId = auth().currentUser?.uid;  
    if (!userId) {
        console.log("사용자가 로그인되지 않았습니다.");
        return;  // 로그인이 되어 있지 않으면 API를 호출하지 않음
    }

    try {
        const response = await fetch(`http://192.168.219.204:8081/api/applications/sent/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        setMyApplications(data);
    } catch (error) {
        console.error("내 신청 내역을 불러오는 중 오류 발생:", error);
    }
};

const fetchReceivedApplications = async () => {
    // const userId = auth().currentUser?.uid;
    if (!userId) {
        console.log("사용자가 로그인되지 않았습니다.");
        return;  // 로그인이 되어 있지 않으면 API를 호출하지 않음
    }

    try {
        const response = await fetch(`http://192.168.219.204:8081/api/applications/received/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        setReceivedApplications(data);
    } catch (error) {
        console.error("내 모임 신청 내역을 불러오는 중 오류 발생:", error);
    }
};

    const handleApplicationClick = (application: any) => {
        setSelectedApplication(application);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedApplication(null);
    };

    const handleCancelApplication = async (applicationId: string) => {
    try {
        const response = await axios.delete(
            `http://192.168.219.204:8081/api/applications/${selectedApplication.postId}/${applicationId}`
        );

        if (response.status === 200) {
            alert('신청서가 취소되었습니다.');
            // ✅ UI에서 신청서 제거
            setReceivedApplications((prev) => prev.filter((item) => item.id !== applicationId));
        }
    } catch (error) {
        console.error('신청서 취소 중 오류 발생:', error);
        alert('취소 중 오류가 발생했습니다.');
    }

    setModalVisible(false);
};
    
    const handleAcceptApplication = async (application: any) => {
        if (!application?.id || !application?.postId) {
            console.error("오류: application.id 또는 application.postId가 존재하지 않음");
            return;
        }
    
        console.log("신청서 승인 요청:", application.id, application.postId);

        try {
            // ✅ 백엔드 API 호출 (신청서 승인 요청)
            const response = await fetch(`http://192.168.219.204:8081/api/applications/${selectedApplication.postId}/${application.id}/status?status=approved`, {
                method: "PATCH",
            });
    
            const result = await response.text();
            console.log("승인 결과:", result);
    
            if (response.ok) {
                alert("신청서가 승인되었습니다.");
    
                // ✅ UI 업데이트: 리스트에서 삭제
                setReceivedApplications((prev) => prev.filter((item) => item.id !== application.id));
            } else {
                alert("승인에 실패했습니다: " + result);
            }
        } catch (error) {
            console.error("신청서 승인 중 오류 발생:", error);
            alert("승인 중 오류가 발생했습니다.");
        }
        setModalVisible(false);
    };
    
    const handleRejectApplication = async (applicationId: string) => {
        try {
            const response = await axios.delete(
                `http://192.168.219.204:8081/api/applications/${selectedApplication.postId}/${applicationId}`
            );
    
            if (response.status === 200) {
                alert('신청서가 거절되었습니다.');
                // ✅ UI에서 신청서 제거
                setReceivedApplications((prev) => prev.filter((item) => item.id !== applicationId));
            }
        } catch (error) {
            console.error('신청서 거절 중 오류 발생:', error);
            alert('거절 중 오류가 발생했습니다.');
        }
    
        setModalVisible(false);
    };

    useEffect(() => {
        // receivedApplications 상태가 변경될 때마다 UI가 자동으로 업데이트됩니다.
    }, [receivedApplications]);

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
          onAcceptApplication={() => {
            console.log("승인 버튼 클릭됨", selectedApplication);
            handleAcceptApplication(selectedApplication);
            }}
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