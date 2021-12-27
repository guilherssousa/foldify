import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import { useFolder } from "../hooks/useFolder";

export function Tweet({ tweet }) {
  const { setModalVisible, setTweetContext } = useFolder();

  function handleOpenTweet(tweet) {
    const url = `https://twitter.com/${tweet.meta.username}/status/${tweet.meta.id}`;
    Linking.openURL(url);
  }

  function handleOpenMenu(tweet) {
    setTweetContext(tweet);
    setModalVisible(true);
  }

  return (
    <TouchableOpacity
      style={styles.tweet}
      onPress={() => handleOpenTweet(tweet)}
      onLongPress={() => handleOpenMenu(tweet)}
    >
      <View style={styles.author}>
        <Text style={styles.authorName}>{tweet.meta.name}</Text>
        <Text style={styles.authorHandle}>@{tweet.meta.username}</Text>
      </View>
      <Text style={styles.content}>{tweet.html}</Text>
      {tweet.mediaHtml && (
        <View style={styles.mediaContainer}>
          {tweet.mediaHtml.map((media, index) => {
            return (
              <Fragment key={index}>
                <View style={styles.media}>
                  <Image
                    source={{ uri: media.src }}
                    style={[
                      styles.tweetImage,
                      {
                        width: 345 / (tweet.mediaHtml.length % 2 ? 1 : 2),
                      },
                    ]}
                  />
                </View>
                {tweet.mediaHtml.length % 2 === 0 && (
                  <View style={styles.breakLine} key={`${index}-breaker`} />
                )}
              </Fragment>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tweet: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#12121220",
  },
  author: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
