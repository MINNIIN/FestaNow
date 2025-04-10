import React from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // 루트에서 내보낸 타입 import 경로 맞게 수정

type HomeSearchProps = {
  searchText: string;
  setSearchText: (text: string) => void;
};

type HomeSearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeSearchDetail'>;

const HomeSearch = ({ searchText, setSearchText }: HomeSearchProps) => {
  const navigation = useNavigation<HomeSearchScreenNavigationProp>();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('HomeSearchDetail', { keyword: searchText.trim() });
    }
  };

  return (
    <View style={styles.searchBox}>
      <TextInput
        style={styles.searchInput}
        placeholder="찾으시는 공연이 있으신가요?"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={require('../images/search_icon.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#368AFF',
  },
});

export default HomeSearch;
