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
export default class PaymentServices extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      brCodeValue: '',
      endpointMP: '',
      valueService: '',
      value:20
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  
  componentDidMount() {
    let valueRoute = ''
    valueRoute =  this.props.route.params.valuePayment;

    this.setState({valueService: valueRoute})
    
    let replace = valueRoute.replace('R$', '');
    let replacePoint = replace.replace(',','.');

    this.setState({value: replacePoint})
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

  mercadoPago() {
    let value = this.state.value;
    let newNumber = new Number(value);

    
    this.setState({brCodeValue:'loaded'});
    
      fetch('https://api.mercadopago.com/checkout/preferences?access_token=APP_USR-4801354026747963-040711-bd3c57cc909703918b030e1eeaa28c66-188576751', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_reference:"test_user_7106258@testuser.com",
          items: [
            {
              title:"Pagamento de Serviço",
              quantity: 1,
              currency_id:"BRL",
              unit_price: newNumber,
              picture_url: "https://a-static.mlcdn.com.br/618x463/lapis-simples-com-borracha-preto-art-school/sakurashop/5093/0223ea02b0d96a9172d018a598d8fa32.jpg"
            }
          ]
        })
      })
      .then((res) => res.json())
      .then((json) => this.setState({endpointMP: json.sandbox_init_point}))
      .catch(() => alert('erroo ao requisitar o mercado pago'))
  }
    
  render() {
    const endpointMP = this.state.endpointMP
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />
        {this.state.brCodeValue == '' ?
          <View style={{alignItems:'center'}}>
            <Heading style={styles.paddingTitle}>Pagamento</Heading>
            <Heading style={{paddingTop: 10, marginBottom:10}}>Valor do Serviço: {this.state.valueService}</Heading>
            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Escolha o método de pagamento que mais lhe é conveniente (será cobrada uma pequena taxa sobre o valor para a manuntenção da plataforma)</TextDescription2>
              <TouchableOpacity onPress={() => this.pixQRCODE()}>
                <Image source={require('../../../assets/pix.png')} style={{width:134, height:134}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.mercadoPago()}>
                <Image source={require('../../../assets/MPlogo.png')} style={{width:248, height:64}}/>
              </TouchableOpacity>
              <TextDescription2 style={{paddingHorizontal:60, marginTop:10, fontSize:10, textAlign:'center'}}>(Conta Mercado Pago, Cartão de Crédito ou Débito, Pix, Boleto, Cartão Virtual Caixa, Lotérica e PayPal)</TextDescription2>
              {this.state.brCodeValue !== '' &&
                <QRCode
                  size={300}
                  value={this.state.brCodeValue}
                />
              }
          </View>
        :
          <WebView source={{ uri: endpointMP }} />
        }
      </SafeBackground>
    );
  }
}
