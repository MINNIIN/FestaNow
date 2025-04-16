import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { XMLParser } from 'fast-xml-parser';
import { kopisURL, SERVICE_KEY } from '../OAuto2'; 
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenTitle from './ScreenTitle';
import HomeBottomMenu from './HomeBottomMenu';

type HomeSearchDetailNavigationProp = StackNavigationProp<any, 'Concert'>;

type Props = {
  navigation: HomeSearchDetailNavigationProp;
};

const { width, height } = Dimensions.get('window');

type ConcertItem = {
  prfnm: string;
  prfpdfrom: string;
  prfpdto: string;
  fcltynm: string;
  poster: string;
  prfstate: string;
  mt20id: string;
};

const HomeSearchDetail = ({ navigation }: Props) => {
  const route = useRoute();
  const { keyword } = route.params as { keyword: string };
  const [results, setResults] = useState<ConcertItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'ended'>('all');

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const url = `${kopisURL}/pblprfr?service=${SERVICE_KEY}&stdate=20221201&eddate=20250405&rows=100&cpage=1`;
        const response = await fetch(url);
        const text = await response.text();
  
        const parser = new XMLParser();
        const json = parser.parse(text);
        const list = json.dbs?.db;
        const concertList = Array.isArray(list) ? list : [list];
  
        const filtered: ConcertItem[] = concertList
          .filter((item: any) => item.prfnm?.toLowerCase().includes(keyword.toLowerCase()))
          .map((item: any) => ({
            mt20id: item.mt20id,
            prfnm: item.prfnm,
            prfpdfrom: item.prfpdfrom,
            prfpdto: item.prfpdto,
            fcltynm: item.fcltynm,
            poster: item.poster,
            prfstate: item.prfstate, // 상태 저장
          }));
  
        setResults(filtered);
      } catch (error) {
        console.error('API 에러:', error);
      }
    };
  
    fetchConcerts();
  }, [keyword]);

  const getFilteredResults = () => {
    return results.filter(item => {
      if (filter === 'ongoing') return item.prfstate === '공연중';
      if (filter === 'ended') return item.prfstate === '공연완료';
      return true;
    });
  };

  const filteredResults = getFilteredResults();

  return (
    <View style={styles.container}>
      <ScreenTitle
        onLeftPress={() => navigation.goBack()}
        onLogoPress={() => navigation.navigate('Home')}
        onMyPagePress={() => navigation.navigate('FirstMypage')}
      />

      {/* 필터 버튼 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'ongoing' && styles.activeFilter]}
          onPress={() => setFilter('ongoing')}
        >
          <Text style={styles.filterText}>공연중</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'ended' && styles.activeFilter]}
          onPress={() => setFilter('ended')}
        >
          <Text style={styles.filterText}>공연완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>"{keyword}" 검색 결과</Text>
        {filteredResults.map((item, index) => (
          <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate('SearchDetail', { id: item.mt20id })}
        >
          <Image source={{ uri: item.poster }} style={styles.image} />
          <Text style={styles.name}>{item.prfnm}</Text>
          <Text style={styles.infoText}>{item.prfpdfrom} ~ {item.prfpdto}</Text>
          <Text style={styles.infoText}>{item.fcltynm}</Text>
        </TouchableOpacity>
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
  container: {
    alignItems: 'center',
    height: height,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    padding: 1,
    marginTop: 10,
    alignItems: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'GothicA1-SemiBold'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  filterButton: {
    width: width * 0.22,
    height: height * 0.05,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#DAD9FF',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#B2CCFF',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  card: {
    width: '95%',
    padding: 7,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Medium'
  },
  infoText: {
    fontFamily: 'GothicA1-Medium',
    fontSize: 14,
    color: '#666'
  },
});

export default HomeSearchDetail;
