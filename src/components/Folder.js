import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useFolder } from "../hooks/useFolder";

export function Folder({ folder }) {
  const navigation = useNavigation();
  const { deleteFolder } = useFolder();

  function handleDeleteFolder(id) {
    Alert.alert(
      `Deseja apagar a pasta?`,
      "Ao apagar, você não irá conseguir recuperar esses dados.",
      [
        {
          text: "Apagar",
          onPress: async () => await deleteFolder(id),
          style: "destructive",
        },
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  }

  return (
    <TouchableOpacity
      style={[styles.folder, { backgroundColor: folder.color }]}
      onPress={() => navigation.navigate("Pasta", { folder })}
      onLongPress={() => handleDeleteFolder(folder.id)}
    >
      <View style={styles.folderIcon}>
        <Text style={styles.folderTweets}>{folder.tweets.length}</Text>
      </View>
      <Text style={styles.folderName} numberOfLines={1}>
        {folder.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  folder: {
    backgroundColor: "#C2E7D6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "48%",
    marginTop: 16,
  },
  folderIcon: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  folderTweets: {
    fontSize: 12,
    fontFamily: "bold",
  },
  folderName: {
    fontSize: 16,
    fontFamily: "bold",
    marginTop: 16,
  },
});
