import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, StatusBar, Image, ActivityIndicator, Alert, LogBox, Platform, ToastAndroid, Button, TextInput } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../components/firebase-config';
import {auth} from '../components/firebase-config'
import {collection,addDoc,updateDoc,deleteDoc,doc, getDocs, orderBy, query,onSnapshot, where} from "firebase/firestore";
import {useNavigation} from '@react-navigation/core'
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { getStorage, ref, deleteObject } from "firebase/storage";
import Modal from "react-native-modal";
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BouncingPreloader from 'react-native-bouncing-preloaders';



// import Modal from "react-native-modal";
export let selectedUser=[];
export let selectedDocID=[];
export let SelectedProfileUser = [];

const MainScreen = () => {

  const isFocused = useIsFocused();
  const UserData = [];
  const UserID = [];
  const UserPosts = [];
  const IsVerified = [];
  const WelfareName = [];

  let ReportResults = [];
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [TotalPosts, setTotalPosts] = useState();
  const [ID, setID] = useState();
  const userEmail = auth.currentUser.email;
  const navigation = useNavigation()
  const [selectedId, setSelectedId] = useState(null);
  const PostsCollectionRef = collection(db, "Posts");
  const usersCollectionRefUsers = collection(db, "Users");
  const ReportCollectionRef = collection(db, "Reports");  

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const [loading, setloading] = useState(false)
  const [Data, setData]= useState([]);
  const [Animal, setAnimal] = useState(false);
  const [isFetching, setisFetching] = useState(false);
  const [CurrentUser, setCurrentUser] = useState()

  const [ChangeView, setChangeView] = useState(false);
  const [GlobalSearch, setGlobalSearch]= useState("");
  const [isSearchVisable, setisSearchVisable] = useState(false)

  const [IsVerifiedData, setIsVerified] =useState();
  const [WelfareNameData, setWelfareName] = useState();

  const data = [
    { label: 'Nudity', value: 'Nudity' },
    { label: 'Violence', value: 'Violence' },
    { label: 'Harassment', value: 'Harassment' },
    { label: 'Self-Injury', value: 'Self-Injury' },
    { label: 'False News', value: 'False News' },
    { label: 'Spam', value: 'Spam' },
    { label: 'Hate Speech', value: 'Hate Speech' },
    { label: 'Not accurate Info', value: 'Not accurate Info' },
  ];

  const [selected, setSelected] = useState([]);


  
  LogBox.ignoreAllLogs(true);
  LogBox.ignoreLogs(['Setting a timer']);
  LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

useEffect(() => {
  getCurrentUsers();
  getPosts();

  }, [isFocused]);

  useEffect(() => {
    getPosts();
    }, [ChangeView]); 

  useFocusEffect(
    useCallback(() => {
      //To reset the selected user and user PostID when main screen in focused.
      selectedUser = [];
      selectedDocID = [];
      SelectedProfileUser = [];
      
      return () => {
        console.log("Screen is unfocused")
      };
    }, [])
  );


  const getPosts = () => {
    // setloading(true);

    const q = query(PostsCollectionRef, orderBy('timestamp', 'desc'));
    
    onSnapshot(q, querySnapshot => {
    

      const id =  querySnapshot.docs.map(doc => 
        ({
        id: doc.id,
        timestamp: doc.data().timestamp,
        postID: doc.data().PostID,
        title: doc.data().status +" "+ doc.data().Type, 
        status: doc.data().status, 
        location: doc.data().location, 
        type: doc.data().Type, 
        injured: doc.data().Injured, 
        collar: doc.data().Collar, 
        color: doc.data().Colour, 
        username: doc.data().username[0], 
        description: doc.data().Description,
        imagesrc: doc.data().picture,
        welfare: doc.data().Welfare,
      }))


 
    //Show data for Animal Welfare if they are logged in.
    //Variable ChangeView is based on 
      if(ChangeView == true){

      const newData = id.filter((val)=> val.welfare == WelfareNameData[0])
      setData(newData);
      }
      else{
      setData(id);
      }
      

    });
    
  
    // setloading(false);
    return () => unsubscribe();
  };


  const getCurrentUsers = async () => {

    // setloading(true);
    const data = await getDocs(usersCollectionRefUsers);
    data.forEach(doc =>{
    const dataG = (doc.id, "=>", doc.data());

    if(dataG.email == userEmail){
        UserData.push(dataG.username);
        UserID.push(doc.id);
        UserPosts.push(dataG.Posts);
        IsVerified.push(dataG.verified);
        WelfareName.push(dataG.welfarename);
        
    }

    })
    setCurrentUser(UserData);
    setID(UserID);
    setTotalPosts(UserPosts);
    setIsVerified(IsVerified);
    setWelfareName(WelfareName);

  }


  const Item = ({ item, onPress, backgroundColor, textColor }) => (

    <View style={[styles.ContentBox, styles.shadowProp]}>

      <View style={{}}>

    <View style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor, {fontSize: 28}]}>{item.title}</Text>
      <Text style={[styles.TextUsername, {color: 'orange', fontWeight:'500'}]}>{item.username}</Text>
    </View>
    
    {CurrentUser != item.username && item.status == 'found' && CurrentUser != '' &&(
    <TouchableOpacity onPress={onPress} style={[styles.item2]}>
      <Text style={[styles.TextUsername, {}]}>Adopt Animal</Text>
    </TouchableOpacity>
    )}

    </View>

    <View style={styles.HeaderPostButtons}>

    {CurrentUser != '' &&(
    <FontAwesome.Button name="send-o" size={23} style={styles.BttnHeaderNav} onPress={()=> MessageUser(item.username, item.postID)}>
        Comment's
    </FontAwesome.Button>
    )}

{CurrentUser != item.username && CurrentUser != '' && (
    <FontAwesome.Button name="flag" size={23} style={styles.BttnHeaderNav} onPress={toggleModal}>
        Report
        </FontAwesome.Button>
)}

        {CurrentUser == item.username &&(
        <FontAwesome.Button name="remove" size={23} style={styles.BttnHeaderNav} onPress={()=> DeletePost(item.id, item.imagesrc)}>
        Delete
        </FontAwesome.Button>
        )}
    </View>

    <View style={styles.ImageContainer}>
    {!item.imagesrc &&(
      <View>
        <ActivityIndicator />
      <ActivityIndicator size="large" color="#07336e" />
      </View>
    )}
    {item.imagesrc &&(
    <Image source = {{uri: item.imagesrc}}
   style = {{ width: '100%', height: 230, alignSelf:'center', borderRadius: 5 }}/>
    )}
    </View>

    {/* Modal View for Reporting a post */}

    <View style={{ flex: 1 }}>
     

      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.55}
        backdropTransitionInTiming={980}
        onBackButtonPress={toggleModal}
        animationIn='fadeIn'
        >
        <View style={{ flex: 1 }}>
          
        
          <View style={styles.containerDropDown}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Select Reasons"
          value={selected}
          onChange={itemX => {
            setSelected(itemX);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={25}
            />
          )}
          selectedStyle={styles.selectedStyle}
        />
      </View>
  


          <TouchableOpacity
                onPress={()=>ReportUser(item.postID, item.username)}
                style={styles.button}
                >
                <Text style={styles.buttonText}>Report</Text>
                </TouchableOpacity>
          
          <TouchableOpacity
                onPress={toggleModal}
                style={styles.button}
                >
                <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

        </View>
      </Modal>
    </View>


    <View style={styles.AllTextInBox}>
    {/* <Text style={styles.ContentText}>Animal: {item.type}</Text> */}
    <Text style={styles.ContentText}>Location: {item.location}</Text>
    <Text style={styles.ContentText}>Injured: {item.injured}</Text>
    <Text style={styles.ContentText}>Colour: {item.color}</Text>
    <Text style={styles.ContentText}>Has a Collar: {item.collar}</Text>
    <Text style={styles.ContentText}>Description: {item.description}</Text>
    </View>

    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.status === "lost" ? '#8c072f' : '#098231';
    const color = item.id === selectedId ? 'white' : 'white';

    return (

      <Item
        item={item}
        onPress={() => OpenProfile(item.username)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

const PostScreen = () =>{
  navigation.navigate('PostScreen');
}

const ProfileScreen = () =>{

  navigation.navigate('Profile');
}

const OpenProfile =(username) =>{


  SelectedProfileUser.push(username)
  navigation.navigate("SelectedProfileScreen")


}

const DeletePost = async (id, imageURL) =>{


const Document = doc(PostsCollectionRef,id);
deleteDoc(Document);


const UserDocument = doc(usersCollectionRefUsers, ID[0]);

var newPosts = parseInt(TotalPosts);
var Total = (newPosts - 1);
updateDoc(UserDocument, {Posts: Total});

//Delete Image stored in Storage, based off URL
const fileRef = ref(getStorage(), imageURL);
await deleteObject(fileRef)
.then(Alert.alert("Successful","Your post was deleted!"));
}


const MessageUser = (person, id) => {

  selectedUser.push(person);
  selectedDocID.push(id);
  navigation.navigate("Messages");
}

const ReportUser = (postid, username) =>{

const result = selected.map((val)=>val)

addDoc(ReportCollectionRef, {from: auth.currentUser.email, to: username , reason: result, postID: postid })
  .then(toggleModal())
  .then(Alert.alert("Thank You!", "Report Successful."))

  setSelected([]);

}


//Search through any records on firebase
//Get the search term from user, then get snapshot, then compare.
//Then filter results if found.
const SearchFeed = (searchterm) =>{

  if(searchterm != ''){
    const newData = Data.filter(item => {      
      const itemData = `
      ${item.type.toUpperCase()}   
      ${item.color.toUpperCase()} 
      ${item.collar.toUpperCase()}
      ${item.description.toUpperCase()}
      ${item.injured.toUpperCase()}
      ${item.location.toUpperCase()}
      ${item.status.toUpperCase()}
      ${item.username.toUpperCase()}`;
      
       const textData = searchterm.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    setData(newData);
  }
  else{
    getPosts();
  }


}


const ChangeMainView = (val) =>{
if(val == 1){
  setChangeView(true)
}
else{
  setChangeView(false)
}
}

const GoToAnalytics = () =>{
  navigation.navigate("Analytics");
}

const SortList = () =>{
  const q = query(PostsCollectionRef, orderBy('timestamp', 'desc'));

  onSnapshot(q, querySnapshot => {
    
    const id =  querySnapshot.docs.map(doc => 
    ({
    id: doc.id,
    timestamp: doc.data().timestamp,
    title: doc.data().status +" "+ doc.data().Type, 
    status: doc.data().status, 
    location: doc.data().location, 
    type: doc.data().Type, 
    injured: doc.data().Injured, 
    collar: doc.data().Collar, 
    color: doc.data().Colour, 
    username: doc.data().username[0], 
    description: doc.data().Description,
    imagesrc: doc.data().picture
  }))
      
    if(Animal){
      var SortedList = id.filter((val)=> val.status == "lost" )
      Platform.OS === 'android' ? ToastAndroid.show("Sorting by lost Animals", 2000) : Alert.alert("Sorting by lost Animals")
    }
    else{
      var SortedList = id.filter((val)=> val.status == "found" )
      Platform.OS === 'android' ? ToastAndroid.show("Sorting by found Animals", 2000) : Alert.alert("Sorting by found Animals")
    }
    
   
    setData(SortedList);
    // console.log(Data)

  });
  
  // return () => unsubscribe();
}

  return (
    
    <SafeAreaView style={styles.container}>

    <View style={styles.Header}>
      <Image source={require('../assets/logo.png')}
   style = {{ width: '58%', height: '100%', alignSelf:'flex-start' }}/>
      <Text style={styles.HeaderText}>MAKE A DIFFERENCE</Text>
    </View> 

    

    <View style={styles.MainFeed}>


    {IsVerifiedData == true &&(
      <View style={styles.verifiedMenu}>

                <TouchableOpacity
                onPress={()=>ChangeMainView(1)}
                style={styles.buttonVerified}
                >
                <Text style={styles.buttonText}>MY REPORTS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={()=>ChangeMainView(0)}
                style={styles.buttonVerified}
                >
                <Text style={styles.buttonText}>ALL REPORTS</Text>
                </TouchableOpacity>         

      </View>
    )}
    {/* Search Area */}

    {isSearchVisable && (

      <View style={{flexDirection:'row', borderBottomWidth: 2}}>

      <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode='while-editing'
      // value={GlobalSearch}
      onChangeText={queryText => SearchFeed(queryText)}
      style={styles.input}
      placeholder="Search Here"
      />

        <TouchableOpacity
       
        style={styles.buttonSearch}
        >
        <FontAwesome name="search" size={23} color="black" />
        </TouchableOpacity>

      </View>

    )}
      
    
    
 
    <FlatList
        data={Data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
        onRefresh={() => getPosts()}
        refreshing={isFetching}
        
      />
 

<SafeAreaView style={styles.BottomNav}>

        <FontAwesome.Button name="search" size={23} style={styles.BttnNav} onPress={()=>setisSearchVisable(!isSearchVisable)}>
          
        </FontAwesome.Button>

        <FontAwesome.Button name="eye" size={23} style={styles.BttnNav} onPress={()=>SortList(setAnimal(!Animal))}>
        
        </FontAwesome.Button>

        <FontAwesome.Button name="plus" size={23} style={styles.BttnNav} onPress={PostScreen}>
        
        </FontAwesome.Button>

        <FontAwesome.Button name="line-chart" size={23} style={styles.BttnNav} onPress={GoToAnalytics}>
        
        </FontAwesome.Button>

        <FontAwesome.Button name="user" size={23} style={styles.BttnNav} onPress={ProfileScreen}>
        
        </FontAwesome.Button>



      </SafeAreaView>


    </View>



    </SafeAreaView>
    
  )
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    
    marginTop: StatusBar.currentHeight || 0,
  },
  MainFeed:{
    
    width: '99%',
    height: '98%',
  },
  Header:{
    marginTop: StatusBar.currentHeight || 0,
    height: 47,
    alignItems:'center',
    flexDirection:'row',
    width:'100%',
    borderBottomWidth:2
  },
  ImageContainer:{
    backgroundColor:'#3d3e40',
    width: '97%',
    alignSelf:'center',
    borderRadius: 5
  },
  HeaderPostButtons:{
    padding: 6,
    justifyContent: 'center',
    backgroundColor: '#252a47',
    flexDirection:'row',
    flex: 1
  },
  button:{
    backgroundColor:"#0782F9",
    width:'90%',
    padding:9,
    borderRadius:15,
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center',
    margin: 5
  },
  buttonVerified:{
    backgroundColor:"#0782F9",
    padding:11,
    flex:1,
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center',
    marginTop: 5
  },
  buttonSearch:{
    
    padding:10,
    marginRight: 3,
    borderRadius:50,
    left: -57,
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center',
    width: 50,
  
  
  },
  buttonText:{
    color:'#fff',
    fontWeight:'700',
    fontSize:16,
  },
  BttnHeaderNav:{
    flex: 1,
    backgroundColor:'#252a47',
    
  },
  BottomNav:{
  justifyContent:'center',
  width:'100%',
  height: 50,
  flexDirection:'row',
  borderTopWidth: 1,
  backgroundColor:'#27282b',
  marginBottom: 30,
  
  },
  verifiedMenu:{
    alignItems:'center',
    alignSelf:'center',
    flexDirection:'row',
  },
  BttnNav:{
    flex:1,
    width: 70,
    justifyContent:'center',
    backgroundColor:'#27282b'
  },
  item: {
    // backgroundColor: '#f9c2ff',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 5,
    flex: 1,
    top: -10
  
  },
  item2: {
    // backgroundColor: '#f9c2ff',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    padding: 3,
    marginVertical: 3,
    marginHorizontal: 6,
    height: 45,
    justifyContent:'center',
    top: -7,
    flex: 0.4
   
  },
  title: {
    fontSize: 18,
    alignSelf:'center',
    textTransform: 'uppercase'
    
  },
  input: {
    height: 40,
    width:'94%',
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 25
  },
  ContentBox:{
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    width: '100%',
    marginVertical: 8,
    backgroundColor: '#27282b'
  },
  shadowProp:{
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dropdown: {
    height: 50,
      backgroundColor: 'transparent',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  containerDropDown:{
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
    borderRadius: 25,
    marginBottom: 10
  },
  selectedStyle: {
    borderRadius: 12,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 18,

  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  picture: {
    flex: 1,
    width: 120,
    height: 100,
    alignSelf:'center',
    margin: 15,
  },
  ContentText:{
    fontSize: 18,
    flex:1,
    textAlign:'center',
    color: 'white',
    fontWeight:'700'
  
  },
  AllTextInBox:{
    flexDirection:'column',
    padding: 4,
    marginTop: 2,
  },
  TextUsername:{
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
  },
  loadingText:{
    fontSize: 28,
    textTransform:'uppercase',
    marginTop: 200
  },
  HeaderText:{
    fontSize: 14,
    fontFamily: 'Roboto'
  },
  loading:{
    flex: 1,
    marginTop: 100,
    alignSelf:'center'
  }
})