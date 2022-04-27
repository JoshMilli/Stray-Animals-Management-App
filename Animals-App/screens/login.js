import React, { useState, useRef, useEffect } from 'react'

import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ToastAndroid, Image, Alert } from 'react-native'
// import Toast from 'react-native-easy-toast'
import {useNavigation} from '@react-navigation/core'
import ImagesExample from '../components/images'
import {auth} from '../components/firebase-config'
import { db } from '../components/firebase-config';
import {collection,addDoc,updateDoc,deleteDoc,doc, getDocs} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
  } from 'firebase/auth'
  import { LogBox } from 'react-native';
  

const LoginScreen = () => {
  const toastRef = useRef();
  const navigation = useNavigation()
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const usersCollectionRefUsers = collection(db, "Users"); 

  useEffect(() =>{
    const unsub = auth.onAuthStateChanged(user => {
      if (user){
        navigation.replace("MainScreen")
      }
    })

    return unsub
  }, [])
  LogBox.ignoreAllLogs();
  

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    
      const register = async () => {

        try {
          const user = await createUserWithEmailAndPassword(
            auth,
            Email,
            Password
          );
        await addDoc(usersCollectionRefUsers, {email: Email, Posts: 0});
            // await sendEmailVerification(user)
         console.log("User " +Email+ " has successfully registered.")
        } catch (error) {
          console.log(error.message);
          if(error.code === 'auth/invalid-email'){
            Platform.OS === 'android' ? ToastAndroid.show("Invalid Email address", 2000) : Alert.alert("Invalid Email address")
          }
          if(error.code === 'auth/weak-password'){
            Platform.OS === 'android' ? ToastAndroid.show("Password should be at least 6 characters.", 2000) : Alert.alert("Password should be at least 6 characters")
          }
          if (error.code === 'auth/email-already-in-use'){
            Platform.OS === 'android' ? ToastAndroid.show("Email already exists.", 2000) : Alert.alert("Email already exists.")
          }
          
        }
      };
    
      const login = async () => {
        try {
          const user = await signInWithEmailAndPassword(
            auth,
            Email,
            Password
          );
          Platform.OS === 'android' ? ToastAndroid.show('Welcome Back!', 2000) : Alert.alert("Welcome Back!") 
            console.log("User "+Email+" has logged in successfully.")
          
    
        } catch (error) {
          console.log(error.message)

          if (error.code === 'auth/wrong-password'){
            Platform.OS === 'android' ? ToastAndroid.show("Incorrect Password.", 2000) :  Alert.alert("Incorrect Password.")
          }
          if(error.code === 'auth/user-not-found'){
            Platform.OS === 'android' ? ToastAndroid.show("No user with that login.", 2000) :  Alert.alert("No user with that login.")
          }
          if (error.code === 'auth/too-many-requests'){
            Platform.OS === 'android' ? ToastAndroid.show("To many attempts, account disabled.", 2000) : Alert.alert("To many attempts, account disabled.")
          }
        }
      };

    return (


        <SafeAreaView
        style={styles.container}
        behavior="padding"
        >
          <ImagesExample/>

          <Text style={styles.header}>Sign In or Register</Text>
            <View style={styles.inputContainer}>
            
              
                <TextInput
                autoCapitalize='none'
                placeholder="Email"
                value={Email}
                onChangeText={text => setEmail(text.trim())}
                style={styles.input}
                > 
                </TextInput>
                
              
                <TextInput
                autoCapitalize='none'
                placeholder="Password"
                value={Password}
                onChangeText={text =>setPassword(text)}
                style={styles.input}
                secureTextEntry
                >
                </TextInput>

            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity
                onPress={login}
                style={styles.button}
                >
                <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={register}
                style={[styles.button, styles.buttonOutline]}
                >
                <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>

                
            </View>  
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },

    inputContainer:{
        width:'80%',
        top: -100
    },

    input:{
       
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderBottomWidth:0.6,
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5,
    },

    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40,
    },

    button:{
        backgroundColor:"#0782F9",
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems:'center',
    },
    buttonText:{
        color:'#fff',
        fontWeight:'700',
        fontSize:16,
    },

    buttonOutline:{
        backgroundColor:'#fff',
        marginTop:5,
        borderColor:'#0782F9',
        borderWidth:2,
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems:'center',
    },

    buttonOutLineText:{
        color:'#0782F9',
        fontWeight:'700',
        fontSize:16,
    },
    toast:{
        backgroundColor:'#576574',
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:4,
      },
      header:{
        fontSize: 24,
        top: -150,
        marginTop: 8,
        fontWeight: 'bold'
        
        
      }

    }

);

export default LoginScreen