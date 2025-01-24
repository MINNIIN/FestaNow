// DateSelect.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type DateSelectProps = {
  performanceDate: Date;
  setPerformanceDate: (date: Date) => void; // 날짜 업데이트
  setShowDatePicker: (show: boolean) => void; // 표시하거나 숨기는 상태
};

const DateSelect: React.FC<DateSelectProps> = ({ performanceDate, setPerformanceDate, setShowDatePicker }) => {
  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || performanceDate;
    setShowDatePicker(false);  
    setPerformanceDate(currentDate);  
  };

  return (
    <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
      <Text style={styles.dateButtonText}>
        공연 날짜: {performanceDate.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    width: '100%',
    backgroundColor: '#4374D9', 
    paddingVertical: 10,         
    paddingHorizontal: 20,       
    marginBottom: 20,            
    alignSelf: 'center',
    borderWidth: 1,              
    borderColor: '#D5D5D5',   
  },
  dateButtonText: {
    fontSize: 14,                
    color: 'white',
    textAlign: 'center',
  },
});

export default DateSelect;
