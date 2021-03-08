/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// import components
import {Heading5, Paragraph} from '../../components/text/CustomText';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

//import firebase 
import firebase from '../../config/firebase';


//import Google API
import {GoogleSignin, statusCodes} from 'react-native-google-signin';

//import Facebook API
import * as Facebook from 'expo-facebook';

//import icons
import { FontAwesome5 } from '@expo/vector-icons';

// SignInB Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

// SignInB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainerStyle: {flex: 1},
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  buttonContainer: {
    paddingTop: 23,
  },
  forgotPassword: {
    paddingVertical: 23,
  },
  forgotPasswordText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.white,
    textAlign: 'center',
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: INPUT_BORDER_COLOR,
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: Dimensions.get('window').width,
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: '#DAA520',
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    color:'#DAA520',
    alignItems: 'center',
  },
});

export default class TelaLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: [],
      loggedIn: false
    };
  }



  async componentDidMount() {
    alert('Caso você não tenha se cadastrado ainda no aplicativo vá para tela de login, caso sim, continue o login')
    
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId: '419527216736-39o1vcm2lh5c1nkf6qdvb74dnlshvemu.apps.googleusercontent.com',
    });
  }
  
  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      passwordFocused: false,
    });
  };

  passwordChange = text => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  confirmIfUserHasBeenSignUp() {
    Alert.alert(
      'AVISO',
      'Você se cadastrou? Senão o fez, o processo de login dará errado! ',
      [
        {text: 'Vou me cadastrar', onPress: () => this.props.navigation.navigate('SignUp'), style: 'cancel'},
        {text: 'Sim, já me cadastrei', onPress: () => this.props.navigation.navigate('TelaLoginSMS')}
      ],
      {cancelable: false},
    );
  }

  
  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      this.setState({loggedIn: true});

        var credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

        await firebase.auth().signInWithCredential(credential).then(() =>{
            this.props.navigation.navigate('HomeNavigator')
            alert('Logado com sucesso 👍')
        }).catch((err) => {
          console.log('erro: ' + err)
        })
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Usuário cancelou o login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Login em progresso...');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play Serviços não disponível');
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
            this.props.navigation.navigate('HomeNavigator')
            alert('Logado com sucesso 👍')
          }).catch(error => {
              console.log(error);
          });

    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }


  render() {
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />


        <View style={styles.container}>
        <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Login</Heading5>
            <Paragraph style={styles.instruction}>
              Escolha como irá logar na sua conta
            </Paragraph>
        </View>


        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 100}}>
            
          <TouchableOpacity onPress={() => this.signInWithGoogle()}>
              <FontAwesome5 name="google" size={35} style={{marginRight:25}} color="#DAA520"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.signInWithFacebook()}>
              <FontAwesome5 name="facebook" size={35} style={{marginRight:15}} color="#DAA520"/>
          </TouchableOpacity>
          <View style={{marginBottom: 44, marginLeft: 10}}>
            <Button
              onPress={() => this.confirmIfUserHasBeenSignUp()}
              disabled={false}
              borderRadius={10}
              color="#DAA520"
              small
              title={'SMS'.toUpperCase()}
              titleColor="#fff"
            />
          </View>
        </View>

            <View style={styles.content}>
              <TouchableWithoutFeedback
                onPress={this.navigateTo('TermsConditions')}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Se registrando, você aceita nossos
                  </Text>
                  <View style={styles.termsContainer}>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Termos & Condições
                    </Text>
                    <Text style={styles.footerText}> and </Text>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Política de Privacidade
                    </Text>
                    <Text style={styles.footerText}>.</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
      </View >
    );
  }
}
