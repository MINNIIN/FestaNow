import { StackNavigationProp } from "@react-navigation/stack";
import React, {useState, useEffect} from "react";
import { View, Image, Text, FlatList, TouchableOpacity, Animated, Button } from "react-native";

type ConcertScreenNavigationProp = StackNavigationProp<any, 'Concert'>;

type Props = {
  navigation: ConcertScreenNavigationProp;
};


const ConcertScreen = ({ navigation }: Props) => {

    return(
        <View></View>

    );
};

export default ConcertScreen;