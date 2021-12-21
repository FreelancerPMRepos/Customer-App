import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// Auth
import Login from '../Screens/Auth/Login';
import Signup from '../Screens/Auth/Signup';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import OtpVerification from '../Screens/Auth/OtpVerification';
import ResetPassword from '../Screens/Auth/ResetPassword';
import UserDetails from '../Screens/Auth/UserDetails';

// Main
import Home from '../Screens/Main/Home';
import Search from '../Screens/Main/Search';
import Settings from '../Screens/Main/Settings';
import StoreDescription from '../Screens/Main/StoreDescription';

// HairCut
import HairCuts from '../Screens/HairCut/HairCuts';
import HairCutDescriptionScreen from '../Screens/HairCut/HairCutDescriptionScreen';

// Appointments
import Appointments from '../Screens/Appointment/Appointments';
import AppointmentsDescriptionScreen from '../Screens/Appointment/AppointmentsDescriptionScreen';


const Routes = (props) => {
  const loginSuccess = useSelector(state => state.auth.loginSuccess)
  const loginType = useSelector(state => state.auth.loginType)

  const Stack = createStackNavigator();

  const Tab = createBottomTabNavigator();

  console.log("yu",loginType)

  const HomeTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { borderTopWidth: 1, elevation: 0, }, }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image source={focused ? require('../Images/hair-salon.png') : require('../Images/hair-salon-light.png')} />
              )
            }
          }} />
        <Tab.Screen
          name="HairCuts"
          component={HairCuts}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image source={focused ? require('../Images/Path.png') : require('../Images/Pathlight.png')} />
              )
            }
          }} />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image source={focused ? require('../Images/search.png') : require('../Images/searchLight.png')} />
              )
            }
          }} />
        <Tab.Screen
          name="Appointments"
          component={Appointments}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image source={focused ? require('../Images/calendar.png') : require('../Images/calendarLight.png')} />
              )
            }
          }} />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image source={focused ? require('../Images/setting.png') : require('../Images/settingLight.png')} />
              )
            }
          }} />
      </Tab.Navigator>
    )
  }

  const MyStack = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        {
          loginSuccess ? (
            <>
            {
              loginType ? (
                 <Stack.Screen name="UserDetails" component={UserDetails} />
              )
              :
              null
            }
             
              <Stack.Screen name="HomeTabs" component={HomeTabs} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="HairCuts" component={HairCuts} />
              <Stack.Screen name="HairCutDescriptionScreen" component={HairCutDescriptionScreen} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="Appointments" component={Appointments} />
              <Stack.Screen name="AppointmentsDescriptionScreen" component={AppointmentsDescriptionScreen} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="StoreDescription" component={StoreDescription} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
            </>
          )
            :
            (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="OtpVerification" component={OtpVerification} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
              </>
            )
        }


      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  )
}

export default Routes;