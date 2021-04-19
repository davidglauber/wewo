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
      textPortfolio: ""
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  

  
  async componentDidMount() {
    let currentUser = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('usuarios').doc(currentUser).onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data());
      this.setState({name: documentSnapshot.data().nome})
      this.setState({phone: documentSnapshot.data().telefone})
      this.setState({fotoPerfil: documentSnapshot.data().photoProfile})
      this.setState({email: documentSnapshot.data().email})
      this.setState({dateBorn: documentSnapshot.data().dataNascimento})
      this.setState({premium: documentSnapshot.data().premium})
      this.setState({textPortfolio: documentSnapshot.data().textPortfolio})
    })
  }
  

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  mercadoPago() {
    alert('Você está sendo redirecionado para página de autorização')
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

  firebaseSetIDMP(json) {
    let e = this;
    let currentUser = firebase.auth().currentUser.uid;
    firebase.firestore().collection('usuarios').doc(currentUser).set({
      dataNascimento: e.state.dateBorn,
      email: e.state.email,
      nome: e.state.name,
      photoProfile: e.state.fotoPerfil,
      premium: e.state.premium,
      telefone: e.state.phone,
      textPortfolio: e.state.textPortfolio,
      idMP: json.user_id
    })
  }

  _onNavigationStateChange(webViewState){
    let removeUrl = webViewState.url.replace('https://www.mercadopago.com/mp.php?code=', '');
    this.setState({accessTokenMP: removeUrl})
    this.setState({webviewBoolean: false})

    fetch('https://api.mercadopago.com/oauth/token', {
        method:'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_secret: "APP_USR-4801354026747963-040711-bd3c57cc909703918b030e1eeaa28c66-188576751",
          grant_type:"authorization_code",
          code: this.state.accessTokenMP,
          redirect_uri:"https://www.mercadopago.com/mp.php"
        })
      })
      .then((res) => res.json())
      .then((json) => this.firebaseSetIDMP(json)) 
      .catch(() => alert('erro ao autenticar usuário mercado pago, tente novamente'))
  }


  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        {this.state.webviewBoolean == false ?
            <View style={{alignItems:'center'}}>
                <Heading style={styles.paddingTitle}>Conectar Conta Mercado Pago</Heading>
                <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Para que você consiga realizar transações pelos seus serviços e produtos, é necessário que você conecte a sua conta mercado pago para fazermos os repasses necessários.</TextDescription2>
                <TouchableOpacity style={{marginTop:40}} onPress={() => this.mercadoPago()}>
                    <Image source={require('../../../assets/MPlogo.png')} style={{width:248, height:64}}/>
                </TouchableOpacity>
            </View>

          :
          <WebView 
            source={{ uri: 'https://auth.mercadopago.com.br/authorization?client_id=4801354026747963&response_type=code&platform_id=mp&redirect_uri=https://www.mercadopago.com/mp.php' }} 
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
                <Text>HI</Text>
            </View>
          </Modalize>

      </SafeBackground>
    );
  }
}
