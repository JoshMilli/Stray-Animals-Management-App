import { SafeAreaView, StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useState,useEffect,useLayoutEffect,useCallback} from 'react'
import { GiftedChat, Bubble, Message } from 'react-native-gifted-chat'
import {collection,addDoc, orderBy,query,onSnapshot, getDocs} from 'firebase/firestore';
import { auth, db } from '../components/firebase-config';
import {useNavigation} from '@react-navigation/core';
import { selectedUser, selectedDocID } from './MainScreen';



const MessageScreen = () => {

  const UserData = [];
  const [messages, setMessages] = useState([]);
  const userEmail = auth.currentUser.email;
  const [CurrentUser, setCurrentUser] = useState();
  const usersCollectionRefUsers = collection(db, "Users"); 
  const collectionRef = collection(db, 'Chats');

  


  useEffect(() => {

    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      
      const id =  querySnapshot.docs.map(doc => ({
        _id: doc.data()._id,
        postID: doc.data().postID,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
        to: doc.data().to,
        
      }))

      const to = selectedUser.toString();
      const post = selectedDocID;
      

      const newData = id.filter((val)=> val.postID == post && val.to == to)
      setMessages(newData);
    });

    getCurrentUsers();
    return () => unsubscribe();
  }, []);


  const getCurrentUsers = async () => {

    // setloading(true);
    const data = await getDocs(usersCollectionRefUsers);
    data.forEach(doc =>{
    const dataG = (doc.id, "=>", doc.data());

    if(dataG.email == userEmail){
        UserData.push(dataG.username);
        // UserID.push(doc.id);
        // UserPosts.push(dataG.Posts);
    }

    })
    setCurrentUser(UserData);
    // setID(UserID);
    // setTotalPosts(UserPosts);

  }


  const onSend = useCallback((messages = []) => {
    const to = selectedUser.toString();
    const postID = parseInt(selectedDocID);
    const { _id, createdAt, text, user } = messages[0]
   

    addDoc(collection(db, 'Chats'), { _id, createdAt,  text, user, to, postID });
}, []);

function renderLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#6646ee' />
    </View>
  );
}


  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.ChattingWith}>Group Chat About: {selectedUser[[0]]}'s Post</Text>
    <Text style={styles.ChattingWith}>Group Chat ID: {selectedDocID.toString()}</Text>

   

    <View style={styles.MainFeed}>
    
    <GiftedChat
            messages={messages}
            // showAvatarForEveryMessage={true}
            alwaysShowSend = {true}
            renderUsernameOnMessage = {true}
            isTyping = {true}
            scrollToBottom = {true}
            renderLoading={renderLoading}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: CurrentUser,
                avatar: 'https://placeimg.com/140/140/any'
            }}
        />

    </View>



  </SafeAreaView>
  )
}

export default MessageScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 15,
  
  },
  MainFeed:{
    height: '100%',
    flex: 1
    
  },
  ChattingWith:{
    fontSize: 20,
    borderBottomWidth:2,
    alignSelf:'center',
  },
  Chat:{
    
  }
  
})