import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FolderContext = createContext({});

export const FolderContextProvider = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tweetContext, setTweetContext] = useState({});
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    async function loadFolders() {
      const memoryFolders = await AsyncStorage.getItem("@foldify:folders");
      setFolders(JSON.parse(memoryFolders) || []);
    }

    loadFolders();
  }, []);

  async function createFolder({ name, color }) {
    const newFolder = {
      id: `${Math.floor(Math.random() * 100).toString()}-${name
        .toLowerCase()
        .split(" ")
        .join("-")}`,
      name: name,
      color: color,
      tweets: [],
    };
    await AsyncStorage.setItem(
      `@foldify:folders`,
      JSON.stringify([...folders, newFolder])
    );
    setFolders([...folders, newFolder]);
  }

  async function deleteFolder(id) {
    const filteredFolders = folders.filter((folder) => folder.id !== id);
    await AsyncStorage.setItem(
      `@foldify:folders`,
      JSON.stringify(filteredFolders)
    );
    setFolders(filteredFolders);
  }

  // create a function that receives a folder and a string called tweetId, then it should add the tweetId to the folder's tweets array
  async function addTweetToFolder({ id }, tweetId) {
    const folder = folders.find((folder) => folder.id === id);
    folder.tweets.push(tweetId);
    await AsyncStorage.setItem(`@foldify:folders`, JSON.stringify(folders));
    setFolders(folders);
  }

  async function deleteTweet(id) {
    const filteredFolders = folders.map((folder) => {
      folder.tweets = folder.tweets.filter((tweetId) => tweetId !== id);
      return folder;
    });
    console.log(filteredFolders);
    await AsyncStorage.setItem(`@foldify:folders`, JSON.stringify(folders));
    setFolders(filteredFolders);
  }

  return (
    <FolderContext.Provider
      value={{
        folders,
        createFolder,
        deleteFolder,
        addTweetToFolder,
        modalVisible,
        setModalVisible,
        setTweetContext,
        tweetContext,
        deleteTweet,
      }}
    >
      {props.children}
    </FolderContext.Provider>
  );
};
