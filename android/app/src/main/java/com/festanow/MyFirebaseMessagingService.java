package com.festanow;  // 패키지 이름을 프로젝트의 패키지에 맞게 수정하세요.

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // 푸시 메시지를 처리하는 코드 작성
        // 예: 알림을 표시하거나 앱 내에서 메시지를 처리하는 로직 추가
    }

    @Override
    public void onNewToken(String token) {
        // 새로운 FCM 토큰을 처리하는 코드 작성
        // 예: 서버로 토큰을 전송하는 로직 추가
    }
}
