import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

type SubmitButtonProps = {
    onPress: () => void;
};

const { width, height } = Dimensions.get('window');

const MeetingSubmitButton = ({ onPress }: SubmitButtonProps) => {
    return (
        <TouchableOpacity style={styles.submitButton} onPress={onPress}>
            <Text style={styles.buttonText}>신청 완료</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    submitButton: {
        width: width * 0.9,
        backgroundColor: "#DAD9FF",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#353535",
        fontSize: 16,
    },
});

export default MeetingSubmitButton;