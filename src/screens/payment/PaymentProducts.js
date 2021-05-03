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
  Alert,
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
export default class PaymentProducts extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      brCodeValue: '',
      QRCode:'',
      endpointMP: '',
      paymentStatus:'',
      idTransaction:'',
      idNot: '',
      modalizeRef: React.createRef(null),
      accTK: [],
      fotoUser:'',
      idAnuncio: '',
      resultSumValues: ''
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  


  componentDidMount() {
    let e = this;
    let valueRoute = '';
    valueRoute =  this.props.route.params.valuePayment;
    let qtdRoute = 0;
    qtdRoute = this.props.route.params.quantidade;
    let idDonoDoProduto = ''; 
    idDonoDoProduto = this.props.route.params.idsUsers;

    let currentUser = firebase.auth().currentUser;

    this.setState({resultSumValues: valueRoute.reduce((a, b) => a + b, 0)})
    alert('Soma dos valores: ' + valueRoute.reduce((a, b) => a + b, 0))

    if(idDonoDoProduto !== null) {

      idDonoDoProduto.map(async (i) => {
        await firebase.firestore().collection('usuarios').doc(i).onSnapshot(documentSnapshot => {
          e.state.accTK.push(documentSnapshot.data().accessTK)
          console.log('TOKEN FIREBASE PRODUCTS: ' + e.state.accTK)
        })
  
        await firebase.firestore().collection('usuarios').doc(currentUser.uid).onSnapshot(documentSnapshot => {
          e.setState({fotoUser: documentSnapshot.data().photoProfile})
        })
      })
    } else {
      return null
    }
    
    console.log('VALOR DO ROUTER: ' + valueRoute + '\n\nQuantidade de Produto: ' + qtdRoute + '\n\nID DO ANUNCIANTE: ' + idDonoDoProduto)
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

  getPaymentStatus(id) {
    //vê se o status já está "approved"
    fetch(`https://api.mercadopago.com/v1/payments/search?status=approved&id=${id}`, {
      method:'GET',
      headers: {
        'Authorization': 'Bearer APP_USR-6750007878892152-042620-c064296b7bfe5933f09885a0254c5dec-749886689'
      }
    })
    .then((res) => res.json())
    .then((json) => this.redirectToPagePix(json.results[0].status))
    .catch((err) => alert('Houve um erro ao verificar o status da transação: ' + err))
  }

  mpTaxAndPayment(data, taxWeWo, taxUser, fullValue) {
    alert(`Valor total: ${fullValue}\n\n\nTaxa do WeWo (15%): ${taxWeWo}\nValor do anunciante: ${taxUser}`)

    this.setState({endpointMP: data})
  }

  _onNavigationStateChange(webViewState){
    if(webViewState.url.includes('https://www.mercadopago.com/mp.php')) {
      Alert.alert("Atenção", "O pagamento foi aprovado! Avalie o serviço para ajudar mais pessoas a encontrarem o profissional!", [
        {
            text: "OK",
            onPress: () => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: this.state.idAnuncio, idUserCartao: this.props.route.params.idContratado}),
            style: "cancel"
        },
        { text: "Vou avaliar", onPress: () => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: this.state.idAnuncio, idUserCartao: this.props.route.params.idContratado}) }
      ]);
    }
  }



  mercadoPago() {
    console.log('TOKEN DO USUARIO: ' +  this.state.accTK)
    let value = this.state.resultSumValues;
    let newNumber = new Number(value);
    
    let percentToWeWo = ((newNumber / 100) * 15).toFixed(2);
    let percentToWeWoNumberInt = new Number(percentToWeWo);

    let percentToUser = ((newNumber / 100) * 85).toFixed(2);
    let percentToUserNumberInt = new Number(percentToUser);

    let percentToUser2 = ((newNumber / 100) * 100).toFixed(2);
    let percentToUserNumberInt2 = new Number(percentToUser2);
    
    this.setState({brCodeValue:'loaded'});
    
      fetch('https://api.mercadopago.com/checkout/preferences', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.accTK}`
        },
        body: JSON.stringify({
          items: [
            {
              title:"Pagamento de Serviço WeWo",
              quantity: 1,
              currency_id:"BRL",
              unit_price: percentToUserNumberInt2,
              picture_url: this.state.fotoUser
            }
          ],
          marketplace_fee: percentToWeWoNumberInt,
          back_urls: {
            success: "https://www.mercadopago.com/mp.php"
          }
        })
      })
      .then((res) => res.json())
      .then((json) => this.mpTaxAndPayment(json.init_point, percentToWeWoNumberInt, percentToUserNumberInt, percentToUserNumberInt2))
      .catch((e) => alert('erro ao requisitar o mercado pago: ' + e))
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
            <Heading style={{paddingTop: 10, marginBottom:10}}>Valor do Serviço: R${this.state.resultSumValues}</Heading>
            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>(será cobrada uma pequena taxa sobre o valor para a manuntenção da plataforma)</TextDescription2>
              <TouchableOpacity style={{marginTop: windowHeight/9}} onPress={() => this.mercadoPago()}>
                <Image source={require('../../../assets/wewologoPayment.png')} style={{width:248, height:66}}/>
              </TouchableOpacity>
              <TextDescription2 style={{paddingHorizontal:60, marginTop:10, fontSize:10, textAlign:'center'}}>(Conta Mercado Pago, Cartão de Crédito ou Débito, Pix, Boleto, Cartão Virtual Caixa, Lotérica e PayPal)</TextDescription2>
          </View>
        :
          <WebView 
            source={{ uri: endpointMP }} 
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            />
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
