/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useContext, useState, useEffect} from "react";
import {
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";

//CSS responsivo
import { SafeBackground, IconResponsive, TextDescription2, IconResponsiveNOBACK, Heading} from '../home/styles';

import LottieView from 'lottie-react-native';

import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import payLoading from '../../../assets/loadingPay.json';


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  paddingTitle: {
    padding: 30
  },
  title: {
    marginLeft: windowWidth/6, 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: 'white'
  }
  ,
  titleMain: {
    marginLeft: 10, 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: 'white'
  }
})

// NotificationsA
export default function AwaitPayment() {
const {dark, setDark} = useContext(ThemeContext);


    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={dark ? '#121212' : 'white'}
          barStyle={dark ? 'light-content' : 'dark-content'}
        />

          <View style={{alignItems:"center"}}>
            <Heading style={styles.paddingTitle}>Aguardando Pagamento</Heading>

            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Essa tela se atualiza constantemente, ao pagamento ser confirmado será mostrada uma mensagem de sucesso! {"\n\n"}<TextDescription2 style={{fontWeight:"bold"}}>(Lembre-se de pedir ao cliente para lhe avaliar)</TextDescription2></TextDescription2>
            <View style={{alignItems:'center', marginTop:100}}>
              <LottieView source={payLoading} style={{width:200, height:200}} autoPlay loop />  
            </View>
          </View>


      </SafeBackground>
    );
}
