import React, { useState, useCallback, useEffect } from "react";
import { Share, ToastAndroid, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FolderContextProvider } from "./contexts/FolderContext";

import ShareMenu from "react-native-share-menu";

import {
  useFonts,
  Epilogue_300Light,
  Epilogue_400Regular,
  Epilogue_500Medium,
  Epilogue_700Bold,
} from "@expo-google-fonts/epilogue";

import Home from "./pages/Home";
import Folder from "./pages/Folder";
import NewFolder from "./pages/NewFolder";
import AddTweet from "./pages/AddTweet";

const Stack = createNativeStackNavigator();

function App() {
  const [intent, setIntent] = useState(false);

  let [fontsLoaded] = useFonts({
    light: Epilogue_300Light,
    regular: Epilogue_400Regular,
    medium: Epilogue_500Medium,
    bold: Epilogue_700Bold,
  });

  const handleShare = useCallback((item) => {
    if (!item || !item.data) {
      return;
    }

    const { data } = item;

    // check if data is a valid twitter url
    if (data.indexOf("twitter.com") === -1) {
      ToastAndroid.show(
        "O conteúdo compartilhado não é um link válido.",
        ToastAndroid.SHORT
      );
      return;
    }

    // get tweet id from weblink
    const tweetId = data.split("/status/")[1].split("?")[0];

    // check if tweetId is only numbers and has length of 19
    if (tweetId.match(/^[0-9]*$/) && tweetId.length === 19) {
      // if tweetId is valid, open tweet
      setIntent(tweetId);
    }
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  if (!fontsLoaded) return <View />;

  if (intent) {
    return (
      <FolderContextProvider>
        <AddTweet tweetId={intent} intentFunction={setIntent} />
      </FolderContextProvider>
    );
  }

  return (
    <NavigationContainer>
      <FolderContextProvider>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "#FFF",
            },
          }}
        >
          <Stack.Screen
            name="Início"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Pasta"
            component={Folder}
            options={{
              headerShadowVisible: false,
              title: "",
            }}
          />
          <Stack.Screen
            name="NovaPasta"
            component={NewFolder}
            options={{
              headerShadowVisible: false,
              title: "",
            }}
          />
        </Stack.Navigator>
      </FolderContextProvider>
    </NavigationContainer>
  );
}

export default App;
