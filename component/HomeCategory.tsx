import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

type Category = {
  id: number;
  label: string;
  icon: any; // 이미지 소스 타입 (require로 불러온 이미지 사용)
};

type Props = {
  categories: Category[];
};

const HomeCategory: React.FC<Props> = ({ categories }) => {
  return (
    <View style={styles.buttonBox}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.categoryButton}>
          <Image source={category.icon} style={styles.categoryIcon} />
          <Text style={styles.buttonText}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '20%',
    height: 90,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeCategory;
