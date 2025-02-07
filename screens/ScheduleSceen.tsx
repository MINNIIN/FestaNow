import React, { useState, useEffect } from "react";
import { 
  View, StyleSheet, TextInput, Text, TouchableWithoutFeedback, 
  Keyboard, Button, Platform ,Dimensions
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import ScreenTitle from "../component/ScreenTitle"; 
import HomeBottomMenu from "../component/HomeBottomMenu";  
import DateTimePickerModal from "react-native-modal-datetime-picker";  
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const ScheduleScreen = ({ navigation }) => {
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [notes, setNotes] = useState<{ [date: string]: string }>({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [memoHeight, setMemoHeight] = useState(100); // ✨ 메모창 높이 상태 추가

  useEffect(() => {
    setSelectedDate(today);
  }, []);

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const onNoteChange = (text: string) => {
    if (selectedDate) {
      setNotes((prevNotes) => ({
        ...prevNotes,
        [selectedDate]: text,
      }));
    }
  };

  const handleDatePickerConfirm = (date: Date) => {
    setAlarmTime(date);
    setDatePickerVisible(false);
  };

  return (
    <KeyboardAwareScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <ScreenTitle
                onLeftPress={() => navigation.goBack()}
                onLogoPress={() => navigation.navigate("Home")}
                onMyPagePress={() => navigation.navigate("MyPage")}
              />

              <Calendar
                current={today}
                onDayPress={onDayPress}
                theme={{
                  todayTextColor: "#00adf5",
                  arrowColor: "#00adf5",
                  selectedDayBackgroundColor: "#00adf5",
                  selectedDayTextColor: "#ffffff",
                }}
                markedDates={{
                  [selectedDate!]: { selected: true, marked: true, selectedColor: "#00adf5" },
                }}
              />

              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {selectedDate ? moment(selectedDate).format("YYYY. M. D ddd") : "날짜를 선택하세요"}
                </Text>
              </View>

              {/* ✅ 메모 입력란 (키보드 올라오면 확장) */}
              <View style={[styles.memoContainer, { height: memoHeight }]}>
                <TextInput
                  style={styles.memoInput}
                  placeholder="메모를 입력하세요..."
                  multiline
                  scrollEnabled={true}
                  value={selectedDate ? notes[selectedDate] || "" : ""}
                  onChangeText={onNoteChange}
                  onFocus={() => setMemoHeight(500)} // ✅ 키보드가 열릴 때 메모장 커짐
                  onBlur={() => setMemoHeight(100)}  // ✅ 키보드가 닫히면 원래 크기로
                />
              </View>

              {/* 알람 설정 버튼 */}
              <Button title="알람 설정하기" onPress={() => setDatePickerVisible(true)} />

              {alarmTime && (
                <Text style={styles.alarmText}>
                  설정된 알람 시간: {moment(alarmTime).format("YYYY-MM-DD HH:mm")}
                </Text>
              )}

              {/* 날짜/시간 선택 모달 */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleDatePickerConfirm}
                onCancel={() => setDatePickerVisible(false)}
              />
            </View>
          </ScrollView>

          {/* ✅ 하단 메뉴가 가려지지 않도록 수정 */}
          <HomeBottomMenu
            onHomePress={() => navigation.navigate("Home")}
            onMeetingPress={() => navigation.navigate("Meeting")}
            onChattingPress={() => navigation.navigate("Chatting")}
            onCalendarPress={() => navigation.navigate("Calendar")}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
    paddingBottom: 70,  
  },
  dateContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom:10, 
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  memoInput: {
    borderRadius:10,
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    fontSize: 16,
    
    textAlignVertical: "top",
  },
  memoContainer: {
    flex: 1,  
    maxHeight: 500,  // ✅ 최대 높이 설정
  },
  alarmText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

export default ScheduleScreen;
