// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
// import { StackNavigationProp } from "@react-navigation/stack";
// import ScreenTitle from "../component/ScreenTitle";

// const { width, height } = Dimensions.get("window");

// type RootStackParamList = {
//   Chatting: undefined;
//   ChatRoom: { meetingId: string; meetingTitle: string };
//   Home: undefined;
//   FirstMypage: undefined;
// };

// type ChattingScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chatting">;

// type Props = {
//   navigation: ChattingScreenNavigationProp;
// };

// type Meeting = {
//   id: string;
//   title: string;
// };

// const ChattingScreen = ({ navigation }: Props) => {
//   const [meetings, setMeetings] = useState<Meeting[]>([]);
//   const [loading, setLoading] = useState(true);
//   const currentUser = auth().currentUser;

//   useEffect(() => {
//     if (!currentUser) {
//       setLoading(false);
//       return;
//     }

//     const fetchMeetings = async () => {
//       try {
//         const userId = currentUser.uid;
//         const meetingList: Meeting[] = [];

//         // 내가 만든 모임
//         const myMeetingsQuery = firestore()
//           .collection("meetings")
//           .where("authorId", "==", userId);
//         const myMeetingsSnapshot = await myMeetingsQuery.get();

//         myMeetingsSnapshot.forEach((doc) => {
//           meetingList.push({ id: doc.id, title: doc.data().title || "제목 없음" });
//         });

//         // 내가 가입한 모임
//         const allMeetingsSnapshot = await firestore().collection("meetings").get();

//         for (const meetingDoc of allMeetingsSnapshot.docs) {
//           const membersRef = firestore()
//             .collection("meetings")
//             .doc(meetingDoc.id)
//             .collection("members");

//           const memberQuery = membersRef.where("userId", "==", userId);
//           const memberSnapshot = await memberQuery.get();

//           if (!memberSnapshot.empty) {
//             // 중복 방지
//             const isAlreadyAdded = meetingList.some((m) => m.id === meetingDoc.id);
//             if (!isAlreadyAdded) {
//               meetingList.push({ id: meetingDoc.id, title: meetingDoc.data().title || "제목 없음" });
//             }
//           }
//         }

//         setMeetings(meetingList);
//       } catch (error) {
//         console.error("Error fetching meetings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeetings();
//   }, [currentUser]);

//   const renderItem = ({ item }: { item: Meeting }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() =>
//         navigation.navigate("ChatRoom", {
//           meetingId: item.id,
//           meetingTitle: item.title,
//         })
//       }
//     >
//       <Text style={styles.title}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <ScreenTitle
//         onLeftPress={() => navigation.goBack()}
//         onLogoPress={() => navigation.navigate("Home")}
//         onMyPagePress={() => navigation.navigate("FirstMypage")}
//       />

//       <View style={styles.titleContainer}>
//                 <Text style={styles.titleText}>내 채팅방</Text>
//               </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//         </View>
//       ) : meetings.length > 0 ? (
//         <FlatList
//           data={meetings}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <Text style={styles.noMeetingText}>가입된 모임이 없습니다.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       width: width,
//       height: height,
//       backgroundColor: "#fff",
//     },
//     header: {
//       fontSize: 20,
//       fontWeight: "600",
//       paddingHorizontal: 20,
//       marginTop: 10,
//       marginBottom: 12,
//       color: "#333",
//     },
//     card: {
//       backgroundColor: "#EAF0F6",
//       padding: 16,
//       borderRadius: 12,
//       marginHorizontal: 20,
//       marginBottom: 14,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//     },
//     title: {
//       fontSize: 17,
//       fontWeight: "500",
//       color: "#2E3A59",
//     },
//     loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     noMeetingText: {
//       textAlign: "center",
//       fontSize: 16,
//       color: "#999",
//       marginTop: 40,
//     },
//     listContent: {
//       paddingBottom: 100,
//     },
//     titleContainer: {
//       backgroundColor: "#fff",
//       borderBottomWidth: 3,
//       borderBottomColor: "#2457BD",
//       marginBottom: 20,
//     },
//     titleText: {
//       textAlign: "center",
//       marginTop: 10,
//       fontSize: 18,
//       color: "#2457BD",
//       marginBottom: 10,
//       fontFamily: 'GothicA1-SemiBold'
//     },
//   });
  

// export default ChattingScreen;
