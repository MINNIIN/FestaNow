import React, { useEffect, useRef, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  data: any[];
};

const PerformancePosterSlide = ({ data }: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000); // 5초마다

    return () => clearInterval(interval); // 언마운트 시 인터벌 정리
  }, [currentIndex, data.length]);

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.mt20id}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.42,
    marginBottom: 16,
  },
  poster: {
    width: width,
    height: height * 0.42,
  },
});

export default PerformancePosterSlide;
