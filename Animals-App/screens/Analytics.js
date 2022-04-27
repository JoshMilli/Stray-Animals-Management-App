import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { db } from '../components/firebase-config';
import {collection,addDoc, orderBy,query,onSnapshot, where} from 'firebase/firestore';
import * as Progress from 'react-native-progress';
// import { ProgressBar, Colors , TextInput} from "react-native-paper";

const Analytics = () => {


  const PostsCollectionRef = collection(db, "Posts");
  const usersCollectionRefUsers = collection(db, "Users");
  const DATA = [];
  const [TotalPosts, setTotalPosts] = useState(0);
  const [TotalUsers, setTotalUsers] = useState(0);

  const [totalWelfares,setTotalWelfares] = useState(0);
  const [TotalLost, setTotalLost] = useState(0);
  const [TotalFound, setTotalFound] = useState(0);
  const [Value, setValue] = useState(0);
  const [Dogs, setDogs] = useState(0);
  const [Cats, setCats] = useState(0);



  useEffect(() => {

    const q = query(usersCollectionRefUsers);

    const unsubscribe = onSnapshot(q, querySnapshot => {
      
      const id =  querySnapshot.docs.map(doc => ({
        posts: doc.data().Posts,
        verified: doc.data().verified,
        welfare: doc.data().welfare

      }))

      
    var totalPosts = 0;

      
      id.forEach((val)=>{
        if(val.posts > 0 ){
          totalPosts = totalPosts + val.posts;
        }

      })
      const totalUsers = id.length;

      // const totalPosts = id.filter((val)=>val.posts>0)
      // const totalP = totalPosts.length;

      const totalWelfares = id.filter((val)=> val.verified == 1 && val.welfare == true)
      const totalW = totalWelfares.length;
      

      setTotalPosts(totalPosts);
      setTotalUsers(totalUsers);
      GetTotalPosts(totalPosts);
      setTotalWelfares(totalW);

    });

    return () => unsubscribe();
  }, []);


  const GetTotalPosts = (totPosts)=>{
    const q2 = query(PostsCollectionRef);

    const unsubscribe =  onSnapshot(q2, querySnapshot => {
      
      const id2 =  querySnapshot.docs.map(doc => ({
        status: doc.data().status,
        type: doc.data().Type
      }))


      const Lost = id2.filter((val)=> val.status == "lost" );
      const Found = id2.filter((val)=> val.status == "found" );

      const AllDogs = id2.filter((val)=> val.type == "Dog" );
      const AllCats = id2.filter((val)=> val.type == "Cat" );

      var totalDogs = AllDogs.length;
      var totalCats = AllCats.length;

      var totalLost = Lost.length;
      var totalFound = Found.length;

      setTotalFound(totalFound);
      setTotalLost(totalLost);

      setDogs(totalDogs);
      setCats(totalCats);

      var newVal = (totalFound / totPosts);
      console.log(totalFound)
      console.log(newVal)
      setValue(newVal);

      return () => unsubscribe();

    });

  }



  return (
      <SafeAreaView style={styles.container}>

<View>



    <View style={styles.stats}>

    <Text style={styles.statsText}>{TotalPosts} Posts</Text>
    <Text style={styles.statsText}>{TotalUsers} Users</Text>
    <Text style={styles.statsText}>{Dogs} Dogs</Text>
    <Text style={styles.statsText}>{Cats} Cats</Text>
    <Text style={styles.statsText}>{totalWelfares} Welfares</Text>

    </View>


    <View style={styles.StatInfo}>

    <Text style={styles.FoundCol}></Text>
    <Text style={styles.statsText2}>{TotalFound} Animals Found</Text>
    
    <Text style={styles.LostCol}></Text>
    <Text style={styles.statsText2}>{TotalLost} Animals Lost</Text>
    

    </View>

 
    <Progress.Pie
        borderWidth={2}
        borderColor='white'
        animated = {true}
        style={styles.Chart}
        progress = {Value}
        unfilledColor="#8c072f"
        size={300}
        color='#098231'
      />



    </View>

      </SafeAreaView>



  )
}

export default Analytics

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#27282b'
    
  },
  stats:{
    alignSelf:'center',
    padding: 22,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 20,
    marginTop: 2,
    flexDirection:'row',
    flexWrap:'wrap'
  },
  statsText:{
    fontSize: 20,
    fontWeight:'600',
    alignSelf:'center',
    padding: 11,
    color: 'white'
  },
  statsText2:{
    fontSize: 16,
    fontWeight:'600',
    alignSelf:'center',
    padding: 15,
    color: 'white'
  },
  StatInfo:{
    alignSelf:'center',
    marginBottom: 3,
    padding: 11,
    flexDirection: 'row'
  },
  FoundCol:{
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor:'#098231',
    alignSelf:'center'
  },
  LostCol:{
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor:'#8c072f',
    alignSelf:'center',
  },
  Chart:{
    alignSelf:'center'
  }
})