import React, { useEffect, useState } from "react";
import { View, FlatList, Dimensions, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ScreenTitle from "../component/ScreenTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import HomeBottomMenu from "../component/HomeBottomMenu";
import firestore from '@react-native-firebase/firestore';
import Writing from "../component/Writing";

const { width, height } = Dimensions.get('window');

type MeetingScreenNavigationProp = StackNavigationProp<any, 'Meeting'>;

type Props = {
  navigation: MeetingScreenNavigationProp;
};

const MeetingScreen = ({ navigation }: Props) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('meetings')
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const newPosts = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(newPosts);
          } else {
            console.log('meetings 컬렉션에 문서가 없습니다.');
          }
        },
        error => {
          console.error('Firestore 데이터 읽기 중 오류 발생:', error);
        }
      );

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');  // 한국 형식으로 날짜 출력 (yyyy-mm-dd)
  };

  return (
    <View style={styles.container}>
      <ScreenTitle
        onLeftPress={() => navigation.navigate('Home')} 
        onLogoPress={() => navigation.navigate('Home')}
        onMyPagePress={() => navigation.navigate('FirstMypage')}
      />

      <Text style={styles.topText}>여기에서 관심 있는 모임에 참여하거나 새로운 모임을 만들어보세요!</Text>

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
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
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
        onCalendarPress={() => navigation.navigate('Calendar')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: '100%',
    backgroundColor: '#ffffff',
  },
  topText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
    marginVertical: 10,
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
    resizeMode: 'contain',  
    borderRadius: 10,  
    
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