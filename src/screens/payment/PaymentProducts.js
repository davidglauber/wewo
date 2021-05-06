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
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";


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
      idAnuncio: '',
      resultSumValues: '',
      valorTotal: '',
      valueIncrement: 0
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  


  componentDidMount() {
    var e = this;
    let arrayProduct = this.props.route.params.infoProductArray;
    var currentUser = firebase.auth().currentUser;
    var arraySumValue = [];

    console.log('INFO PRODUCT ARRAY: ' + JSON.stringify(arrayProduct))

    Alert.alert("Importante", "Por questão de segurança, se você vai comprar mais de um produto será necessário pagar separadamente \n\nO PROCESSO É TOTALMENTE AUTOMÁTICO", [
      {
        text: "OK",
        onPress: () => {},
        style: "cancel"
      },
      { text: "Continuar", onPress: () => {}}
    ]);

    arrayProduct.map(async (i) => {
      //calcula o valor total dos produtos já com a quantidade correspondente
      let sumandmulti = i.value * i.qtd;
      arraySumValue.push(sumandmulti)
      
      if(i.idDonoDoProduto !== null) {
          await firebase.firestore().collection('usuarios').doc(i.idDonoDoProduto).onSnapshot(documentSnapshot => {
            e.state.accTK.push({
              accTK: documentSnapshot.data().accessTK,
              img: i.img,
              qtd: i.qtd,
              value: i.value,
              idDonoDoProduto: i.idDonoDoProduto
            })
          })
    
      } else {
        return null
      }
      
      console.log('VALOR DO ROUTER: ' + i.value + '\n\nQuantidade de Produto: ' + i.qtd + '\n\nID DO ANUNCIANTE: ' + i.idDonoDoProduto)
    })

    this.setState({resultSumValues: arraySumValue.reduce((a, b) => a + b, 0)})
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





  mpTaxAndPayment(data, taxWeWo, taxUser, fullValue, quantidade) {
    alert(`Valor total: ${fullValue * quantidade}\n\n\nTaxa do WeWo (15%): ${taxWeWo * quantidade}\nValor do anunciante: ${taxUser * quantidade}`)

    this.setState({endpointMP: data})
  }

  
  //ve quantos usuarios ja foram pagos e quando o processo estiver terminado ele apaga o produto do carrinho e joga para a tela inicial
  _onNavigationStateChange(webViewState){
    if(webViewState.url.includes('https://www.mercadopago.com/mp.php')) {
      let valueIncrement = this.state.valueIncrement;
      this.setState({valueIncrement: valueIncrement + 1})

      if(valueIncrement == this.state.accTK.length && this.state.accTK.length >= 1) {
        Alert.alert("Atenção", "Parabéns! O pagamento foi aprovado!", [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate('Home'),
            style: "cancel"
          },
          { text: "Voltar para tela inicial", onPress: () => this.props.navigation.navigate('Home')}
        ]);
      } 
      
      if(valueIncrement !== this.state.accTK.length && this.state.accTK.length > 1){
        alert('Redirecionando você para pagar o próximo usuário')
        this.mercadoPago()
      }

      if(valueIncrement !== this.state.accTK.length && this.state.accTK.length >= 1){
        alert('Redirecionando você para pagar o próximo usuário')
        this.mercadoPago()
      }

      if(valueIncrement == this.state.accTK.length && this.state.accTK.length > 1) {
        Alert.alert("Atenção", "Parabéns! O pagamento foi aprovado!", [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate('Home'),
            style: "cancel"
          },
          { text: "Voltar para tela inicial", onPress: () => this.props.navigation.navigate('Home')}
        ]);
      } 
    }
  }



  mercadoPago() {
    this.setState({brCodeValue:'loaded'});
    for(var x = 0; x <= this.state.accTK.length; x++) {
      
      if(x == this.state.valueIncrement) {
          let value = this.state.accTK[x].value;
          let newNumber = new Number(value);
          
          let percentToWeWo = ((newNumber / 100) * 15).toFixed(2);
          let percentToWeWoNumberInt = new Number(percentToWeWo);
      
          let percentToUser = ((newNumber / 100) * 85).toFixed(2);
          let percentToUserNumberInt = new Number(percentToUser);
      
          let percentToUser2 = ((newNumber / 100) * 100).toFixed(2);
          let percentToUserNumberInt2 = new Number(percentToUser2);
    
          let qtd = this.state.accTK[x].qtd;
          fetch('https://api.mercadopago.com/checkout/preferences', {
            method:'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.state.accTK[x].accTK}`
            },
            body: JSON.stringify({
              items: [
                {
                  title:"Pagamento de Serviço WeWo",
                  quantity: this.state.accTK[x].qtd,
                  currency_id:"BRL",
                  unit_price: percentToUserNumberInt2,
                  picture_url: this.state.accTK[x].img
                }
              ],
              marketplace_fee: percentToWeWoNumberInt,
              back_urls: {
                success: "https://www.mercadopago.com/mp.php"
              },
              payment_methods: {
                excluded_payment_methods: [
                  {
                    id: 'pix'
                  }
                ]
              }
            })
            })
            .then((res) => res.json())
            .then((json) => this.mpTaxAndPayment(json.init_point, percentToWeWoNumberInt, percentToUserNumberInt, percentToUserNumberInt2, qtd))
            .catch((i) => alert('Erro ao requisitar o mercado pago: ' + i))
            
            console.log(`QTD: ${this.state.accTK[x].qtd} \n\nACCESSTOKEN: ${this.state.accTK[x].accTK} \n\nFoto: ${this.state.accTK[x].img} \n\nValor: ${this.state.accTK[x].value} \n\nIDDONO ANUNCIO: ${this.state.accTK[x].idDonoDoProduto}`)
        } 
      }

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
              <TouchableOpacity style={{marginTop: windowHeight/4}} onPress={() => this.mercadoPago()}>
                <Image source={require('../../../assets/PAYWOLOGO.png')} style={{width:248, height:166}}/>
              </TouchableOpacity>
              <TextDescription2 style={{paddingHorizontal:60, marginTop:10, fontSize:10, textAlign:'center'}}>(Conta Mercado Pago, Cartão de Crédito ou Débito, Pix, Boleto, Cartão Virtual Caixa, Lotérica e PayPal)</TextDescription2>
          </View>
        :
          <WebView 
            source={{ uri: endpointMP }} 
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            />
        }

      </SafeBackground>
    );
  }
}
