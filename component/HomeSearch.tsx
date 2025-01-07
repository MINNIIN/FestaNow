import React, { useState } from "react";
import { View, TextInput, Text, Button, TouchableOpacity, Animated, Image, StyleSheet, } from "react-native";

type HomeSearchProps = {
    searchText: string;
    setSearchText: (text: string) => void;
}

const HomeSearch = ( {searchText, setSearchText}: HomeSearchProps) => {
    return (
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="찾으시는 공연이 있으신가요?"
            value={searchText}
            onChangeText={setSearchText} // setSearchText 함수를 그대로 넘겨서 처리
          />
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
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
    },
  });
  
  export default HomeSearch;