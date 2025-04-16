import React, { useEffect, useState } from "react";
import { View, FlatList, Dimensions, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MeetingTitle from "../component/MeetingTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import HomeBottomMenu from "../component/HomeBottomMenu";
import firestore from '@react-native-firebase/firestore';
import Writing from "../component/Writing";
import MeetingCategory from "../component/MeetingComponent/MeetingCategory";

const { width, height } = Dimensions.get('window');

type MeetingScreenNavigationProp = StackNavigationProp<any, 'Meeting'>;

type Props = {
  navigation: MeetingScreenNavigationProp;
};

const MeetingScreen = ({ navigation }: Props) => {
  const [posts, setPosts] = useState<any[]>([]);

  // 사용자가 이미지 선택 안 했을 경우 기본 이미지
  const defaultImage = 'https://festanow-bucket.s3.ap-northeast-2.amazonaws.com/default+image.png';

  useEffect(() => {
    // REST API를 통해 데이터 가져오기
    const fetchMeetings = async () => {
      try {  // AWS EC2에 API 배포 후 해당 서버 고정 url 가져옴
        const response = await fetch("http://43.200.57.176:3000/api/meetings");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("서버에서 데이터 가져오기 실패:", error);
      }
    };

    fetchMeetings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');  // 한국 형식으로 날짜 출력 (yyyy-mm-dd)
  };

  return (
    <View style={styles.container}>
      <MeetingTitle
        onLeftPress={() => navigation.navigate('Home')} 
        onLogoPress={() => navigation.navigate('Home')}
        onSearchPress={() => navigation.navigate('MeetingSearch')}
      />

      {/* <Text style={styles.topText}>관심 있는 모임에 참여하거나 모임을 만들어보세요!</Text> */}
      <MeetingCategory 
      onMyMeetingCheckPress={() => navigation.navigate('Chatting')}
      onApplicationCheckPress={() => navigation.navigate('ApplicationCheck')}/>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('MeetingContent', { postId: item.id })}
          >
            {/* 카드 이미지 */}
            <Image 
              source={{ uri: item.imageUrl || defaultImage }} 
              style={styles.cardImage}
            />
            {/* 카드 텍스트 */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {/* 공연명 표시 */}
              <Text style={styles.cardDescription}>
                {item.performanceName || '공연 이름 없음'}
              </Text>
              <Text style={styles.cardDate}>공연 날짜 : {formatDate(item.performanceDate) || '날짜 정보 없음'}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <Writing 
        onWritingPress={() => navigation.navigate('MeetingCreate')}
      />

      <HomeBottomMenu 
        onHomePress={() => navigation.navigate('Home')}
        onMeetingPress={() => navigation.navigate('Meeting')}
        onChattingPress={() => navigation.navigate('Chatting')}
        onCalendarPress={() => navigation.navigate('Schedule')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#ffffff',
  },
  topText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
    textAlign: 'center',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.05,
  },
  listContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: width * 0.3,  
    height: width * 0.3, 
    borderRadius: 10, 
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    
  },
  cardDate: {
    fontSize: 14,
    color: '#999',
    alignSelf: 'flex-end',
  },
});

export default MeetingScreen;
