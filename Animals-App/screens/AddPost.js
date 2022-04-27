import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, StatusBar, Image, TextInput, Alert, Button, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../components/firebase-config';
import { LogBox, Switch, KeyboardAvoidingView, ScrollView, ActivityIndicator} from 'react-native';
import {collection,addDoc,updateDoc,deleteDoc,doc, getDocs, orderBy,query,onSnapshot} from "firebase/firestore";
import {auth} from '../components/firebase-config'
import DropDownPicker from 'react-native-dropdown-picker';
import {useNavigation} from '@react-navigation/core'
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import { useIsFocused } from '@react-navigation/native';
import BouncingPreloader from 'react-native-bouncing-preloaders';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const AddPost = () => {

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Warning: Cant perform a React state update on an unmounted component'])
LogBox.ignoreLogs(['VirtualizedLists'])


const [isEnabled, setIsEnabled] = useState(false);
const toggleSwitch = () => setIsEnabled(previousState => !previousState);
const [Color, setColor] = useState('')
const [TotalPosts, setTotalPosts] = useState(0);
const [Desc, setDesc]= useState('');
const [location, setlocation] = useState('');
const navigation = useNavigation();
const [id, setid] = useState();
const email = auth.currentUser.email;
const [loading, setloading] = useState(false);
const [NewID,setNewID] = useState(0);
const DATA = [];
const [image, setImage] = useState(null);
const [URI, setURI] = useState(Result);
const [Result, setResult] = useState();
const [URL, setURL] = useState();
const isFocused = useIsFocused();
const [uploading, setUploading] = useState(false);
const TotalPostsTemp = [];
const [currentUserName, setCurrentUserName] = useState('');
const usersCollectionRefUsers = collection(db, "Users"); 
const PostsCollectionRef = collection(db, "Posts");

const ID = [];
const UserName = [];

const [open, setOpen] = useState(false);
const [value, setValue] = useState(null);
const [items, setItems] = useState([
    {label: 'I have lost...', value: 'lost'},
    {label: 'I have found...', value: 'found'}
  ]);


const [open2, setOpen2] = useState(false);
const [value2, setValue2] = useState(null);
const [items2, setItems2] = useState([
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}
  ]);


  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState(null);
  const [items3, setItems3] = useState([
      {label: 'Dog', value: 'Dog'},
      {label: 'Cat', value: 'Cat'}
    ]);
    

    const [open4, setOpen4] = useState(false);
    const [value4, setValue4] = useState(null);
    const [items4, setItems4] = useState([
        {label: 'PAWS', value: 'PAWS'},
        {label: 'MSAW', value: 'MSAW'}
      ]);
      
    const [open5, setOpen5] = useState(false);
    const [value5, setValue5] = useState(null);
    const [items5, setItems5] = useState([
        {label: 'Yes', value: 'Yes'},
        {label: 'No', value: 'No'}
      ]);    


      useEffect(() => {
        getUsers();
        getNewID();
         }, [isFocused]);
    

  const createPost = async () => 
  {
    var ready = 0;

    if(Color == null || Color == ""){
      Alert.alert("Sorry about that!","Colour cant be empty.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(value2 == null || value2 == ""){
      Alert.alert("Sorry about that!","Injured cant be empty.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(value3 == null || value3 == ""){
      Alert.alert("Sorry about that!","Type of animal cant be empty.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(value == "found" && value4 == null){
      Alert.alert("Sorry about that!","Welfare cant be empty.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(Desc == ""){
      Alert.alert("Sorry about that!","Description cant be empty.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(URI == null || URI == ""){
      Alert.alert("Sorry about that!","Please take an image or browse for one.")
      ready = 0;
    }
    else{
      ready = 1
    }
    if(location == "" || location == null){
      Alert.alert("Sorry about that!", "You need a location...")
      ready = 0;
    }
    else{
      ready = 1
    }

if (ready == 1){
  setUploading(true); 
  var PostDate=Math.floor(Date.now());
  let url = await uploadImageAsync(URI);
  
  await addDoc(PostsCollectionRef, { 
    username: currentUserName,
    Colour: Color,
    Injured: value2,
    Type: value3,
    Collar: isEnabled ? 'Yes' : 'No',
    Welfare: value4,
    status: value,
    Description: Desc,
    picture: url,
    location: location,
    timestamp: PostDate,
    PostID: NewID })

  const Document = doc(usersCollectionRefUsers,id[0].id);
  
  var counter = 1;
  var TotalP = parseInt(TotalPosts);
  var Total = (counter + TotalP);

  //update total Posts count
  await updateDoc(Document, {Posts: Total})
  .then(Alert.alert("Successfully Uploaded!", "Your post is up!"))
  .catch((e)=>Alert.alert(e.message));
  
  //Navigate to the main screen.
  //Uploading status is finished
  navigation.navigate('MainScreen');
  setUploading(false);
}


  
  };
  
  //Launch the camera
  const TakeImage = async () => {
      let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });


    if (!result.cancelled) {
      setImage(result.uri);
      setURI(result.uri);
    }
  };


  const BrowseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      
      setImage(result.uri);
      setURI(result.uri);
      
    }
  };


  const getUsers = async () => {

    setloading(true);
    const data = await getDocs(usersCollectionRefUsers);
    data.forEach(doc =>{
    const dataG = (doc.id, "=>", doc.data());

    if(dataG.email == email){
        ID.push({id: doc.id});
        UserName.push(dataG.username);
        TotalPostsTemp.push(dataG.Posts);
    }

    })

    setid(ID);
    setCurrentUserName(UserName);
    setTotalPosts(TotalPostsTemp)
    setloading(false);
  };



  const getNewID = async () => {

    const q = query(PostsCollectionRef);

    const unsubscribe = onSnapshot(q, querySnapshot => {
      
      const id =  querySnapshot.docs.map(doc => 
        
      ({
      postid: doc.data().PostID,
    }))

    
    let newid = id.length + 1;
    // console.log(newid);
    setNewID(newid);
    
    
    });
    return () => unsubscribe();
  
  };

  const CreateProfile = () =>{
    navigation.navigate("Profile");
  }


  const uploadImageAsync =async(uri)=> {
    
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    const fileRef = ref(getStorage(), uuid.v4());
    const result = await uploadBytes(fileRef, blob)
    .then(console.log(result));
    
    
    let url = await getDownloadURL(fileRef).then((val)=>{
        setURL(val);
        return val;

    }).catch((error)=>{
      Alert.alert(error.message);
    });

    return url;
    
    
  }


  return (

    <SafeAreaView style={styles.container}>
  
    <View style={styles.MainFeed}>

    {uploading == true &&(
      <View style={styles.loadingAnimation}>
        
      <BouncingPreloader
  icons={[
    require('../assets/happy.png'),
    require('../assets/dog-treat.png'),
    require('../assets/laughing.png'),
    require('../assets/cat.png')
  ]}
  leftRotation="-680deg"
  rightRotation="360deg"
  speed={1000} />
<Text style={styles.uploadText}>UPLOADING, PLEASE WAIT</Text>
    </View>
    )}


      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
       
      {currentUserName == '' && loading == false && uploading == false &&(
        <View style={styles.MakeUser}>
          <Text style={styles.MakeUserText}>You need a username to post.</Text>

          <TouchableOpacity style={styles.button} onPress={()=>CreateProfile()}>
        <Text style={styles.buttonText}>Setup my profile!</Text>
      </TouchableOpacity>

      <View style={styles.loadingAnimation}>
        
        <BouncingPreloader
    icons={[
      require('../assets/happy.png'),
      require('../assets/dog-treat.png'),
      require('../assets/laughing.png'),
      require('../assets/cat.png')
    ]}
    leftRotation="-680deg"
    rightRotation="360deg"
    leftDistance={-350}
    rightDistance={-240}
    speed={1850} />
 
      </View>

        </View>
      )}

      {currentUserName != '' && loading == false && uploading == false &&(
        <View>
          <View style={styles.UploadPictures}>
    <TouchableOpacity style={styles.buttonUpload} onPress={TakeImage}>
        <Text style={styles.buttonPicker}>TAKE IMAGE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonUpload} onPress={BrowseImage}>
        <Text style={styles.buttonPicker}>BROWSE IMAGE</Text>
      </TouchableOpacity>
        </View>
      {image && <Image source={{ uri: image }} style={{ width: '100%', height: 200, alignSelf:'center', marginBottom: 10, borderRadius: 15 }} />}
        
      </View>
      )}

<View style={styles.DropDownType}>

{currentUserName != '' && loading == false && uploading == false &&(
    <DropDownPicker
    
    textStyle={{
      fontSize: 18
    }}
    zIndex={50006}
      theme="DARK"
      maxHeight={100}
      closeOnBackPressed={true}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Lost / Found"
    />
)}

</View>

<View style={styles.DropDownType}>

{currentUserName != '' && loading == false && uploading == false &&(

<DropDownPicker
      theme="DARK"
      textStyle={{
        fontSize: 18
      }}
      zIndex={50005}
      maxHeight={100}
      closeOnBackPressed={true}
      open={open3}
      value={value3}
      items={items3}
      setOpen={setOpen3}
      setValue={setValue3}
      setItems={setItems3}
      placeholder="Type of Animal"
    />
)}


</View>

<View style={styles.DropDownType}>

{currentUserName != '' && loading == false && uploading == false &&(

    <DropDownPicker
      theme="DARK"
      textStyle={{
        fontSize: 18
      }}
      zIndex={50004}
      maxHeight={100}
      closeOnBackPressed={true}
      open={open2}
      value={value2}
      items={items2}
      setOpen={setOpen2}
      setValue={setValue2}
      setItems={setItems2}
      placeholder="Injured Status"
    />
)}

</View>



{currentUserName != '' && loading == false && uploading == false &&(

<View style={styles.DropDownType}>
{currentUserName != '' && loading == false &&(
<DropDownPicker
    
    textStyle={{
      fontSize: 18
    }}
    zIndex={50003}
      // style={{marginTop: 15}}
      theme="DARK"
      maxHeight={100}
      closeOnBackPressed={true}
      open={open5}
      value={value5}
      items={items5}
      setOpen={setOpen5}
      setValue={setValue5}
      setItems={setItems5}
      placeholder="Animal has collar?"
    />
)}
</View>

)}


<View style={styles.DropDownType}>
{value =="lost" || currentUserName != '' && uploading == false &&(
<DropDownPicker
    
    textStyle={{
      fontSize: 18
    }}
    zIndex={50002}
      // style={{marginTop: 15}}
      theme="DARK"
      maxHeight={100}
      closeOnBackPressed={true}
      open={open4}
      value={value4}
      items={items4}
      setOpen={setOpen4}
      setValue={setValue4}
      setItems={setItems4}
      placeholder="Report to which Animal Welfare?"
    />
)}
</View>


{currentUserName != '' && loading == false && uploading == false &&(

     <TextInput
     placeholder="Colour of animal:"
     value={Color}
     onChangeText={text =>setColor(text)}
     style={styles.input}
     maxLength={10}
         >
     </TextInput>
)}



{currentUserName != '' && uploading == false &&(
  <View>

    <TextInput
     placeholder="Description: (max 50 characters)"
     value={Desc}
     onChangeText={text =>setDesc(text)}
     style={styles.inputDesc}
     maxLength={50}
         >
     </TextInput>  
     <Text style={styles.maxLengthText}>{Desc.length+"/"+'50'}</Text>    
     </View>
)}

{currentUserName != '' && loading == false && uploading == false &&(
  <View style={{width: '100%', padding: 4, alignSelf:'center'}}>

  <GooglePlacesAutocomplete
      query={{
        key: "***********************************",
        language: 'en', // language of the results
        components: 'country:mu',
      }}
      
      // returnKeyType={"search"}
      nearbyPlacesAPI="GooglePlacesSearch"
      fetchDetails={false}
      debounce={400}
      value={location}
      placeholder="Location"
      onPress={(data, details) => setlocation(data.structured_formatting.main_text)}
      minLength={2}
      onFail={error => console.error(error)}


      styles={{
        textInputContainer: {
          backgroundColor: 'rgba(0,0,0,0)',
          borderTopWidth: 0,
          borderBottomWidth:0,
        },
        listView: {
          flexShrink: 1
         },
        description: {
          fontWeight: 'bold',
          fontSize: 13,
        },
        textInput: {
          backgroundColor:'none',
          borderBottomWidth: 0.8,
          fontSize: 18
        },
      }}
    /> 
         
         
  </View>
)}

{currentUserName != '' && loading == false && uploading == false &&(
  <View style={styles.bottomBtn}>
     {uploading == false &&(
     <TouchableOpacity
                onPress={createPost}
                style={styles.button}
                >
                <Text style={styles.buttonText}>{uploading === true ? 'UPLOADING PLEASE WAIT!' : 'REPORT'}</Text>
                </TouchableOpacity>
     )}
     
     </View>
)}
     </ScrollView>
    </View>


    </SafeAreaView>
  )
}

export default AddPost

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'center',
    // marginTop: StatusBar.currentHeight || 0
  },
  MainFeed:{
    padding: 4,
    width: '100%',
    height: '100%'
  },
  DropDownStatus:{
    marginBottom: 15
  },
DropDownInjured:{
 
},
MakeUser:{
alignItems:'center'
},
MakeUserText:{
fontSize: 20,
fontWeight:'600'
},
DropDownType:{
 
  marginTop: 15
},
input:{
  fontSize: 18,     
  borderTopWidth:0,
  borderLeftWidth:0,
  borderRightWidth:0,
  borderBottomWidth:0.6,
  paddingHorizontal:7,
  paddingVertical:10,
  borderRadius:10,
  marginTop:10,
},
bottomBtn:{
  flex: 1
},
inputDesc:{
  fontSize: 18,     
  borderTopWidth:0,
  borderLeftWidth:0,
  borderRightWidth:0,
  borderBottomWidth:0.6,
  paddingHorizontal:7,
  paddingVertical:10,
  borderRadius:10,
  marginTop:2,
  
},
UploadPictures:{
  
  flexDirection:'row',
  alignSelf:'center',
  padding: 2
},
loadingAnimation:{
  flex: 1,
  alignSelf:'center',
  marginTop: 300
},
TextCollar:{
 fontSize: 17,
 marginLeft: 5 
},
buttonPicker:{
  fontSize: 17,
  color: 'white',
  fontWeight:'700',
  alignSelf:'center',
  marginBottom: 10,
  padding: 10,
  
 
},
button:{
  backgroundColor:"#0782F9",
  width:'80%',
  padding:9,
  borderRadius:15,
  alignItems:'center',
  alignContent:'center',
  alignSelf:'center',
  margin: 35
},
buttonUpload:{
  flex: 1,
  backgroundColor:"#056b38",
  margin: 5,
  borderRadius:5,
  alignItems:'center',
  alignContent:'center',
  alignSelf:'center'
},
buttonText:{
  color:'#fff',
  fontWeight:'700',
  fontSize:16,
},
switch:{
 alignSelf:'flex-start'
},
uploadText:{
textDecorationLine:'underline',
marginTop: 10,  
fontSize: 20,
alignSelf:'center'
},
scrollView: {
  // backgroundColor: 'pink',
  
  
},
TextBox:{
  marginTop: 15,
 
},
Text:{
  textAlign:"left",
  
},
maxLengthText:{
  marginTop:6,
  marginLeft: 7
}

})