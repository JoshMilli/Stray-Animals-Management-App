import { StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, TextInput, LogBox, Alert, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth } from '../components/firebase-config'
import {
    createUserWithEmailAndPassword,
    updateCurrentUser,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
  } from 'firebase/auth'
import {useNavigation} from '@react-navigation/core'
import {collection,addDoc,updateDoc,deleteDoc,doc, getDocs, setDoc} from "firebase/firestore";
import { db } from '../components/firebase-config'
import { useIsFocused } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { Block, Button, Card, Icon, Input, NavBar, Text } from 'galio-framework';
import { AntDesign } from '@expo/vector-icons'; 



const ProfileScreen = () => {

const navigation = useNavigation()
const [RegisteredWelfare, setRegisteredWelfare] = useState(false);

const ID = [];
const PhoneNum = [];
const UserName = [];
const name =[];
const lname = [];
const email = auth.currentUser.email;
const TotalP = [];

const [TotalPosts, setTotalPosts] = useState();
const [currentPhone, setcurrentPhone] = useState('');

const [welfareName, setwelfareName] = useState('');
const [newWelfareName, setnewWelfareName] = useState()
const [welfareEmail, setwelfareEmail] = useState('');
const [newWelfareEmail, setnewWelfareEmail] = useState();

const [currentUserName, setCurrentUserName] = useState('');
const [FirstName, setFirstName] = useState('');
const [LastName, setLastName] = useState('');

const [CurrentFirstName, setCurrentFirstName] = useState('');
const [CurrentLastName, setCurrentLastName] = useState('');


const [NewUserName,setNewUserName] = useState();

const [Newphone, setNewphone] = useState();

const isFocused = useIsFocused();
const [loading, setloading] = useState(false);
 
const [UserID, setUserID]= useState([]);

// const usersCollectionRef = collection(db, "Posts");
const usersCollectionRefUsers = collection(db, "Users"); 

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Setting a timer']);


useEffect(() => {
    getUsers();
     }, [isFocused]);

const getUsers = async () => {

    setloading(true);
    const data = await getDocs(usersCollectionRefUsers);
    data.forEach(doc =>{
    const dataG = (doc.id, "=>", doc.data());

    if(dataG.email == email){
        ID.push(doc.id);
        PhoneNum.push(dataG.number);
        UserName.push(dataG.username);
        name.push(dataG.name);
        lname.push(dataG.lastName);
        TotalP.push(dataG.Posts);

    }

    })

    setUserID(ID);
    setcurrentPhone(PhoneNum);
    setCurrentUserName(UserName);
    setFirstName(name);
    setLastName(lname);
    setTotalPosts(TotalP);
    setloading(false);
  };


    const signOutUser = async () => {
        try {
            await auth.signOut();
            navigation.replace("Login");
        } catch (e) {
            console.log(e);
        }
    }

    const onCheckmarkPress = ()=> {
        onChange(!checked);
      }

 const UpdateDetails = async (id) =>{
    const Document = doc(usersCollectionRefUsers,id);
     await updateDoc(Document, 
        {username: NewUserName,
         number: Newphone,
         name: CurrentFirstName,
         lastName: CurrentLastName,
         welfare: RegisteredWelfare,
         companyemail: welfareEmail,
         welfarename: welfareName,
         verified: 0
        })
     .then(() => {
        Alert.alert("Successful", "Your profile has been updated!")
      })
     
     getUsers();
 }


  return (
    <SafeAreaView style={styles.container}>

<SafeAreaView style={styles.Main}>

    <ScrollView>

{loading == true &&(
    <View>
        <Text>Loading...</Text>
    </View>
)}

    {currentUserName != '' && loading == false &&(

<SafeAreaView>

    <View style={[styles.card, styles.shadowProp, styles.elevation]}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
    
        <Text style={styles.heading}>
            Username:
        </Text>
        <AntDesign name="user" size={32} color="black"/>
        </View>
        <Text p muted style={[ styles.heading]}>{currentUserName}</Text>
    </View>

<View style={[styles.card, styles.shadowProp, styles.elevation]}>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
    
<Text style={styles.heading}>
            Posts:
        </Text>
        <AntDesign name="picture" size={32} color="black" />
    </View>
        <Text p muted style={[ styles.heading]}>{TotalPosts}</Text>
</View>

<View style={[styles.card, styles.shadowProp, styles.elevation]}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        
<Text style={styles.heading}>
            Number:
        </Text>
        <AntDesign name="customerservice" size={32} color="black" />
        </View>
        <Text p muted style={[ styles.heading]}>{currentPhone}</Text>
</View>

<View style={[styles.card, styles.shadowProp, styles.elevation]}>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
<Text style={styles.heading}>
            First Name:
        </Text>
        <AntDesign name="contacts" size={32} color="black" />
    </View>
        <Text p muted style={[ styles.heading]}>{FirstName}</Text>
</View>

<View style={[styles.card, styles.shadowProp, styles.elevation]}>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
<Text style={styles.heading}>
            Last Name:
        </Text>
        <AntDesign name="infocirlceo" size={32} color="black" />
    </View>
        <Text p muted style={[ styles.heading]}>{LastName}</Text>
</View>

</SafeAreaView>


   
    )}

{currentUserName == '' && loading == false &&(
    <View>
     <Text style={styles.ChangeTextUsername}>Username:</Text>
<TextInput
     placeholder={"Enter username"}
     value={currentUserName}
     onChangeText={text =>setNewUserName(text)}
     style={styles.input}
         >
     </TextInput>
     </View>
)}

{FirstName == '' && loading == false &&(
    <View>
<Text style={styles.ChangeText}>First Name:</Text>
<TextInput
     placeholder={"Enter your name"}
     value={FirstName}
     onChangeText={text =>setCurrentFirstName(text)}
     style={styles.input}
         >
     </TextInput> 
     </View>
)}

{LastName == '' && loading == false &&(
    <View>
<Text style={styles.ChangeText}>Last Name:</Text>
<TextInput
     placeholder={"Enter your last name"}
     value={LastName}
     onChangeText={text =>setCurrentLastName(text)}
     style={styles.input}
         >
     </TextInput> 
     </View>
)}

{currentPhone == '' && loading == false &&(
    <View>
     <Text style={styles.ChangeTextNumber}>Number:</Text>
     <TextInput
     placeholder={"Enter phone number" }
     value={currentPhone}
     onChangeText={text =>setNewphone(text)}
     style={styles.input}
     keyboardType = 'numeric'
     maxLength={8}
     
         >
     </TextInput>
     </View>
)}

{currentUserName == '' && loading == false &&(
    <View>
     

     <View style={styles.checkboxView}>
     {/* <Text style={styles.Approval}>Approved by Admin</Text> */}
     <Text style={styles.Approval}>Register as Welfare</Text>
     <Checkbox
          style={styles.checkbox}
          value={RegisteredWelfare}
          onValueChange={setRegisteredWelfare}
          color={RegisteredWelfare ? '#4630EB' : undefined}
        />
    </View>
     </View>
)}

{RegisteredWelfare == true  &&(
    
<View>
{currentUserName == '' && loading == false &&(
    <View>
<Text style={styles.ChangeTextNumber}>Animal Welfare</Text>
     <TextInput
     placeholder={"Enter comapny name" }
     value={welfareName}
     onChangeText={text =>setwelfareName(text)}
     style={styles.input}
     maxLength={11}
         >
     </TextInput>
     </View>
)}

{currentUserName == '' && loading == false &&(
    <View>
     <Text style={styles.ChangeTextNumber}>Company Email</Text>
     <TextInput
     placeholder={"Enter comapny email address" }
     value={welfareEmail}
     onChangeText={text =>setwelfareEmail(text)}
     style={styles.input}
     maxLength={25}
     keyboardType="email-address"
         >
     </TextInput>
     </View>
)}
</View>

)}


<SafeAreaView style={styles.BottomNav}>

{currentUserName == '' && loading == false &&(
<TouchableOpacity 
      onPress={()=>UpdateDetails(UserID[0])}
      style={[styles.button , styles.buttonUpdate]}>
      <Text style={styles.buttonText}>Update Profile</Text>
</TouchableOpacity>
)}

<TouchableOpacity 
      onPress={signOutUser}
      style={styles.button}>
      <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

</SafeAreaView>
    
</ScrollView>
</SafeAreaView>



    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        // marginTop: StatusBar.currentHeight || 0,
      },
      Main:{
        paddingVertical: 22,
        width: '98%',
        height: '100%'
      },
      BottomNav:{
        marginTop: 30,
        alignContent:'center',
        alignItems:'center',
        justifyContent: 'flex-end',
        },
    button:{
        backgroundColor:"#0782F9",
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems:'center',
    },
    buttonUpdate:{
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    buttonText:{
        color:'#fff',
        fontWeight:'700',
        fontSize:16,
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 13,
      },
      card: {  
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
       
        marginVertical: 8,
        marginRight: 5,
        marginLeft: 5
      },
      shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      elevation: {
        elevation: 13,
        shadowColor: '#52006A',
      },
    input:{
        fontSize: 17,     
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        borderBottomWidth:0.6,
        paddingHorizontal:7,
        paddingVertical:10,
        borderRadius:10,
        marginTop:10,
        fontWeight:'bold'
      },
      UserInfo:{
        padding: 8,
        alignContent:'center',
        justifyContent:'center',
        alignSelf:'center'
      },
      ChangeText:{
        marginTop: 20,
        fontSize: 20,
        // textTransform:'uppercase',
        alignSelf:'flex-start',
        marginLeft: 8
      },
      Approval:{
        marginTop: 20,
        fontSize: 20,
        
        // textTransform:'uppercase',
        marginLeft: 8
      },
      ChangeTextNumber:{
        marginTop: 20,
        fontSize: 20,
        // textTransform:'uppercase',
        alignSelf:'flex-start',
        marginLeft: 8
    },
    ChangeTextUsername:{
        marginTop: 20,
        fontSize: 20,
        // textTransform:'uppercase',
        alignSelf:'flex-start',
        marginLeft: 8
    },
    checkbox: {
        marginTop: 20,
        borderWidth:2,
        marginLeft: 10,
        width: 25,
        height: 25
        
      },
      checkboxView:{
        flexDirection:'row',
        alignItems:'center',
        
        
      },
    
})