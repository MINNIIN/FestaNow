// 내 모임 확인 페이지
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import ScreenTitle from "../component/ScreenTitle";
import HomeBottomMenu from "../component/HomeBottomMenu";
import MyMeetingApplicationListContent from "../component/MeetingComponent/MyMeetingApplicationListContent";

const { width, height } = Dimensions.get('window');

type MyMeetingApplicationListProps = StackNavigationProp<any, 'MyMeetingApplication'>;

type Props = {
    navigation: MyMeetingApplicationListProps;
};

const MyMeetingApplicationList = ({navigation}: Props) => {

    return(
        <View style={styles.container}>
            <ScreenTitle
            onLeftPress={() => navigation.goBack()}
            onLogoPress={() => navigation.navigate("Home")}
            onMyPagePress={() => navigation.navigate("FirstMypage")}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>내 모임</Text>
            </View>
            <MyMeetingApplicationListContent />

            <View style={styles.bottomMenuContainer}>
                <HomeBottomMenu
                    onHomePress={() => navigation.navigate("Home")}
                    onMeetingPress={() => navigation.navigate("Meeting")}
                    onChattingPress={() => navigation.navigate("Chatting")}
                    onCalendarPress={() => navigation.navigate("Schedule")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        
    },
    titleContainer: {
        backgroundColor: "#fff",
        borderBottomWidth: 3,
        borderBottomColor: "#FF4848",
        // borderTopWidth: 2,
        // borderTopColor: "#ddd",
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 6,
    },
    titleText: {
        textAlign: "center",
        // marginLeft: 10,
        marginTop: 10,
        fontSize: 18,
        color: "#FF4848",
        marginBottom: 10,
        fontWeight: "bold",
    },
    bottomMenuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
})

export default MyMeetingApplicationList;