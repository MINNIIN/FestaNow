import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, Dimensions, TouchableOpacity, Button, Image } from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import ScreenTitle from "../component/ScreenTitle";

const { width, height } = Dimensions.get("window");

type MeetingScreenNavigationProp = StackNavigationProp<any, "MeetingSearch">;

type Meeting = {
  id: string;
  title?: string;
  performanceName?: string;
  performanceDate?: string;
  imageUrl?: string;
};

type Props = {
  navigation: MeetingScreenNavigationProp;
};

const MeetingSearchScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState<string>(""); // 검색어 입력 상태
  const [results, setResults] = useState<Meeting[]>([]); // 검색 결과 저장
  const [filteredResults, setFilteredResults] = useState<Meeting[]>([]); // 필터링된 결과 저장
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string>(""); // 에러 메시지 상태

  const searchMeetings = async () => {
    setLoading(true); // 로딩 시작
    setError(""); // 이전 오류 초기화
    try {
      const response = await axios.get("http://43.200.57.176:3000/api/meetings");
      
      const data = response.data; // API에서 받은 데이터
      setResults(data); // 검색 결과 저장
      filterResults(data); // 검색어로 필터링
    } catch (error) {
      console.error("검색 오류:", error);
      setError("검색 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  // 검색어로 데이터를 필터링하는 함수
  const filterResults = (data: Meeting[]) => {
    const filtered = data.filter(item =>
      (item.title && item.title.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.performanceName && item.performanceName.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredResults(filtered);
  };

  // 기본 이미지 설정
  const defaultImage = "https://festanow-bucket.s3.ap-northeast-2.amazonaws.com/default+image.png";

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR"); // 한국 형식으로 날짜 출력 (yyyy-mm-dd)
  };

  return (
    <View style={styles.container}>
      <ScreenTitle
        onLeftPress={() => navigation.goBack()}
        onLogoPress={() => navigation.navigate("Home")}
        onMyPagePress={() => navigation.navigate("MyPage")}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="검색어 입력"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="검색" onPress={searchMeetings} disabled={loading} />

        {loading ? (
          <Text>로딩 중...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredResults} // 필터링된 결과를 사용
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("MeetingContent", { postId: item.id })}
              >
                {/* 카드 이미지 */}
                <Image
                  source={{ uri: item.imageUrl || defaultImage }}
                  style={styles.cardImage}
                />
                {/* 카드 텍스트 */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title || "제목 없음"}</Text>
                  <Text style={styles.cardDescription}>
                    {item.performanceName || "공연 이름 없음"}
                  </Text>
                  <Text style={styles.cardDate}>
                    공연 날짜: {formatDate(item.performanceDate || "") || "날짜 정보 없음"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  cardImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
  },
  cardDate: {
    fontSize: 14,
    color: "#999",
    alignSelf: "flex-end",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default MeetingSearchScreen;
