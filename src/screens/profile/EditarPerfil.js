/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
  Text
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Icon from '../../components/icon/Icon';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//import image picker
import * as ImagePicker from 'expo-image-picker';

//import Constants
import Constants from 'expo-constants';

//import Permissions
import * as Permissions from 'expo-permissions';

//import firebase
import firebase from '../../config/firebase';

import AlertPro from "react-native-alert-pro";

// import colors
import Colors from '../../theme/colors';

import { ButtonCustomized, SafeBackground, InputForm, InputFormMask, Subtitle2EditProfile } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


// EditProfileA Config
const AVATAR_SIZE = 100;
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// EditProfileA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  whiteCircle: {
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cameraButtonContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
  },
  editForm: {
    paddingHorizontal: 20,
  },
  overline: {
    color: "#fff",
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 17,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    marginTop:windowWidth/2,
    paddingHorizontal: 24,
  },
});

// EditProfileA
export default class EditarPerfil extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameFocused: false,
      phone: '',
      phoneFocused: false,
      fotoPerfil:null,
      modalVisible:false
    };
  }



  async componentDidMount() {
      let userUID = firebase.auth().currentUser.uid;

      await firebase.firestore().collection('usuarios').doc(userUID).onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data());
        this.setState({name: documentSnapshot.data().nome})
        this.setState({phone: documentSnapshot.data().telefone})
        this.setState({fotoPerfil: documentSnapshot.data().photoProfile})
      })
      
      if(userUID == null || userUID == undefined || userUID == ''){
        return null
      }
  }


    makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }


    //sleep function
    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


  async imagePickerGetPhoto() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        this.AlertPro.open();
      }
    }


    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,

      });
      if (!result.cancelled) {
        this.setState({fotoPerfil: result.uri })
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }

  }


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


  updateToFirebase() {
    let e = this;
    let userUID = firebase.auth().currentUser.uid;
    let imageIdStorageState = '';
    let imageId = e.makeid(17)


    var getFileBlob = function (url, cb) { 
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function() {
        cb(xhr.response);
      });
      xhr.send();
    }

    if(this.state.fotoPerfil !== null) {
      getFileBlob(this.state.fotoPerfil, blob => {
        firebase.storage().ref(`${userUID}/images/${imageId}`).put(blob).then((snapshot) => {
            imageIdStorageState = imageId

            firebase.storage().ref(`${userUID}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
              firebase.firestore().collection('usuarios').doc(userUID).update({
                photoProfile: urlImage,
                nome: e.state.name,
                telefone: e.state.phone
              })
            })
            console.log('A imagem foi salva no Storage!');
            console.log('Valor image state: ' + imageIdStorageState);
        }).catch((error) => {
          console.log('IMAGE UPLOAD ERROR: ' + error)
        })
      })
    } else {
      this.AlertPro2.open();
    }



    this.sleep(6000).then(() => { 
      this.props.navigation.navigate('Settings')
    })
  }


  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  nameChange = (text) => {
    this.setState({
      name: text,
    });
  };

  nameFocus = () => {
    this.setState({
      nameFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };

  phoneChange = (text) => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      nameFocused: false,
      emailFocused: false,
      phoneFocused: true,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      name,
      nameFocused,
      email,
      emailFocused,
      phone,
      phoneFocused,
    } = this.state;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <KeyboardAwareScrollView enableOnAndroid>

            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
              >
              <View style={{flex:1, alignItems:'center', paddingLeft: windowWidth / 2, paddingTop: windowHeight / 2, width: 100}}>
                  <LottieView source={loading} style={{width:100, height:100}} autoPlay loop />
              </View>
            </Modal>

            <AlertPro
              ref={ref => {
                this.AlertPro = ref;
              }}
              showCancel={false}
              onConfirm={() => this.AlertPro.close()}
              title="Ops, Algo deu errado!"
              message="Desculpa, nós precisamos do acesso a permissão da câmera"
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

            <AlertPro
              ref={ref => {
                this.AlertPro2 = ref;
              }}
              showCancel={false}
              onConfirm={() => this.AlertPro2.close()}
              title="Aviso"
              message="Por favor, selecione uma imagem para o perfil"
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

            {this.state.fotoPerfil == null ?
            <View style={styles.avatarSection}>
              <View>
                <Image
                  source={require('../../assets/img/profile_1.jpeg')}
                  style={{borderRadius:50, width:100, height:100}}
                />

                <View style={styles.whiteCircle}>
                  <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto()}>
                      <View style={styles.cameraButton}>
                        <Icon 
                          name={CAMERA_ICON}
                          size={20}
                          color={Colors.onPrimaryColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
              </View>
            : 
              <View style={styles.avatarSection}>
                <Image
                  source={{uri: this.state.fotoPerfil}}
                  style={{borderRadius:50, width:100, height:100}}
                />

                <View style={styles.whiteCircle}>
                  <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto()}>
                      <View style={styles.cameraButton}>
                        <Icon 
                          name={CAMERA_ICON}
                          size={20}
                          color={Colors.onPrimaryColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }

          <View style={styles.editForm}>
            <Subtitle2EditProfile>Nome</Subtitle2EditProfile>

            <InputForm
              value={name}
              style={{marginBottom: 20}}
              onChangeText={text => this.nameChange(text)}
              autoCapitalize={'words'}
              maxLength={32}
              placeholder="Digite seu Nome                                                                       "
            />

            <Subtitle2EditProfile>Número de Telefone</Subtitle2EditProfile>
            <InputFormMask
              type={'cel-phone'}
              style={{marginTop:10}}
              value={phone}
              onFocus={this.phoneFocus}
              onChangeText={text => this.phoneChange(text)}
              keyboardType={"phone-pad"}
            />

              <View style={styles.buttonContainer}>
                <ButtonCustomized
                  onPress={() => this.updateToFirebase()}
                  title={'Salvar Mudanças'}
                  height={48}
                  rounded
                />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeBackground>
    );
  }
}
