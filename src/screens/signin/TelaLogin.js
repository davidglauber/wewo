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
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView
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

import AlertPro from "react-native-alert-pro";

//import icons
import { FontAwesome5 } from '@expo/vector-icons';

//IMPORT APPLE LOGIN 
import * as AppleAuthentication from 'expo-apple-authentication';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    justifyContent: 'space-between'
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
    marginTop: Platform.OS === "ios" ? windowHeight/10 : windowHeight/3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {color: "#DAA520", marginBottom: Platform.OS === "ios" ? windowHeight/30 : 0},
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
  inputLogin: {
    padding: 20,
    marginBottom: 30,
    borderRadius: 30,
    borderWidth: 1, 
    borderColor: "#DAA520",
    minWidth: windowWidth/2.5
  }
});

export default class TelaLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: [],
      loggedIn: false,
      emailUser: '',
      senhaUser: '',
      viewPass: true
    };
  }



  async componentDidMount() {
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


  nav(boolean) {
    this.AlertPro5.close();
    if(boolean == true) {
      this.props.navigation.navigate('TelaLoginSMS')
    } else {
      this.props.navigation.navigate('SignUp')
    }
  }

  confirmIfUserHasBeenSignUp() {
    this.AlertPro5.open();
  }

  
  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      this.setState({loggedIn: true});

        var credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

        await firebase.auth().signInWithCredential(credential).then(() =>{
            this.props.navigation.navigate('Home')
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
            this.props.navigation.navigate('Home')
            this.AlertPro4.open();
          }).catch(error => {
              console.log(error);
          });

    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  async loginWithCredentialsApple(cred) {
    await firebase.auth().signInWithCredential(cred)
      this.props.navigation.navigate('Home')
      this.AlertPro4.open();
  }


  emailChange = text => {
    this.setState({
      emailUser: text,
    });

    console.log('email user: ' + this.state.emailUser)
  };

  senhaChange = text => {
    this.setState({
      senhaUser: text,
    });

    console.log('email user: ' + this.state.senhaUser)
  };


  async loginWithEmailAndPassApple(email, password) {
    let e = this
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        e.props.navigation.navigate("Home")
      })
    } catch (e) {
      if(e.code === "auth/invalid-email") {
        alert("Parece que o endereço de email não é válido!")
      }

      if(e.code === "auth/user-disabled") {
        alert("Parece que esse usuário foi desativado!")
      }

      if(e.code === "auth/user-not-found") {
        alert("O usuário em questão não foi encontrado no banco de dados!")
      }

      if(e.code === "auth/wrong-password") {
        alert("A senha não é a mesma cadastrada!")
      }
    }
  }

  render() {
    const e = this;

    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <View style={{flex:1, backgroundColor:'white'}}>
          <AlertPro
            ref={ref => {
              this.AlertPro = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro.close()}
            title="Aviso!!!"
            message="Caso você não tenha se cadastrado ainda no aplicativo vá para tela de cadastro, caso sim, continue o login"
            textConfirm="Entendi"
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

          <AlertPro
            ref={ref => {
              this.AlertPro5 = ref;
            }}
            onCancel={() => this.nav(false)}
            onConfirm={() => this.nav(true)}
            title="Aviso!!!"
            message="Você se cadastrou? Senão o fez, o processo de login dará errado!"
            textConfirm="Sim, já me cadastrei"
            textCancel="Vou me cadastrar"
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
            backgroundColor="white"
            barStyle="dark-content"
          />


          <View style={styles.container}>
          <View style={styles.instructionContainer}>
              <Heading5 style={styles.heading}>Login</Heading5>
              
              {Platform.OS === "ios" ?
                null
                :
                <Paragraph style={styles.instruction}>
                  Escolha como irá logar na sua conta
                </Paragraph>
              }

          </View>


          <View style={{flexDirection:'row', marginBottom: windowHeight/3.3}}>

            {Platform.OS === "ios" ?
                null
              :
                null
            }

            {Platform.OS === 'ios' ? 
              <View style={{maxWidth: windowWidth/2}}>
                <TextInput
                  style={styles.inputLogin}
                  onChangeText={this.emailChange}
                  value={this.state.emailUser}
                  placeholder="Digite seu email"
                  keyboardType="default"
                />

              <View style={{flexDirection: "row"}}>
                <TextInput
                  style={styles.inputLogin}
                  onChangeText={this.senhaChange}
                  value={this.state.senhaUser}
                  placeholder="Digite sua senha"
                  secureTextEntry={this.state.viewPass}
                  keyboardType="default"
                />

                {this.state.viewPass == false ?
                  <TouchableOpacity onPress={() => this.setState({viewPass: true})}>
                    <FontAwesome5 name="eye" size={25} style={{marginLeft:15, marginTop: 20}} color="#DAA250"/>
                  </TouchableOpacity>
                :
                  <TouchableOpacity onPress={() => this.setState({viewPass: false})}>
                    <FontAwesome5 name="eye-slash" size={25} style={{marginLeft:15, marginTop: 20}} color="#DAA250"/>
                  </TouchableOpacity>
                }
              </View>


                  <TouchableOpacity
                    onPress={() => this.loginWithEmailAndPassApple(this.state.emailUser, this.state.senhaUser)}
                    style={{backgroundColor:'#d98b0d', width:200, borderRadius:30, height:50, flexDirection:'row', alignItems:'center'}}
                  >
                    <FontAwesome5 name="plus-circle" size={25} style={{marginLeft:15}} color="#fff"/>
                    <Text style={{fontWeight:'bold', marginLeft:15, textAlign:'center', fontSize:20, color:'white'}}>Logar</Text>
                  </TouchableOpacity>
              </View>
              /*
                <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={10}
                style={{ width: 44, height: 44 }}
                onPress={async () => {
                  try {
                    const credential = await AppleAuthentication.signInAsync({
                      requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                      ],
                    });
                    
                    const authCredential = new firebase.auth.OAuthProvider(
                      "apple.com"
                      ).credential({
                        idToken: credential.identityToken
                      })
                      
                      await firebase.firestore().collection('usuarios').where('idAppleOnlyIOS', '==', credential.user).get().then(function(querySnapshot) {
                        let idsAvailable = []
                        querySnapshot.forEach(function(doc) {
                          idsAvailable.push({
                            idAppleOnlyIOS: doc.data().idAppleOnlyIOS
                          })
                        })
                        
                        if(idsAvailable.length == 1) {
                          //garante que o usuario apple ja se registrou, se sim, ele faz login sucesso
                          try {
                            e.loginWithCredentialsApple(authCredential)
                          } catch (e) {
                            console.log('ERRO: ' + e)
                          }
                        }
                        
                        if(idsAvailable == 0) {
                          //nesse caso o usuario nao foi encontrado no banco de dados e sera obrigado a se cadastrar
                          alert('Parece que você ainda não se cadastrou, se cadastre e em seguida faça login')
                        }
                      })
                      // signed in
                    } catch (e) {
                      if (e.code === 'ERR_CANCELED') {
                        alert('Cancelado pelo usuario')
                        // handle that the user canceled the sign-in flow
                      } if (e.code === 'ERR_APPLE_AUTHENTICATION_INVALID_SCOPE') {
                        alert('Escopo incorreto')
                      } if (e.code === 'ERR_APPLE_AUTHENTICATION_UNAVAILABLE') {
                        alert('Apple Login Indisponivel')
                      } if (e.code === 'ERR_APPLE_AUTHENTICATION_REQUEST_FAILED') {
                        alert('Falha de pesquisa')
                      }
                    }
                  }}
                  />
                */
                  :
                <View style={{maxWidth: windowWidth/2}}>
                  <TextInput
                    style={styles.inputLogin}
                    onChangeText={this.emailChange}
                    value={this.state.emailUser}
                    placeholder="Digite seu email"
                    keyboardType="default"
                  />

                <View style={{flexDirection: "row"}}>
                  <TextInput
                    style={styles.inputLogin}
                    onChangeText={this.senhaChange}
                    value={this.state.senhaUser}
                    placeholder="Digite sua senha"
                    secureTextEntry={this.state.viewPass}
                    keyboardType="default"
                  />

                  {this.state.viewPass == false ?
                    <TouchableOpacity onPress={() => this.setState({viewPass: true})}>
                      <FontAwesome5 name="eye" size={25} style={{marginLeft:15, marginTop: 20}} color="#DAA250"/>
                    </TouchableOpacity>
                  :
                    <TouchableOpacity onPress={() => this.setState({viewPass: false})}>
                      <FontAwesome5 name="eye-slash" size={25} style={{marginLeft:15, marginTop: 20}} color="#DAA250"/>
                    </TouchableOpacity>
                  }
                </View>


                  <TouchableOpacity
                    onPress={() => this.loginWithEmailAndPassApple(this.state.emailUser, this.state.senhaUser)}
                    style={{backgroundColor:'#d98b0d', width:200, borderRadius:30, height:50, flexDirection:'row', alignItems:'center'}}
                  >
                    <FontAwesome5 name="plus-circle" size={25} style={{marginLeft:15}} color="#fff"/>
                    <Text style={{fontWeight:'bold', marginLeft:15, textAlign:'center', fontSize:20, color:'white'}}>Logar</Text>
                  </TouchableOpacity>
                </View>
            }


            {Platform.OS === "ios" ?
                null
              :
                null
            }
          </View>

              <View style={{position:"absolute", bottom: windowHeight/29}}>
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
        </View>
      </KeyboardAvoidingView>
    );
  }
}
