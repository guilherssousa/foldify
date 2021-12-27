import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useFolder } from "../hooks/useFolder";

export default function AddTweet({ tweetId, intentFunction }) {
  const { folders, addTweetToFolder } = useFolder();

  async function handleAddToFolder(folder) {
    await addTweetToFolder(folder, tweetId);
    intentFunction(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.lead}>Deseja adicionar esse tweet a qual pasta?</Text>
      <ScrollView style={styles.availableFolders}>
        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={styles.folder}
            onPress={() => handleAddToFolder(folder)}
          >
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.folderDescription}>
              {folder.tweets.length} tweets
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 64,
    backgroundColor: "#FFF",
  },
  lead: {
    fontSize: 26,
    fontFamily: "bold",
    color: "#121212",
  },
  availableFolders: {
    marginTop: 16,
  },
  folder: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#12121220",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderName: {
    fontFamily: "bold",
  },
  folderDescription: {
    fontFamily: "light",
  },
});
