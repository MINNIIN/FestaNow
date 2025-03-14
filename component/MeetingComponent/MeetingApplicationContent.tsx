import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";

const { width, height } = Dimensions.get("window");

type Application = {
    id: string;
    postId: string;
    nicName: string;
    message: string;
    title?: string;   // 모임 제목 추가
    imageUrl?: string; // 모임 이미지 추가
    createdAt: string;
};

type Props = {
    applications: Application[];
    onApplicationClick: (application: Application) => void;
};

const MeetingApplicationContent = ({ applications, onApplicationClick }: Props) => {
    const [meetingsInfo, setMeetingsInfo] = useState<Application[]>([]);
    const [applicationsInfo, setApplicationsInfo] = useState<Application[]>([]);

    useEffect(() => {
        const fetchMeetingsInfo = async () => {
    try {
        // 백엔드에서 모임(meetings) 목록 가져오기
        // const response = await fetch("http://43.200.57.176:3000/api/meetings"); // 이거는 예전에 게시글 조회, 검색하는 API를 불러오는거임
        const response = await fetch("http://192.168.219.154:8081/api/meetings");
        const meetingsData: Application[] = await response.json();
        setMeetingsInfo(meetingsData);

        // 신청서 리스트에 모임 제목(title)과 이미지(imageUrl) 추가
        const updatedApplications = applications.map(app => {
            const meeting = meetingsData.find(m => m.id === app.postId); // ID가 일치하는 모임 찾기
            return {
                ...app,
                title: meeting?.title || "제목 없음", // 모임 제목 추가
                imageUrl: meeting?.imageUrl || "", // 이미지 URL 추가
            };
        });

        // createdAt 기준으로 내림차순 정렬
        const sortedApplications = updatedApplications.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // 내림차순 정렬
        });

        setApplicationsInfo(updatedApplications);
    } catch (error) {
        console.error("서버에서 데이터 가져오기 실패:", error);
    }
};

        fetchMeetingsInfo();
    }, [applications]);

    return (
        <View style={styles.container}>
            {applicationsInfo.length > 0 ? (
                <FlatList
                    data={applicationsInfo}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onApplicationClick(item)}>
                            <View style={styles.applicationItem}>
                                {item.imageUrl ? (
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                ) : null}
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.nicName}>신청자: {item.nicName}</Text>
                                <Text style={styles.contentText}>{item.message}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.scrollContent}
                />
            ) : (
                <Text style={styles.noDataText}>신청 내역이 없습니다.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        alignSelf: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    nicName: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 5,
    },
    applicationItem: {
        backgroundColor: "#ffffff",
        padding: 12,
        marginVertical: 5,
        borderRadius: 10,
        borderColor: '#D5D5D5',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        alignItems: "center",
    },
    contentText: {
        fontSize: 16,
        color: "#353535",
    },
    noDataText: {
        textAlign: "center",
        color: "#888",
        fontSize: 14,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginBottom: 5,
    },
    scrollContent: {
        paddingBottom: 200,  // 스크롤 끝에 여백 추가
        minHeight: height,  // 최소 높이를 화면 크기만큼 설정
    },
});

export default MeetingApplicationContent;
