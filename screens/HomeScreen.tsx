import React, {useState, useRef} from 'react';
import { View, Platform, TextInput, ScrollView, Text, TouchableOpacity, Animated, Image, StyleSheet, ImageBackground, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeCategory from '../component/HomeCategory';
import HomeBottomMenu, { handleScroll } from '../component/HomeBottomMenu';
import HomeSearch from '../component/HomeSearch';
import HomeImageSlide from '../component/HomeImageSlide';
import HomeTitle from '../component/HomeTitle';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type HomeScreenNavigationProp = StackNavigationProp<any, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};



const HomeScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');

  const categoryButton = [
    { id: 1, label: '콘서트', icon: require('../images/concert_icon.png') },
    { id: 2, label: '뮤지컬', icon: require('../images/musical_icon.png') },
    { id: 3, label: '연극', icon: require('../images/play_icon.png') },
    { id: 4, label: '클래식', icon: require('../images/classic_icon.png') },
  ];
  
  return (
    <View style={styles.container}>
      <HomeTitle
        onMenuPress={() => navigation.navigate('Home')} 
        onMyPagePress={() => navigation.navigate('FirstMypage')} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} onScroll={handleScroll} scrollEventThrottle={16}>

      <HomeImageSlide />
      <HomeSearch searchText={searchText} setSearchText={setSearchText} />
      <HomeCategory categories={categoryButton} navigation={navigation} />
      
      

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
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    height: 1000,
  },
  

})

export default HomeScreen;