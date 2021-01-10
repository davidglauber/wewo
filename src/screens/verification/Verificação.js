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
//import * as Google from 'expo-google-app-auth';

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
    };
    this.signInWithFacebook = this.signInWithFacebook.bind(this);
  }

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  componentDidMount() {
    let getNome = this.props.route.params.nome;
    let getEmail = this.props.route.params.email;
    let getSenha = this.props.route.params.senha;
    let getTelefone = this.props.route.params.telefone;
    let getDataNascimento = this.props.route.params.dataNascimento;


    this.setState({nome: getNome})
    this.setState({email: getEmail})
    this.setState({senha: getSenha})
    this.setState({telefone: getTelefone})
    this.setState({data: getDataNascimento})


    console.log('email navigation: ' + getEmail)
    console.log('senha navigation: ' + getSenha)
    console.log('nome navigation: ' + getNome)
    console.log('Telefone navigation: ' + getTelefone)
    console.log('Data born navigation: ' + getDataNascimento)
    
  }

  navigateTo = (screen) => {
    const {navigation} = this.props;
    navigation.navigate(screen, {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha,
      telefone: this.state.telefone,
      dataNascimento: this.state.data
    });
  };



  /*
  async signInWithGoogle() {
    let e = this;

    try {
      const {accessToken, idToken, type} = await Google.logInAsync({
        androidClientId: '739877707204-kgh0qk400a0gjk6bad9evgak7ooeoi7f.apps.googleusercontent.com',
        androidStandaloneAppClientId: '739877707204-7s37emv4f00qbqo7brdo2of0cb6ld8pf.apps.googleusercontent.com',
        webClientId: '739877707204-g6egqrbsrdu1i5kplap8i5b993kisoh6.apps.googleusercontent.com',
        iosClientId: '739877707204-6sduc8aq9ggi6d411lhtfi62rne5gvtc.apps.googleusercontent.com',
        iosStandaloneAppClientId: '739877707204-qu6p135qctdnqj3ceq3oum5ohjdillhr.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (type === 'success') {
        var credential =   
        await firebase
          .auth
          .GoogleAuthProvider
          .credential(idToken, accessToken);



        await firebase.auth().signInWithCredential(credential).then((result) =>{
          var user = firebase.auth().currentUser;
              firebase.firestore().collection('usuarios').doc(user.uid).set({
                email: result.user.email,
                nome: e.state.nome,
                premium: false,
                dataNascimento: e.state.data,
                telefone: e.state.telefone
              })
            AsyncStorage.setItem('emailUserSaved', result.user.email)
            this.props.navigation.navigate('HomeNavigator')

            alert('Você foi cadastrado com sucesso 👍')
        }).catch((err) => {
          console.log('erro: ' + err)
        })
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return console.log('ERRO NO GOOGLE: '  + e)
    }
  }

  */

  async signInWithFacebook() {
    let e = this;
    
    await Facebook.initializeAsync('654536232159341', 'WeWo');
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
                      telefone: e.state.telefone
                    })
                  AsyncStorage.setItem('emailUserSaved', result.user.email)
                  this.props.navigation.navigate('HomeNavigator')
                  alert('Você foi cadastrado com sucesso 👍')
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
            
          <TouchableOpacity onPress={() => {}}>
              <FontAwesome5 name="google" size={35} style={{marginRight:25}} color="#DAA520"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.signInWithFacebook()}>
              <FontAwesome5 name="facebook" size={35} style={{marginRight:15}} color="#DAA520"/>
          </TouchableOpacity>
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
