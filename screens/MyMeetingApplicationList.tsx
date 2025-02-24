// 내 모임 확인 페이지
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import ScreenTitle from "../component/ScreenTitle";
import HomeBottomMenu from "../component/HomeBottomMenu";

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
            <Text>List</Text>

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
    bottomMenuContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
})

export default MyMeetingApplicationList;