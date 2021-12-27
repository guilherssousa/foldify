import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Folder } from "../components/Folder";
import { NewFolder } from "../components/NewFolder";

import { useFolder } from "../hooks/useFolder";

import data from "../utils/data.json";

export default function Home() {
  const isFocused = useIsFocused();
  const { folders } = useFolder();

  // useEffect(() => {
  //   async function loadFolders() {
  //     const memoryFolders = await AsyncStorage.getItem("@foldify:folders");
  //     setFolders(JSON.parse(memoryFolders) || []);
  //   }

  //   loadFolders();
  // }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.lead}>Olá! 👋</Text>

      <View style={styles.header}>
        <Text style={styles.primaryText}>Minhas pastas</Text>
        <Text style={styles.secondaryText}>{folders.length} pastas</Text>
      </View>

      <View style={styles.folders}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
          data={folders}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => <Folder folder={item} />}
        />
      </View>

      <NewFolder />
      <StatusBar style="dark" />
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
  header: {
    marginTop: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryText: {
    fontSize: 22,
    fontFamily: "bold",
    color: "#121212",
  },
  secondaryText: {
    fontSize: 14,
    color: "#0B0B0B",
    fontFamily: "regular",
  },
  folders: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
