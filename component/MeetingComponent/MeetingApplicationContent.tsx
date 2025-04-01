import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

type Application = {
    id: string;
    postId: string;
    nicName: string;
    message: string;
    meetingTitle?: string;   // 모임 제목 추가
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
    const userId = auth().currentUser?.uid;

    const defaultImage = 'https://festanow-bucket.s3.ap-northeast-2.amazonaws.com/default+image.png';

return (
    <View style={styles.container}>
        {applications.length > 0 ? (
            <FlatList
                data={applications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onApplicationClick(item)}>
                        <View style={styles.applicationItem}>
                        <Image source={{ uri: item.imageUrl ? item.imageUrl : defaultImage }} style={styles.image} />
                        <View style={styles.applicationTextContainer}>
                            <Text style={styles.title}>{item.meetingTitle || "제목 없음"}</Text>
                            <Text style={styles.nicName}>신청자: {item.nicName}</Text>
                            <Text style={styles.contentText}>{item.message}</Text>
                        </View>
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
    applicationTextContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    applicationItem: {
        backgroundColor: "#ffffff",
        padding: 12,
        justifyContent: "space-between",
        flexDirection: "row",
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
        width: 100,
        height: 100,
        borderRadius: 5,
        marginBottom: 5,
    },
    scrollContent: {
        paddingBottom: 200,  // 스크롤 끝에 여백 추가
        minHeight: height,  // 최소 높이를 화면 크기만큼 설정
    },
});

export default MeetingApplicationContent;
