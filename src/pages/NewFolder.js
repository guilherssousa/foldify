import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useFolder } from "../hooks/useFolder";

import colors from "../utils/colors.json";

export default function NewFolder() {
  const navigation = useNavigation();
  const { createFolder } = useFolder();
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState(colors[0].value);

  const handleCreateNewFolder = async () => {
    if (folderName.length < 3) {
      Alert.alert("Você não pode criar uma pasta com menos de 3 caracteres!");
      return;
    }

    await createFolder({ name: folderName, color: folderColor });
    navigation.popToTop();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.newFolderTitle}>Vamos criar uma nova pasta...</Text>

        <TouchableOpacity
          style={[styles.folderPreview, { backgroundColor: folderColor }]}
        >
          <View style={styles.folderIcon}></View>
          <Text style={styles.folderName} numberOfLines={1}>
            {folderName || "Um nome incrível"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nome da pasta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da pasta"
          onChangeText={setFolderName}
          value={folderName}
        ></TextInput>

        <Text style={styles.label}>Cor de fundo</Text>
        <View style={styles.colorPicker}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setFolderColor(color.value)}
              style={[
                styles.color,
                {
                  backgroundColor: color.value,
                  borderWidth: folderColor === color.value ? 2 : 0,
                  borderColor: "#121212",
                },
              ]}
            ></TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateNewFolder}
      >
        <Text style={styles.buttonText}>Criar &rarr;</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  newFolderTitle: {
    fontFamily: "bold",
    fontSize: 28,
  },
  folderPreview: {
    backgroundColor: "#C2E7D6",
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginTop: 24,
    height: 160,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  folderIcon: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 47,
    borderRadius: 24,
  },
  folderTweets: {
    fontFamily: "bold",
  },
  folderName: {
    fontSize: 22,
    fontFamily: "bold",
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "bold",
    marginTop: 16,
  },
  createButton: {
    backgroundColor: "#121212",
    width: "100%",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  color: {
    width: "30%",
    height: 60,
    borderRadius: 8,
  },
});
