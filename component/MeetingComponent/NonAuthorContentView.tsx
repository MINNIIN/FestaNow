import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from '@react-native-firebase/firestore';


const { width, height } = Dimensions.get('window');

const NonAuthorContentView = ({ post, navigation }: { post: any; navigation: any }) => {
    const handleEdit = () => {
      console.log('수정 클릭');
      
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
                <Text style={styles.subTitle}>작성자 : {post.authorNicname}</Text>
                <Text style={styles.subTitle}>공연 이름 : {post.performanceName}</Text>
                <Text style={styles.date}>작성 일자 : {new Date(post.performanceDate).toLocaleDateString()}</Text>
                <Text style={styles.date}>모집 인원 : {post.participants}</Text>
                <Text style={styles.content}>{post.writeContent}</Text>

                
        </View>

    );
  };

  const styles = StyleSheet.create({
    contentContainer: {
        marginTop:50,
        flex: 1,
        padding: 10,
        width: '100%',
        
        backgroundColor: '#ffffff'
      },
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subTitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
      },
      date: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 15,
      },
      content: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
      },
  });
  
  export default NonAuthorContentView;