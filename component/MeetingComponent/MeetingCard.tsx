import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type MeetingCardProps = {
    meeting: {
        id: string;
        title: string;
        description: string; // 이건 meetings 필드에에 없음
        imageUrl?: string; // 모임 이미지 (선택 사항)
        performanceName: string;
        performanceDate: string;
    };
    onPress?: () => void;
};

const MeetingCard = ({ meeting, onPress }: MeetingCardProps) => {
    const defaultImage = 'https://festanow-bucket.s3.ap-northeast-2.amazonaws.com/default+image.png';
    const navigation = useNavigation();

    const formattedDate = new Date(meeting.performanceDate).toLocaleDateString('ko-KR');

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
        >
            <Image source={{ uri: meeting.imageUrl ? meeting.imageUrl : defaultImage }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{meeting.performanceName}</Text>
                <Text style={styles.description}>공연 날짜 : {formattedDate}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#BDBDBD",
        marginVertical: 8,
        width: width - 20,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    placeholderImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    placeholderText: {
        color: "#888",
        fontSize: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
});

export default MeetingCard;
