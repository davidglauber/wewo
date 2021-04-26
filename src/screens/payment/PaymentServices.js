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
      QRCode:'',
      endpointMP: '',
      valueService: '',
      value:20,
      paymentStatus:'',
      idTransaction:'',
      idNot: '',
      modalizeRef: React.createRef(null)
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  
  componentDidMount() {
    let valueRoute = ''
    valueRoute =  this.props.route.params.valuePayment;
    let idNotifyRoute = this.props.route.params.idNotification;

    this.setState({idNot: idNotifyRoute})

    this.setState({valueService: valueRoute})
    
    let replace = valueRoute.replace('R$', '');

    if(replace.includes(',00')){
      let replacePoint = replace.replace(',00','');
      let replacePoint2 = replacePoint.replace('.','')

      this.setState({value: replacePoint2})
      console.log(`REPLACE VALUE: ${replacePoint2}`)
    } else {
      let replacePoint = replace.replace(',','.');
      let replacePoint2 = replacePoint.replace('.','')
      
      this.setState({value: replacePoint2})
      console.log(`REPLACE VALUE2: ${replacePoint2}`)
    }

  }


  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
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

  saveImportantData(qrcode64, statusPayment, idTransaction){
    this.setState({QRCode: qrcode64})
    this.setState({paymentStatus: statusPayment})
    this.setState({idTransaction: idTransaction})
  }


  redirectToPagePix(status) {
    if(status !== 'pending') {
      let valorDoServicoMenosATaxa = `R$ ${((this.state.value / 100) * 95).toFixed(2)}`;
      this.setState({paymentStatus: status})
      
      this.props.navigation.navigate('PixPayment', {valueLessTax: valorDoServicoMenosATaxa, idNot: this.state.idNot})
    } else {
      return alert('O Pix do Serviço só será habilitado depois de pagar a taxa de manutenção');
    }
  }

  getPaymentStatus(id) {
    //vê se o status já está "approved"
    fetch(`https://api.mercadopago.com/v1/payments/search?status=approved&id=${id}`, {
      method:'GET',
      headers: {
        'Authorization': 'Bearer APP_USR-4801354026747963-040711-bd3c57cc909703918b030e1eeaa28c66-188576751'
      }
    })
    .then((res) => res.json())
    .then((json) => this.redirectToPagePix(json.results[0].status))
    .catch((err) => alert('Houve um erro ao verificar o status da transação: ' + err))
  }



  pixQRCODE() {
    let value = this.state.value;
    let newNumber = new Number(value);

    let percentToWeWo = ((newNumber / 100) * 5).toFixed(2);
    let percentToWeWoNumberInt = new Number(percentToWeWo);

    this.openModalize();

    //cria o pix
    fetch('https://api.mercadopago.com/v1/payments', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Authorization': 'Bearer APP_USR-4801354026747963-040711-bd3c57cc909703918b030e1eeaa28c66-188576751', 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: percentToWeWoNumberInt,
          payment_method_id: "pix",
          payer: {
            first_name: "WEWO",
            last_name: `REFERENTE AO SERVIÇO PRESTADO`,
            email: "wewo@gmail.com"
          }
        })
      })
      .then((res) => res.json())
      .then((json) =>  this.saveImportantData(json.point_of_interaction.transaction_data.qr_code_base64, json.status, json.id))
      .catch((err) => alert('erro ao requisitar : ' + err))
  }











  mercadoPago() {
    let value = this.state.value;
    let newNumber = new Number(value);

    let percentToWeWo = ((newNumber / 100) * 15).toFixed(2);
    let percentToWeWoNumberInt = new Number(percentToWeWo);

    let percentToUser = ((newNumber / 100) * 85).toFixed(2);
    let percentToUserNumberInt = new Number(percentToUser);
    
    this.setState({brCodeValue:'loaded'});
    
      fetch('https://api.mercadopago.com/checkout/preferences', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer APP_USR-4801354026747963-040711-bd3c57cc909703918b030e1eeaa28c66-188576751'
        },
        body: JSON.stringify({
          items: [
            {
              title:"Pagamento de Serviço",
              quantity: 1,
              currency_id:"BRL",
              unit_price: percentToUserNumberInt,
              picture_url: "https://a-static.mlcdn.com.br/618x463/lapis-simples-com-borracha-preto-art-school/sakurashop/5093/0223ea02b0d96a9172d018a598d8fa32.jpg"
            }
          ],
          marketplace_fee: percentToWeWoNumberInt
        })
      })
      .then((res) => res.json())
      .then((json) => this.setState({endpointMP: json.sandbox_init_point}))
      .catch((e) => alert('erroo ao requisitar o mercado pago: ' + e))
  }


  render() {
    const endpointMP = this.state.endpointMP;

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
          </View>
        :
          <WebView source={{ uri: endpointMP }} />
        }

          {/*Modalize dos comentários*/}
            <Modalize
              ref={this.state.modalizeRef}
              snapPoint={650}
              modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{alignItems:'center', marginTop:40}}>
              <Text style={{paddingHorizontal:20, textAlign:'center'}}>Pague a taxa através desse QR Code {"\n\n"}(ao ser confirmado o pagamento, será aberto uma tela para pagar a parte do contratado, NÃO FECHE A PÁGINA){"\n\n"}Taxa: R${((this.state.value / 100) * 5).toFixed(2)}{"\n"}Status: {this.state.paymentStatus}</Text>
              <Image style={{width: 300, height: 300}} source={{uri: `data:image/png;base64,${this.state.QRCode}`}}/>
              <TouchableOpacity onPress={() => this.getPaymentStatus(this.state.idTransaction)}>
                <IconResponsiveNOBACK name="sync-alt" size={30} color={'#d98b0d'}/>
              </TouchableOpacity>
            </View>
          </Modalize>

      </SafeBackground>
    );
  }
}
