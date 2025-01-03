import React, {useState, useRef} from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Animated, Image, StyleSheet, ImageBackground, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<any, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current; // 스크롤 위치
  const bottomAnim = useRef(new Animated.Value(0)).current; // bottomContainer 애니메이션 값

  let lastScrollY = 0; // 이전 스크롤 위치 저장

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY + 10) {
      // 화면을 아래로 내릴 때 bottomContainer 숨김
      Animated.timing(bottomAnim, {
        toValue: 100, // 화면 아래로 이동
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY < lastScrollY - 10) {
      // 화면을 위로 올릴 때 bottomContainer 표시
      Animated.timing(bottomAnim, {
        toValue: 0, // 원래 위치로 이동
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY = currentScrollY;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../images/logo_white.png')} style={styles.titleLogo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} onScroll={handleScroll} scrollEventThrottle={16}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="찾으시는 공연이 있으신가요?"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.categoryButton}>
            <Image source={require('../images/concert_icon.png')}></Image>
            <Text style={styles.buttonText}>콘서트</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Image source={require('../images/musical_icon.png')}></Image>
            <Text style={styles.buttonText}>뮤지컬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Image source={require('../images/gallery_icon.png')}></Image>
            <Text style={styles.buttonText}>전시</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Image source={require('../images/classic_icon.png')}></Image>
            <Text style={styles.buttonText}>클래식</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 메뉴 */}
      <Animated.View
        style={[
          styles.bottomContainer,
          { transform: [{ translateY: bottomAnim }] }, // 애니메이션 적용
        ]}
      >
        <TouchableOpacity style={styles.bottomButton}>
          <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
          <Text style={styles.bottomButtonText}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
          <Text style={styles.bottomButtonText}>사람 모집</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
          <Text style={styles.bottomButtonText}>Known</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Image source={require('../images/home_icon.png')} style={styles.bottomImage}></Image>
          <Text style={styles.bottomButtonText}>Known</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  titleContainer: {
    flexDirection:'row',
  },
  titleLogo: {
    width: 320, 
    height: 60,
    resizeMode: 'contain',
  },
  topText: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    height: 1000,
  },
  searchBox: {
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: '#368AFF',
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  buttonBox: {
    width: '100%',
    height: 150,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',

    // iOS 그림자
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 5, // 그림자 퍼짐 정도
  
    // Android 그림자
    elevation: 5, // 그림자 높이

  },
  categoryButton: {
    width: '20%', // 버튼의 너비를 줄여서 두 줄에 배치
    height: 90,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    color: '#8C8C8C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute', // 하단에 고정
    bottom: 0,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#BDBDBD',
  },
  bottomButton: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  bottomButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  bottomImage: {
    width: 100, 
    height: 30,
    resizeMode: 'contain',
  }

})

export default HomeScreen;