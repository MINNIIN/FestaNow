import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const images = [
  require('../images/coldplaySlide.png'),
  require('../images/oasisSlide.png'),
  require('../images/vangoghSlide.png'),
  require('../images/laughsmanSlide.png'),
];

const HomeImageSlide = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {images.map((image, index) => (
          <View style={styles.imageContainer} key={index}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.5,
    marginBottom: 20,
  },
  imageContainer: {
    width: width, // 화면 너비에 딱 맞게 설정
    height: height * 0.5, // 슬라이더 높이 설정
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%', // 화면 너비의 90%
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15, // 테두리 둥글게
    backgroundColor: '#5d5d5d'
  },
});

export default HomeImageSlide;
