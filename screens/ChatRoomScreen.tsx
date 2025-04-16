import React, { useState, useRef, useEffect } from "react";
import { View, Modal, Text, Image, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    ChatRoom: { meetingId: string; meetingTitle: string, performanceName: string; };
  };
  
  type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, "ChatRoom">;
  type ChatRoomScreenNavigationProp = StackNavigationProp<RootStackParamList, "ChatRoom">;
  
  type Props = {
    route: ChatRoomScreenRouteProp;
    navigation: ChatRoomScreenNavigationProp;
  };

  const {width, height} = Dimensions.get('window')
  
  const ChatRoomScreen = ({ route, navigation }: Props) => {
    const { meetingId, meetingTitle, performanceName } = route.params;
    const [isMenuVisible, setMenuVisible] = useState(false);

    // 메뉴 애니메이션 
    const slideAnim = useRef(new Animated.Value(width)).current; // 시작 위치는 오른쪽 바깥
    
    const openMenu = () => {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.25, // 왼쪽으로 이동해서 화면 오른쪽에 붙게
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    };
    
    const closeMenu = () => {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setMenuVisible(false);
      });
    };
  
    const [messages, setMessages] = useState([
      { id: "1", text: "안녕하세요!", isMe: false },
      { id: "2", text: "안녕하세요, 반갑습니다 😊", isMe: true },
    ]);
    const [input, setInput] = useState("");
  
    const handleSend = () => {
      if (input.trim() === "") return;
      setMessages([...messages, { id: Date.now().toString(), text: input, isMe: true }]);
      setInput("");
    };
  
    const renderItem = ({ item }: any) => (
      <View
        style={[
          styles.messageContainer,
          item.isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
  <View style={styles.headerSection}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={require('../images/left_icon.png')} style={styles.icon} />
    </TouchableOpacity>
  </View>

  <View style={styles.headerSectionCenter}>
    <Text style={styles.headerTitle}>{performanceName}</Text>
  </View>

  <View style={styles.headerSection}>
    <TouchableOpacity onPress={openMenu}>
      <Image source={require('../images/menu_icon.png')} style={styles.icon} />
    </TouchableOpacity>
  </View>
</View>
  
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          inverted
        />
  
  <View style={styles.inputContainer}>
  <TouchableOpacity style={styles.cameraButton}>
    <Image source={require('../images/camera_icon.png')} style={styles.cameraIcon} />
  </TouchableOpacity>

  <TextInput
    style={styles.input}
    value={input}
    onChangeText={setInput}
    placeholder="메시지를 입력하세요"
  />

  <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
    <Image source={require('../images/send_icon.png')} style={styles.sendIcon} />
  </TouchableOpacity>
</View>
{isMenuVisible && (
  <TouchableOpacity
    style={styles.menuOverlay}
    activeOpacity={1}
    onPress={closeMenu}
  >
    <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
      {/* 닉네임 + 설정 */}
      <View style={styles.menuHeader}>
        <TouchableOpacity onPress={closeMenu}>
        <Image source={require('../images/left_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.nickname}>나의 닉네임</Text>
        <TouchableOpacity>
          <Text style={styles.setting}>⚙ 설정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuDivider} />

      {/* 구성원 목록 */}
      <View style={styles.memberList}>
        <Text style={styles.member}>홍길동</Text>
        <Text style={styles.member}>김철수</Text>
        <Text style={styles.member}>이영희</Text>
      </View>

      <View style={styles.menuDivider} />

      {/* 나가기 버튼 */}
      <TouchableOpacity style={styles.leaveButton}>
        <Text style={styles.leaveButtonText}>채팅방 나가기</Text>
      </TouchableOpacity>
    </Animated.View>
  </TouchableOpacity>
)}
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F6FA",
    },
    header: {
        backgroundColor: "#EAEAEA",
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        elevation: 20,
        borderColor: '#00000030',
        borderBottomWidth: 1,

        
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.3,
//   shadowRadius: 4,
      },
      
      headerSection: {
        width: 40, // 아이콘 사이즈만큼
        justifyContent: "center",
        alignItems: "center",
      },
      
      headerSectionCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      
      icon: {
        width: 34,
        height: 34,
        resizeMode: "contain",
        tintColor: '#FF4848'
      },
    backText: {
      color: "#fff",
      fontSize: 24,
    },
    headerTitle: {
      color: "#FF4848",
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 12,
    },
    messageList: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexGrow: 1,
      justifyContent: "flex-end",
    },
    messageContainer: {
      maxWidth: "75%",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    myMessage: {
      backgroundColor: "#FF4848",
      alignSelf: "flex-end",
    },
    otherMessage: {
      backgroundColor: "#747474",
      alignSelf: "flex-start",
    },
    messageText: {
      color: "#fff",
      fontSize: 15,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: "#EAEAEA",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#00000030",

//       elevation: 10, 
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: -2 }, // 위쪽 그림자
//   shadowOpacity: 0.1,
//   shadowRadius: 4,
    },
    input: {
      flex: 1,
      height: 40,
      paddingHorizontal: 12,
      backgroundColor: "#fff",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff'
    },
    sendButton: {
      padding: 4
    },
    sendText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },
    cameraButton: {
        marginRight: 8,
      },
      
      cameraIcon: {
        width: 34,
        height: 34,
        tintColor: "#FF4848", // 원하시는 색상으로 조절 가능
      },
      
      sendIcon: {
        width: 34,
        height: 34,
        tintColor: "#FF4848", // 빨간색으로 변경
      },
      menuOverlay: {
        position: 'absolute',
        width: width * 0.75,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  zIndex: 10, 
      },
      sideMenu: {
        position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: width * 0.8,
  backgroundColor: '#fff',
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: -2, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
      },
      menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
        flexWrap: 'nowrap',
        
      },
      nickname: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '50%',
        // fontFamily: 'GothicA1-SemiBold'
      },
      setting: {
        fontSize: 18,
        color: '#FF4848',
      },
      menuDivider: {
        height: 1,
        backgroundColor: '#A6A6A6',
        marginVertical: 12,
      },
      memberList: {
        flexGrow: 1,
        maxHeight: height * 0.7,
        marginBottom: 20,
      },
      member: {
        fontSize: 17,
        paddingVertical: 8,
        color: '#444',
      },
      leaveButton: {
        backgroundColor: '#FF4848',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
      },
      leaveButtonText: {
        color: '#fff',
        // fontWeight: 'bold',
        fontSize: 16,
      },
  });
  
  export default ChatRoomScreen;