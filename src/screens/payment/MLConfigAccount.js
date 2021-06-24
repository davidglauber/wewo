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

import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import { WebView } from 'react-native-webview'

import LottieView from 'lottie-react-native';

import AlertPro from "react-native-alert-pro";



const thumbsUp = require('../../../assets/thumbsup.json');


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
      modalizeRef: React.createRef(null),
      webviewBoolean: false,
      accessTokenMP: "",
      name: "",
      phone: "",
      fotoPerfil: "",
      dateBorn: "",
      email: "",
      premium: null,
      textPortfolio: "",
      idMercadoPago: "",
      tipoDeConta: "",
      mesCriacaoToken: new Date(),
      mesCriacaoTokenFirebase: null,
      mesAtual: new Date(),
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  

  
  async componentDidMount() {
    let e = this
    let currentUser = firebase.auth().currentUser.uid;
    this.setState({mesCriacaoToken: this.state.mesCriacaoToken.getMonth() + 1});
    this.setState({mesAtual: this.state.mesAtual.getMonth() + 1});

    await firebase.firestore().collection('usuarios').doc(currentUser).onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data());
      this.setState({name: documentSnapshot.data().nome})
      this.setState({phone: documentSnapshot.data().telefone})
      this.setState({fotoPerfil: documentSnapshot.data().photoProfile})
      this.setState({email: documentSnapshot.data().email})
      this.setState({dateBorn: documentSnapshot.data().dataNascimento})
      this.setState({premium: documentSnapshot.data().premium})
      this.setState({textPortfolio: documentSnapshot.data().textPortfolio})
      this.setState({tipoDeConta: documentSnapshot.data().tipoDeConta})

      if(documentSnapshot.data().mesCriacaoToken) {
        this.setState({mesCriacaoTokenFirebase: documentSnapshot.data().mesCriacaoToken})
      }

      if(documentSnapshot.data().idMP) {
        this.setState({idMercadoPago: documentSnapshot.data().idMP})
      }

      let subtracao = this.state.mesAtual - documentSnapshot.data().mesCriacaoToken;

      if(subtracao >= 5) {
        firebase.firestore().collection('usuarios').doc(currentUser).update({
           idMP: firebase.firestore.FieldValue.delete(),
           accessTK: firebase.firestore.FieldValue.delete()
        })
      }
    })


  }
  

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  mercadoPago() {
    this.AlertPro.open();
    this.setState({webviewBoolean: true})
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

  async firebaseSetIDMP(json, webPage) {
    let e = this;
    let currentUser = firebase.auth().currentUser.uid;
     
    console.log('JSON DO CLIENTE: ' + JSON.stringify(json))
    await firebase.firestore().collection('usuarios').doc(currentUser).set({
      dataNascimento: e.state.dateBorn,
      email: e.state.email,
      nome: e.state.name,
      photoProfile: e.state.fotoPerfil,
      premium: e.state.premium,
      telefone: e.state.phone,
      textPortfolio: e.state.textPortfolio,
      idMP: json.user_id,
      accessTK: json.access_token,
      mesCriacaoToken: e.state.mesCriacaoToken,
      tipoDeConta: e.state.tipoDeConta
    }).then(() => {
      if(webPage.includes('https://www.mercadopago.com/mp.php?code=')){
        this.setState({webviewBoolean: false})
      }
    })

  }

  _onNavigationStateChange(webViewState){
    if(webViewState.url.includes('https://www.mercadopago.com/mp.php')) {
      let removeUrl = webViewState.url.replace('https://www.mercadopago.com/mp.php?code=', '');
      this.setState({accessTokenMP: removeUrl})
      
      fetch('https://api.mercadopago.com/oauth/token', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_secret: "APP_USR-6750007878892152-042620-c064296b7bfe5933f09885a0254c5dec-749886689",
          grant_type:"authorization_code",
          code: this.state.accessTokenMP,
          redirect_uri:"https://www.mercadopago.com/mp.php",
          refresh_token: this.state.accessTokenMP
        })
      })
      .then((res) => res.json())
      .then((json) => this.firebaseSetIDMP(json, webViewState.url)) 
      .catch(() => alert('erro ao autenticar usuário mercado pago, tente novamente'))
      
    }
  }


  render() {
    return (
      <SafeBackground>

          <AlertPro
            ref={ref => {
              this.AlertPro = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro.close()}
            title="Tudo certo"
            message="Você está sendo redirecionado para página de autorização"
            textConfirm="OK"
            customStyles={{
              mask: {
                backgroundColor: "black"
              },
              container: {
                borderWidth: 1,
                borderColor: "#d98b0d",
                shadowColor: "#000000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                borderRadius:30
              },
              buttonCancel: {
                backgroundColor: "#3f3f3f"
              },
              buttonConfirm: {
                backgroundColor: "#ffa31a"
              }
            }}
          />


        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        {this.state.webviewBoolean == false && this.state.idMercadoPago == "" &&
            <View style={{alignItems:'center'}}>
                <Heading style={styles.paddingTitle}>Conectar Conta Mercado Pago</Heading>
                <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Para que você consiga realizar transações pelos seus serviços e produtos, é necessário que você conecte a sua conta mercado pago para fazermos os repasses necessários.</TextDescription2>
                <TouchableOpacity style={{marginTop:40}} onPress={() => this.mercadoPago()}>
                    <Image source={require('../../../assets/MPlogo.png')} style={{width:248, height:64}}/>
                </TouchableOpacity>
            </View>

        } 

        {this.state.webviewBoolean == true &&
          <WebView 
          source={{ uri: 'https://auth.mercadopago.com.br/authorization?client_id=6750007878892152&response_type=code&platform_id=mp&redirect_uri=https://www.mercadopago.com/mp.php' }} 
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}  
          />
        }

        {this.state.webviewBoolean == false && this.state.idMercadoPago !== "" &&
            <View style={{alignItems:'center'}}>
              <TouchableOpacity style={{position:'absolute', left: windowWidth/15, top: windowHeight/25}} onPress={() => this.props.navigation.navigate('Home')}>
                <IconResponsiveNOBACK name="arrow-left" size={24}/>
              </TouchableOpacity>
              <Heading style={styles.paddingTitle}>Parabéns</Heading>
              <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Tudo certo, a sua conta Mercado Pago já está conectada com o WeWo</TextDescription2>
              <LottieView source={thumbsUp} style={{width:200, height:200, marginTop: windowHeight / 12}} autoPlay loop />
            </View>
        }

      </SafeBackground>
    );
  }
}
