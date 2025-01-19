import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Menu, IconButton, Provider } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

type Props = {
  onLeftPress: () => void;
  onLogoPress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
  isAuthor: boolean;
  menuVisible: boolean;  // 부모에서 메뉴 상태를 전달받음
  onMenuToggle: () => void;  // 메뉴 토글을 위한 함수
};

const MeetingContentTitle = ({
  onLeftPress,
  onLogoPress,
  onEditPress,
  onDeletePress,
  isAuthor,
  menuVisible,
  onMenuToggle,
}: Props) => {
  return (
    <Provider>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Image source={require('../../images/left_icon.png')} style={styles.iconImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogoPress}>
          <Image source={require('../../images/logo_white.png')} style={styles.titleLogo} />
        </TouchableOpacity>

        <Menu
  visible={menuVisible}
  onDismiss={onMenuToggle}
  anchor={
    <TouchableOpacity onPress={onMenuToggle} style={styles.menuButton}>
      <Image 
        source={require('../../images/dots_icon.png')}  // 원하는 이미지 경로로 변경
        style={styles.menuImage}
      />
    </TouchableOpacity>
  }
>
  {isAuthor ? (
    <>
      <Menu.Item onPress={onEditPress} title="수정" />
      <Menu.Item onPress={onDeletePress} title="삭제" />
    </>
  ) : (
    <Menu.Item onPress={() => alert('신고')} title="신고" />
  )}
</Menu>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: height * 0.08,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#ffffff',
  },
  menuButton: {
  width: width * 0.1,
  height: width * 0.1,
  justifyContent: 'center',
  alignItems: 'center',
},
menuImage: {
  width: width * 0.06,
  height: width * 0.06,
  resizeMode: 'contain',
},
  iconButton: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'contain',
  },
  titleLogo: {
    width: width * 0.4,
    height: height * 0.07,
    resizeMode: 'contain',
  },
});

export default MeetingContentTitle;
