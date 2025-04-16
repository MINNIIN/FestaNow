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
            <MyMeetingApplicationListContent navigation={navigation}/>

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
    },
    titleText: {
        textAlign: "center",
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