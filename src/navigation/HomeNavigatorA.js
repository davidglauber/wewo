/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React ,{useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';


// import Home screen
import Home from '../screens/home/HomeA';

// import Favorites screen
import Favorites from '../screens/favorites/FavoritesA';

// import Cart screen
import Cart from '../screens/cartaoVisita/CartaoVisita';

import SearchA from '../screens/search/SearchA';

import Settings from '../screens/settings/Configuracoes';

import SignUp from '../screens/signup/Cadastro';

import Notifications from '../screens/notifications/NotificationsA';

// import colors
import Colors from '../theme/colors';

//import ICON
import { FontAwesome5 } from '@expo/vector-icons';

import firebase from '../config/firebase';

import { ThemeContext } from '../../ThemeContext';

import white from '../theme/light';
import black from '../theme/dark';
import dark from '../theme/dark';
import { call } from 'react-native-reanimated';

// HomeNavigator Config

type Props = {
  color: string,
  focused: string,
  size: number,
};

// create bottom tab navigator
const Tab = createBottomTabNavigator();



// HomeNavigator
function HomeNavigator() {
  const {dark, setDark} = useContext(ThemeContext);
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    async function callFirebase() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setStatus(true)
        } else {
          setStatus(false)
        }
      })
    }

    callFirebase();
  },[])

console.log('Dark do HOMEEE: ' + dark)
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = `home${focused ? '' : '-outline'}`;
            size = 25
          } else if (route.name === 'Favorites') {
            iconName = `star${focused ? '' : '-outline'}`;
            size = 20
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      screenProps={{backgroundColor:'blue'}}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: dark ? '#d98b0d' : '#d98b0d',
        inactiveTintColor: Colors.secondaryText,
        showLabel: false, // hide labels
        style: {
          backgroundColor: dark ? '#121212' : 'white' // TabBar background
        },
      }}>
      {/*
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: props => (
            <FontAwesome5
              name={`address-card${props.focused ? '' : ''}`}
              {...props}
            />
          ),
        }}
      /> */}

   
    <Tab.Screen name="Favorites" component={Favorites}/>
    
    <Tab.Screen name="Home" component={Home} />
    
    <Tab.Screen
      name="NotificationsNav"
      component={Notifications}
      options={{
        tabBarIcon: props => (
          <FontAwesome5
            name={`bell${props.focused ? '' : ''}`}
            {...props}
            size = {15}
          />
        ),
      }}
    />


    {status == true ? 
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: props => (
            <FontAwesome5
              name={`user${props.focused ? '' : ''}`}
              {...props}
              size = {15}
            />
          ),
        }}
      /> : 
      <Tab.Screen
        name="SignUp"
        component={SignUp}
        options={{
          tabBarIcon: props => (
            <FontAwesome5
              name={`user-plus${props.focused ? '' : ''}`}
              {...props}
              size = {15}
            />
          ),
        }}
      />
    }
    </Tab.Navigator>
  );
}

export default HomeNavigator;
