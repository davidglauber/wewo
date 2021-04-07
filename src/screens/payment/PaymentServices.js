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


//QRCODE
import QRCode from 'react-native-qrcode-svg';

import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px';

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

// You should create the preference server-side, not client-side but we show client-side for the sake of simplicity
const getPreferenceId = async (payer, ...items) => {
  const response = await fetch(
    `https://api.mercadopago.com/checkout/preferences?access_token=TEST-4801354026747963-040711-377b3fce36180bd55a0eeb4ab28ecd37-188576751`,
    {
      method: 'POST',
      body: JSON.stringify({
        items,
        payer: {
          email: payer,
        },
      }),
    }
  );

  const preference = await response.json();

  return preference.id;
};

// NotificationsA
export default class PaymentServices extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      paymentResult:null
    };
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

  pixQRCODE() {
    console.log('br code:')
  }

  render() {
    const startCheckout = async () => {
      try {
        const preferenceId = await getPreferenceId('payer@email.com', {
          title: 'Dummy Item Title',
          description: 'Dummy Item Description',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: 150.0,
        });
  
        const payment = await MercadoPagoCheckout.createPayment({
          publicKey: 'TEST-5780a04e-0f67-497b-9491-7c608290abb8',
          preferenceId,
        });
  
        this.setState({paymentResult: payment});
      } catch (err) {
        Alert.alert('Something went wrong', err.message);
      }
    };

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />
        <View style={{alignItems:'center'}}>
          <Heading style={styles.paddingTitle}>Pagamentos</Heading>
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Escolha o método de pagamento que mais lhe é conveniente (será cobrada uma pequena taxa sobre o valor para a manuntenção da plataforma)</TextDescription2>
            {/*<TouchableOpacity onPress={() => this.pixQRCODE()}>
              <Image source={require('../../../assets/pix.png')} style={{width:134, height:134}}/>
            </TouchableOpacity>*/
            }
            <TouchableOpacity onPress={startCheckout}>
              <Text style={styles.text}>Pagar com Mercado Pago</Text>
            </TouchableOpacity>
        </View>
      </SafeBackground>
    );
  }
}
