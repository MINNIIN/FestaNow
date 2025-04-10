import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity,  FlatList, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { XMLParser } from 'fast-xml-parser';
import { SERVICE_KEY, kopisURL } from '../../OAuto2';
import ScreenTitle from '../../component/ScreenTitle';
import HomeBottomMenu from '../../component/HomeBottomMenu';
import PerformancePosterSlide from '../../component/PerformanceComponent/PerformancePosterSlide';


type MusicalScreenNavigationProp = StackNavigationProp<any, 'Musical'>;

type Props = {
  navigation: MusicalScreenNavigationProp;
};

const MusicalScreen = ({ navigation }: Props) => {
  const [musicals, setMusicals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const recentPosters = musicals
  .filter((item) => item.poster) // 포스터가 있는 것만
  .slice(0, 5); // 상위 5개만

  const fetchMusicals = async () => {
    try {
      // 오늘 날짜
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // 1월=0이므로 +1
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}${mm}${dd}`; // YYYYMMDD 형식
      
            const url = `${kopisURL}/pblprfr?service=${SERVICE_KEY}&stdate=20221201&eddate=${todayStr}&rows=50&cpage=1`;
      const response = await fetch(url);
      const text = await response.text();
      

      const parser = new XMLParser();
      const json = parser.parse(text);
      

      const list = json.dbs?.db;
      const musicalList = Array.isArray(list) ? list : [list];
      const filtered = musicalList.filter((item: any) =>
        item.genrenm?.includes('뮤지컬') 
      && item.prfstate?.includes('공연중')
      );
    
      setMusicals(filtered);
    } catch (error) {
      console.error('콘서트 데이터를 불러오는 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicals();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    // 해당 콘서트를 눌렀을때 MusicalDetail.tsx 화면으로 넘어가도록 해야함
    <TouchableOpacity
      onPress={() => navigation.navigate('MusicalDetail', { id: item.mt20id })}
    >
      <View style={styles.card}>
        {item.poster ? (
          <Image
            source={{ uri: item.poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.poster, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text>이미지 없음</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{item.prfnm}</Text>
          <Text style={styles.period}>{item.prfpdfrom} ~ {item.prfpdto}</Text>
          <Text style={styles.place}>{item.area}  {item.fcltynm}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" color="#000"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenTitle
        onLeftPress={() => navigation.goBack()}
        onLogoPress={() => navigation.navigate('Home')}
        onMyPagePress={() => navigation.navigate('FirstMypage')}
      />
  
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {musicals.length > 0 && (
          <PerformancePosterSlide data={recentPosters} />
        )}
  
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>진행 중인 뮤지컬</Text>
        </View>
  
        {/* {musicals.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>콘서트 정보가 없습니다.</Text>
        ) : (
          musicals.map((item) => renderItem({ item }))
        )} */}
        {musicals.map((item) => (
          <View key={item.mt20id}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
  
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
  container: { flex: 1, backgroundColor: '#fff' },
  list: {
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 80,
    // paddingHorizontal: 16,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-SemiBold'
  },
  period: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'GothicA1-Medium',
    color: '#666',
  },
  place: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'GothicA1-Medium',
    color: '#666',
  },
  titleContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 3,
    borderBottomColor: "#2457BD",
    marginBottom: 20,
  },
  titleText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    color: "#2457BD",
    marginBottom: 10,
    fontFamily: 'GothicA1-SemiBold'
  },
});

export default MusicalScreen;
