import React, {useState, useRef} from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Animated, Image, StyleSheet, ImageBackground, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeCategory from '../component/HomeCategory';
import HomeBottomMenu, { handleScroll } from '../component/HomeBottomMenu';
import HomeSearch from '../component/HomeSearch';
import HomeImageSlide from '../component/HomeImageSlide';


type HomeScreenNavigationProp = StackNavigationProp<any, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};



const HomeScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');

  const categoriyButton = [
    { id: 1, label: '콘서트', icon: require('../images/concert_icon.png') },
    { id: 2, label: '뮤지컬', icon: require('../images/musical_icon.png') },
    { id: 3, label: '전시', icon: require('../images/gallery_icon.png') },
    { id: 4, label: '클래식', icon: require('../images/classic_icon.png') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../images/logo_white.png')} style={styles.titleLogo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} onScroll={handleScroll} scrollEventThrottle={16}>

      <HomeImageSlide />
      <HomeSearch searchText={searchText} setSearchText={setSearchText} />
      <HomeCategory categories={categoriyButton} />
      
      

      </ScrollView>

      <HomeBottomMenu />
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
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    height: 1000,
  },
  

})

export default HomeScreen;