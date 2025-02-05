import React, { useState, useEffect } from "react"; 
import { View, Text, Dimensions, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from "react-native"; 
import { StackNavigationProp } from "@react-navigation/stack"; 
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const AuthorContentView = ({ post, navigation }: { post: any; navigation: any }) => {
    const handleEdit = () => {
        console.log('수정 클릭');
        // 수정 로직
    };

    const handleDelete = async () => {
        Alert.alert(
            "삭제 확인",
            "정말로 이 게시물을 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await firestore().collection('meetings').doc(post.id).delete();
                            Alert.alert("삭제 완료", "게시물이 삭제되었습니다.");
                            navigation.goBack();
                        } catch (error) {
                            console.error('게시물 삭제 오류:', error);
                            Alert.alert("삭제 실패", "게시물을 삭제하는 중 오류가 발생했습니다.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{post.title}</Text>
            <View style={styles.line}></View>
            <Text style={styles.subTitle}>작성자 : {post.authorNicname}</Text>
            <Text style={styles.subTitle}>공연 이름 : {post.performanceName}</Text>
            <Text style={styles.subTitle}>공연 일자 : {new Date(post.performanceDate).toLocaleDateString()}</Text>
            <Text style={styles.date}>모집 인원 : {post.participants}</Text>
            <View style={styles.line}></View>

            {/* 이미지 표시 */}
            {post.imageUrl && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
                </View>
            )}

            {/* 이미지 여러 개일 경우 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    {post.imageUrls.map((url: string, index: number) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
                        </View>
                    ))}
                </ScrollView>
            )}

            <Text style={styles.content}>{post.writeContent}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 50,
        flex: 1,
        padding: 10,
        width: width,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: '#000',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'gray', // 연한 검은색
        marginVertical: 10, // 위아래 여백
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        height: height * 0.5, // 이미지 컨테이너의 높이
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imageScroll: {
        flexDirection: 'row',
        marginVertical: 10,
    },
});

export default AuthorContentView;
