// 모임 신청 확인 페이지에서 사용, 상단은 본인이 신청한 신청서 확인, 하단은 본인 모임에 온 신청서 확인

import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

type Props = {
    title: string;
    applications: { id: string; message: string }[];
    onApplicationClick: (application: { id: string; message: string }) => void;
};

const MeetingApplicationContent = ({ title, applications, onApplicationClick  }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {applications.length > 0 ? (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onApplicationClick(item)}>
                            <View style={styles.applicationItem}>
                                <Text>{item.message}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
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
        padding: 10,
        backgroundColor: "#ffffff",
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        // fontWeight: "bold",
        marginBottom: 10,
    },
    applicationItem: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    noDataText: {
        textAlign: "center",
        color: "#888",
    },
});

export default MeetingApplicationContent;
