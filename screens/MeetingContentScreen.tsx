import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../App'; 
import { Menu, IconButton, Provider } from 'react-native-paper'; 
import MeetingContentTitle from "../component/MeetingContentTitle";
import auth from '@react-native-firebase/auth';
import MeetingJoinButton from "../component/MeetingJoinButton";
import AuthorContentView from "../component/AuthorContentView";
import NonAuthorContentView from "../component/NonAuthorContentView";
import HomeBottomMenu, { handleScroll } from "../component/HomeBottomMenu";

type MeetingContentScreenNavigationProp = StackNavigationProp<any, 'MeetingContent'>;

type Props = {
  route: { params: { postId: string } };
  navigation: MeetingContentScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const MeetingContentScreen = ({ route, navigation }: Props) => {
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [isAuthor, setIsAuthor] = useState<boolean>(false); // 작성자 여부 상태
  const [menuVisible, setMenuVisible] = useState<boolean>(false); // 메뉴 상태
  

  const handleMenuToggle = () => setMenuVisible((prev) => !prev);

  const closeMenu = () => setMenuVisible(false);

  interface Post {
    id: string;
    title: string;
    performanceName: string;
    performanceDate: string;
    participants: number;
    writeContent: string;
    authorId: string;  // authorId 필드 추가
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const doc = await firestore().collection('meetings').doc(postId).get();
        if (doc.exists) {
          const postData: Post = { id: doc.id, ...doc.data() } as Post;  // Post 타입으로 캐스팅
  
          // postData에서 authorId를 가져와 현재 사용자의 UID와 비교
          const currentUser = auth().currentUser;
          if (currentUser && postData.authorId === currentUser.uid) {
            setIsAuthor(true); // 작성자일 경우
          }
  
          setPost(postData); // 게시물 데이터 설정
        }
      } catch (error) {
        console.error('게시물 불러오기 오류:', error);
      }
    };
  
    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    console.log('수정 클릭');
    // 수정 로직
  };

  const handleDelete = async () => {
    if (isAuthor) {
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
                await firestore().collection('meetings').doc(postId).delete();
                Alert.alert("삭제 완료", "게시물이 삭제되었습니다.");
                navigation.goBack();
              } catch (error) {
                console.error('게시물 삭제 오류:', error);
                Alert.alert("삭제 실패", "게시물을 삭제하는 중 오류가 발생했습니다.");
              }
            } 
          }
        ]
      );
    } else {
      Alert.alert("삭제 권한 없음", "작성자만 삭제할 수 있습니다.");
    }
  };

  const handleReport = () => {
    Alert.alert("신고", "게시물을 신고하시겠습니까?");
    // 신고 로직 추가
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  if (!post) {
    return <View><Text>게시물을 불러오는 중입니다...</Text></View>;
  }

  return (
    <Provider>
      <View style={styles.container}>
      
      <View style={styles.fixedHeader}>
        <MeetingContentTitle
          onLeftPress={() => navigation.goBack()}
          onLogoPress={() => navigation.navigate('Home')}
          onEditPress={handleEdit}
          onDeletePress={handleDelete}
          isAuthor={isAuthor}  // isAuthor 상태 전달
          menuVisible={menuVisible}
          onMenuToggle={handleMenuToggle}
        />
      </View>

        <ScrollView contentContainerStyle={styles.scrollContent} >
        {isAuthor ? (
          <AuthorContentView post={post} navigation={navigation} />
        ) : (
          <NonAuthorContentView post={post} navigation={navigation} />
        )}
        </ScrollView>

        {!isAuthor && (
          <MeetingJoinButton postId={post.id} userId={auth().currentUser?.uid || ''} />
        )}

        
      <HomeBottomMenu 
        onHomePress={() => navigation.navigate('Home')}
        onMeetingPress={() => navigation.navigate('Meeting')}
        onChattingPress={() => navigation.navigate('Chatting')}
        onCalendarPress={() => navigation.navigate('Calendar')}
      />

    </View>
      
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지하도록 설정
    backgroundColor: '#5d5d5d',
  },
  fixedHeader: {
    position: 'absolute',  // 화면 상단에 고정
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,  // 스크롤 콘텐츠보다 위에 표시
    backgroundColor: '#ffffff',  // 상단 타이틀의 배경 색상 설정
  },
  scrollContent: {
    alignItems: 'center',
    
    height: 1000, // 임의로 지정함 나중에 콘텐츠 길이에 따라서 스크롤 길이가 조정되도록 수정해야함
  },
});

export default MeetingContentScreen;