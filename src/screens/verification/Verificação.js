/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Alert,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  AsyncStorage,
  TouchableOpacity,
  View,
  BackHandler
} from 'react-native';
import Color from 'color';

// import components
import Button from '../../components/buttons/Button';
import {Heading5, Paragraph} from '../../components/text/CustomText';


//import icons
import { FontAwesome5 } from '@expo/vector-icons';


import firebase from '../../config/firebase';

// import colors
import Colors from '../../theme/colors';

//import Google API
import {GoogleSignin, statusCodes} from 'react-native-google-signin';

import AlertPro from "react-native-alert-pro";

//import Facebook API
import * as Facebook from 'expo-facebook';

// VerificationB Config
const isRTL = I18nManager.isRTL;

// VerificationB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    color:'#DAA520',
    alignItems: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {color: "#DAA520"},
  instruction: {
    marginTop: 16,
    paddingHorizontal: 40,
    fontSize: 14,
    color: "#DAA520",
    textAlign: 'center',
    opacity: 0.76,
  },
  codeContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
  },
  digitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 48,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#DAA520",
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: Colors.primaryText,
  },
  buttonContainer: {
    marginBottom: 44,
  },
});

// VerificationB
export default class Verificação extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      pin: '',
      email:'',
      nome:'',
      data:'',
      telefone:'',
      senha:'',
      tipoDeConta: ''
    };
    this.signInWithFacebook = this.signInWithFacebook.bind(this);
  }

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId: '419527216736-39o1vcm2lh5c1nkf6qdvb74dnlshvemu.apps.googleusercontent.com'});

    let getNome = this.props.route.params.nome;
    let getEmail = this.props.route.params.email;
    let getSenha = this.props.route.params.senha;
    let getTelefone = this.props.route.params.telefone;
    let getDataNascimento = this.props.route.params.dataNascimento;
    let getTipoDeConta = this.props.route.params.tipoDeConta;



    this.setState({nome: getNome})
    this.setState({email: getEmail})
    this.setState({senha: getSenha})
    this.setState({telefone: getTelefone})
    this.setState({data: getDataNascimento})
    this.setState({tipoDeConta: getTipoDeConta})

    console.log('email navigation: ' + getEmail)
    console.log('senha navigation: ' + getSenha)
    console.log('nome navigation: ' + getNome)
    console.log('Telefone navigation: ' + getTelefone)
    console.log('Data born navigation: ' + getDataNascimento)
    console.log('TIPO DE CONTA navigation: ' + getTipoDeConta)
  }

  navigateTo = (screen) => {
    const {navigation} = this.props;
    navigation.navigate(screen, {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha,
      telefone: this.state.telefone,
      dataNascimento: this.state.data,
      tipoDeConta: this.state.tipoDeConta
    });
  };



  
  async signInWithGoogle() {
    let e = this;

    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      this.setState({loggedIn: true});

        var credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

        await firebase.auth().signInWithCredential(credential).then((result) =>{
          var user = firebase.auth().currentUser;
              firebase.firestore().collection('usuarios').doc(user.uid).set({
                email: result.user.email,
                nome: e.state.nome,
                premium: false,
                dataNascimento: e.state.data,
                telefone: e.state.telefone,
                tipoDeConta: e.state.tipoDeConta,
                userLocation: ''
              })
            AsyncStorage.setItem('emailUserSaved', result.user.email)
            this.props.navigation.navigate('HomeNavigator')
            this.AlertPro4.open();

        }).catch((err) => {
          console.log('erro: ' + err)
        })
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        this.AlertPro2.open();
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Login em progresso...');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.AlertPro3.open();
        // play services not available or outdated
      } else {
        // some other error happened
        alert('Algum outro erro ocorreu: ' + error)
      }
    }
  }

  

  async signInWithFacebook() {
    let e = this;
    
    await Facebook.initializeAsync({appId:'654536232159341',appName:'WeWo'});
    try {
      const { type, token } = await
        Facebook.logInWithReadPermissionsAsync(
            {
                      permission: ["public_profile", "email", "user_friends"] 
            } 
        );

      if (type === 'success') {
        var credential =   
        await firebase
          .auth
          .FacebookAuthProvider
          .credential(token);
          } else {
            // type === 'cancel'
          }

          await firebase
          .auth().signInWithCredential(credential).then(() => {
            var user = firebase.auth().currentUser;
                    firebase.firestore().collection('usuarios').doc(user.uid).set({
                      email: e.state.email,
                      nome: e.state.nome,
                      premium: false,
                      dataNascimento: e.state.data,
                      telefone: e.state.telefone,
                      tipoDeConta: e.state.tipoDeConta,
                      userLocation: ''
                    })
                  AsyncStorage.setItem('emailUserSaved', result.user.email)
                  this.props.navigation.navigate('HomeNavigator')
                  this.AlertPro4.open();
          }).catch(error => {
              console.log(error);
          });

    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>

        <AlertPro
          ref={ref => {
            this.AlertPro2 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro2.close()}
          title="Erro"
          message="Usuário cancelou o login"
          textConfirm="Fechar"
          customStyles={{
            mask: {
              backgroundColor: "black",
              opacity: 0.9
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

      <AlertPro
          ref={ref => {
            this.AlertPro3 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro3.close()}
          title="Erro"
          message="Google Play Serviços não disponível"
          textConfirm="Fechar"
          customStyles={{
            mask: {
              backgroundColor: "black",
              opacity: 0.9
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


        <AlertPro
          ref={ref => {
            this.AlertPro4 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro4.close()}
          title="Sucesso"
          message="Logado com sucesso"
          textConfirm="OK"
          customStyles={{
            mask: {
              backgroundColor: "black",
              opacity: 0.9
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
          backgroundColor="#fff"
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Confirmação de Cadastro</Heading5>
            <Paragraph style={styles.instruction}>
              Escolha como irá confirmar seu cadastro
            </Paragraph>
          </View>


        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            
          <TouchableOpacity onPress={() => this.signInWithGoogle()}>
              <FontAwesome5 name="google" size={35} style={{marginRight:25}} color="#DAA520"/>
          </TouchableOpacity>


          {Platform.OS === 'ios' ? 
            null 
          :
          <TouchableOpacity onPress={() => this.signInWithFacebook()}>
              <FontAwesome5 name="facebook" size={35} style={{marginRight:15}} color="#DAA520"/>
          </TouchableOpacity>
          }
          <View style={{marginBottom: 44, marginLeft: 10}}>
            <Button
              onPress={() => this.navigateTo('SMSVerificacao')}
              disabled={false}
              borderRadius={4}
              color="#DAA520"
              small
              title={'SMS'.toUpperCase()}
              titleColor="#fff"
            />
          </View>
        </View>

        </View>
      </SafeAreaView>
    );
  }
}
