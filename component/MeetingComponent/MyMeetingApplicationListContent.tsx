import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import MeetingCard from "./MeetingCard"; // 모임을 카드 형태로 보여줄 컴포넌트

const { width, height } = Dimensions.get("window");

const MyMeetingApplicationListContent = () => {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;
    const db = firestore();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const fetchMeetings = async () => {
            try {
                const userId = currentUser.uid;
                const meetingList: any[] = [];

                // 내가 만든 모임 조회
                const myMeetingsQuery = firestore().collection("meetings").where("authorId", "==", userId);
                const myMeetingsSnapshot = await myMeetingsQuery.get();
                myMeetingsSnapshot.forEach((doc) => {
                    meetingList.push({ id: doc.id, ...doc.data() });
                });

                // 내가 가입된 모임 조회
                const meetingsQuery = firestore().collection("meetings");
                const meetingsSnapshot = await meetingsQuery.get();

                for (const meetingDoc of meetingsSnapshot.docs) {
                    const membersRef = firestore().collection("meetings").doc(meetingDoc.id).collection("members");
                    const memberQuery = membersRef.where("userId", "==", userId);
                    const memberSnapshot = await memberQuery.get();

                    if (!memberSnapshot.empty) {
                        meetingList.push({ id: meetingDoc.id, ...meetingDoc.data() });
                    }
                }

                setMeetings(meetingList);
            } catch (error) {
                console.error("Error fetching meetings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [currentUser]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {meetings.length > 0 ? (
                <FlatList
                    data={meetings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MeetingCard meeting={item} />}
                    contentContainerStyle={styles.scrollContent}
                />
            ) : (
                <Text style={styles.noMeetingText}>가입된 모임이 없습니다.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height - 100,
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noMeetingText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
        color: "gray",
    },
    scrollContent: {
        paddingBottom: 100,  // 스크롤 끝에 여백 추가
        minHeight: height,  // 최소 높이를 화면 크기만큼 설정
    },
});

export default MyMeetingApplicationListContent;
