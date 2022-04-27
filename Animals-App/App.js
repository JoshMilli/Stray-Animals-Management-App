import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import MainScreen from './screens/MainScreen';
import AddPost from './screens/AddPost';
import ProfileScreen from './screens/ProfileScreen';
import MessageScreen from './screens/MessageScreen';
import Analytics from './screens/Analytics';
import SelectedProfile from './screens/SelectedProfile'

const Stack = createNativeStackNavigator();

export default function App() {
  return (

<NavigationContainer>
  <Stack.Navigator>
      
      <Stack.Screen options={{headerShown: false, title:'Login / Register'} } name="Login" component={LoginScreen} />
      <Stack.Screen options={{headerShown: false, title:'Main Page'} } name="MainScreen" component={MainScreen} />
      <Stack.Screen options={{headerShown: true, title:'Post'} } name="PostScreen" component={AddPost} />
      <Stack.Screen options={{headerShown: true, title:'Profile'} } name="Profile" component={ProfileScreen} />
      <Stack.Screen options={{headerShown: true, title:'Send Message'} } name="Messages" component={MessageScreen} />
      <Stack.Screen options={{headerShown: true, title:'Analytics'} } name="Analytics" component={Analytics} />
      <Stack.Screen options={{headerShown: true, title:'Profile'} } name="SelectedProfileScreen" component={SelectedProfile} />
     
  </Stack.Navigator>
</NavigationContainer>
  
  );
}