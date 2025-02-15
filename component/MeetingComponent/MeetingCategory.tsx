import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
    onMyMeetingCheckPress: () => void;
    onApplicationCheckPress: () => void;
};

const MeetingCategory = ({ onMyMeetingCheckPress, onApplicationCheckPress }: Props) => {

    return(
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={onMyMeetingCheckPress}>
                    <View style={styles.buttonContent}>
                        <Image source={require('../../images/myMeeting_icon.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>내 모임</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={onApplicationCheckPress}>
                    <View style={styles.buttonContent}>
                        <Image source={require('../../images/letter_icon.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>신청 확인</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: width * 0.8,
    },
    button: {
        backgroundColor: "#f9f9f9",
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#D8D8D8',
        alignItems: "center",
        justifyContent: "center",
        width: "45%",
        height: height * 0.06,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        elevation: 8,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 30,  
        height: 30, 
        marginRight: 5, 
    },
    buttonText: {
        color: "#000",
        fontSize: 17,
    },
});

export default MeetingCategory;
