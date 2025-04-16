// ClassicDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { XMLParser } from 'fast-xml-parser';
import { SERVICE_KEY, kopisURL } from '../../OAuto2';
import ScreenTitle from '../../component/ScreenTitle';
import { RootStackParamList } from '../../App';

const {width, height} = Dimensions.get('window')

type SearchDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchDetail'>;

type Props = {
  navigation: SearchDetailScreenNavigationProp;
  route: any; // route.params.id 사용하려면 정확한 타입도 설정 가능
};

const SearchDetail = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const url = `${kopisURL}/pblprfr/${id}?service=${SERVICE_KEY}`;
      const response = await fetch(url);
      const text = await response.text();
      const parser = new XMLParser();
      const json = parser.parse(text);

      const data = json.dbs?.db;
      setDetail(data);
    } catch (error) {
      console.error('공연 상세 정보 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.center}>
        <Text>공연 정보를 불러올 수 없습니다.</Text>
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
    <ScrollView style={styles.scrollContainer}>

      {detail.poster && (
        <Image source={{ uri: detail.poster }} style={styles.poster} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{detail.prfnm}</Text>
        <Text style={styles.info}>기간 : {detail.prfpdfrom} ~ {detail.prfpdto}</Text>
        <Text style={styles.info}>장소 : {detail.fcltynm}</Text>
        <Text style={styles.info}>출연 : {detail.prfcast || '정보 없음'}</Text>
        <Text style={styles.info}>관람 등급 : {detail.prfage}</Text>
        <Text style={styles.info}>공연 시간 : {detail.dtguidance || '정보 없음'}</Text>
        <Text style={styles.info}>티켓 가격 : {detail.pcseguidance || '정보 없음'}</Text>

        {detail.styurls && (
          <>
            {/* <Text style={styles.sectionTitle}>공연 이미지</Text> */}
            {Array.isArray(detail.styurls.styurl)
              ? detail.styurls.styurl.map((url: string, index: number) => (
                  <Image key={index} source={{ uri: url }} style={styles.introImage} />
                ))
              : <Image source={{ uri: detail.styurls.styurl }} style={styles.introImage} />}
          </>
        )}
      </View>
    </ScrollView>
    <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('MeetingCreate', {
            performanceName: detail.prfnm, // 공연 이름 전달
          })}
        >
          <Text style={styles.createButtonText}>모임 생성하기</Text>
        </TouchableOpacity>
    
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      scrollContainer: { flex: 1, backgroundColor: '#fff' },
      container: {
        width: width,
        height: height,
        flex: 1, 
        backgroundColor: '#fff'
      },
      center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      poster: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
      },
      content: {
        padding: 16,
      },
      title: {
        fontSize: 22,
        marginBottom: 10,
        color: '#353535',
        fontFamily: 'NotoSansKR-Medium',
      },
      info: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'GothicA1-Regular',
      },
      sectionTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      story: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
      },
      introImage: {
        width: '100%',
        height: height * 0.6,
        marginTop: 10,
        resizeMode: 'cover',
      },
      createButton: {
        backgroundColor: '#FF5757',
        padding: 15,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
      },
      createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'GothicA1-Regular'
      },
    });

export default SearchDetail;
