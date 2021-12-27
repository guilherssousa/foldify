import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";

import { Tweet } from "../components/Tweet";
import { TweetSkeleton } from "../components/TweetSkeleton";

import { useFolder } from "../hooks/useFolder";

import { fetchTweets } from "../utils/twitter";

export default function Folder({ route }) {
  const [tweets, setTweets] = useState([]);
  const [limit, setLimit] = useState(6);
  const { modalVisible, setModalVisible, tweetContext, deleteTweet } =
    useFolder();
  const { folder } = route.params;

  const addTweets = async () => {
    // fetch tweets at offset limit - 6 to limit
    if (limit - 6 == 0) {
      return;
    }
    const newTweets = await fetchTweets(folder.tweets.slice(limit - 6, limit));
    setTweets([...tweets, ...newTweets]);
  };

  useEffect(() => {
    async function loadTweets() {
      const tweets = await fetchTweets(folder.tweets.slice(0, limit));
      setTweets(tweets);
    }

    loadTweets();
  }, [modalVisible]);

  const onScrollView = async ({ nativeEvent }) => {
    const isCloseToBottom = ({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }) => {
      const paddingToBottom = 20;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    };

    // check if is close to bottom and its safe to load new tweets without loop
    if (isCloseToBottom(nativeEvent) && tweets.length < folder.tweets.length) {
      setLimit(limit + 6);
      addTweets();
    }
  };

  const handleDeleteTweet = () => {
    deleteTweet(tweetContext.meta.id);
    setModalVisible(false);
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={styles.container}
        onScroll={onScrollView}
      >
        <Text style={styles.title}>{folder.name}</Text>

        <View>
          {tweets.length > 0
            ? tweets.map((tweet, index) => <Tweet tweet={tweet} key={index} />)
            : folder.tweets
                .slice(0, limit)
                .map((_, index) => <TweetSkeleton key={index} />)}
        </View>
        <Modal
          animationType="slide"
          isVisible={modalVisible}
          style={styles.modal}
          swipeDirection={"down"}
          onSwipeComplete={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalMenu}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Opções</Text>
              </View>
              <TouchableOpacity style={styles.modalMenuItem} onPress={() => {}}>
                <Text style={styles.modalMenuItemText}>Compartilhar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalMenuItem} onPress={() => {}}>
                <Text style={styles.modalMenuItemText}>Fixar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalMenuItem}
                onPress={handleDeleteTweet}
              >
                <Text style={[styles.modalMenuItemText, { color: "#a00" }]}>
                  Deletar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tweet: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#12121220",
  },
  author: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontFamily: "bold",
    fontSize: 18,
  },
  authorHandle: {
    fontSize: 14,
    marginLeft: 8,
    color: "#12121280",
  },
  content: {
    marginTop: 4,
    lineHeight: 20,
  },
  tweetImage: {
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#12121220",
    marginTop: 8,
  },
  mediaContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 8,
  },
  breakLine: {
    height: 10,
  },
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 16,
    elevation: 2,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 20,
  },
  modalTitle: {
    fontFamily: "bold",
    fontSize: 22,
  },
  modalMenuItem: {
    marginTop: 16,
  },
  modalMenuItemText: {
    fontFamily: "bold",
    fontSize: 16,
  },
});
