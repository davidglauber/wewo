/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from "react";
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
import { SafeBackground, IconResponsive, TextDescription2, IconResponsiveNOBACK, Heading, Title} from '../home/styles';

// import components
import { Modalize } from 'react-native-modalize';

import LottieView from 'lottie-react-native';


import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import { WebView } from 'react-native-webview'

//QRCODE
import QRCode from 'react-native-qrcode-svg';

//BIBLIOTECA PIX
import { staticPix } from "pix-charge";


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  paddingTitle: {
    padding: 30,
  },
  moneyCard: {
    position:'absolute',
    right:windowWidth/8
  },
  title: {
    marginLeft: 20, 
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
export default class MLConfigAccount extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      modalizeRef: React.createRef(null)
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  mercadoPago() {
    alert('Você está sendo redirecionado para página de autorização')
  }


  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  navigateTo = screen => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };


  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  render() {
    const endpointMP = this.state.endpointMP;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />
          <View style={{alignItems:'center'}}>
            <Heading style={styles.paddingTitle}>Conectar Conta Mercado Pago</Heading>
            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Para que você consiga realizar transações pelos seus serviços, é necessário que você conecte a sua conta mercado pago para fazermos os repasses necessários</TextDescription2>
              <TouchableOpacity style={{marginTop:40}} onPress={() => this.mercadoPago()}>
                <Image source={require('../../../assets/MPlogo.png')} style={{width:248, height:64}}/>
              </TouchableOpacity>
          </View>

          {/*Modalize dos comentários*/}
            <Modalize
              ref={this.state.modalizeRef}
              snapPoint={650}
              modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{alignItems:'center', marginTop:40}}>
                <Text>HI</Text>
            </View>
          </Modalize>

      </SafeBackground>
    );
  }
}
