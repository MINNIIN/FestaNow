import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

interface Comment {
  id: string;
  text: string;
  author: string;
}

const ContentComment = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("meetings")
      .doc(postId)
      .collection("comments")
      .orderBy("createdAt", "asc")
      .onSnapshot(snapshot => {
        const loadedComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setComments(loadedComments);
      });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    
    try {
      const currentUser = auth().currentUser;
      await firestore().collection("meetings").doc(postId).collection("comments").add({
        text: newComment,
        author: currentUser?.displayName || "익명",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 댓글 리스트 */}
      {comments.map((item) => (
        <View key={item.id} style={styles.commentItem}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
      ))}

      {/* 댓글 입력 필드 */}
      <View style={[styles.inputContainer, { width: width - 20 }]}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.submitButton}>
          <Text style={styles.submitText}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  author: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
  },
  submitButton: {
    marginLeft: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ContentComment;
