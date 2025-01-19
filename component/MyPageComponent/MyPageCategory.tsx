import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Category = {
  id: number;
  label: string;
  icon: any; // 이미지 소스 타입 (require로 불러온 이미지 사용)
  action?: () => void; // 버튼 클릭 시 실행할 액션
};

type Props = {
  categories: Category[];
  onCategoryPress: (id: number) => void; // 각 버튼 클릭 시 실행할 핸들러
};

const MyPageCategory: React.FC<Props> = ({ categories, onCategoryPress }) => {
  return (
    <View style={styles.buttonBox}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryButton}
          onPress={() => onCategoryPress(category.id)} // 버튼 클릭 시 onCategoryPress 호출
        >
          <Image source={category.icon} style={styles.categoryIcon} />
          <Text style={styles.buttonText}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBox: {
    width: width,
    height: height * 0.08,
    
    // borderWidth: 1,
    // borderColor: '#EAEAEA',
    // backgroundColor: '#f9f9f9',
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // shadowColor: '#000', // 그림자 색상
    // shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    // shadowOpacity: 0.1, // 그림자 투명도
    // shadowRadius: 5, // 그림자 퍼짐 정도
    // elevation: 5, // Android 그림자 높이
  },
  categoryButton: {
    width: '25%',
    height: 90,
    paddingVertical: 10,
    marginVertical: 5,
    
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonText: {
    marginTop: 5,
    color: '#8C8C8C',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyPageCategory;
