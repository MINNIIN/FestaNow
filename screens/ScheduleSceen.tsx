import React from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, TouchableOpacity } from "react-native";

type ScheduleScreenNavigationProp = StackNavigationProp<any, 'schedule'>;

type Props = {
  navigation: ScheduleScreenNavigationProp;
};

const ScheduleSceen = ({ navigation }: Props) => {


    return(
        <View></View>
    )
}

export default ScheduleSceen;