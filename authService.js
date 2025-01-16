import auth from "@react-native-firebase/auth";

// 로그인 
export function signIn({ email, password }) {
  return auth().signInWithEmailAndPassword(email, password);
}

// 회원가입 
export function signUp({ email, password }) {
  return auth().createUserWithEmailAndPassword(email, password);
}

// 앱을 가동할 때, 로그인 상태가 변경될 때 사용자 정보를 받아옴
export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

// 로그아웃 
export function signOut() {
  return auth().signOut();
}
