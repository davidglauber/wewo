/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import node modules
import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  Modal,
  View,
  Text,
  Dimensions,
  LogBox
} from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

import {Subtitle2} from '../../components/text/CustomText';
import { Modalize } from 'react-native-modalize';
import Layout from '../../theme/layout';

//import firebase
import firebase from '../../config/firebase';

//import image picker
import * as ImagePicker from 'expo-image-picker';

//import Constants
import Constants from 'expo-constants';

//import Permissions
import * as Permissions from 'expo-permissions';

import {Heading6} from '../../components/text/CustomText';

import { PulseIndicator } from 'react-native-indicators';

// import components
import { FontAwesome5 } from '@expo/vector-icons';


import { ItemContainer, ViewTopForm, SafeBackgroundPublish, IconResponsive, IconResponsiveNOBACK, PublishTouchable, CategoryAndSub, TextDays, TitleChangeColor, InputFormMask, InputForm, SafeViewPublish, Subtitle2Publish, ViewCircle, ChooseOption } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';


import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//import datepicker
import DateTimePicker from '@react-native-community/datetimepicker';

//import IAP API 
import {purchased} from '../../config/purchase';


//locationSERVICES
import * as Location from 'expo-location';


// import colors
import Colors from '../../theme/colors';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// OrdersB Styles
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  productsContainer: {
    paddingVertical: 8,
  },
  circleMask: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#efefef',
  },
  leftCircle: {
    left: -9,
  },
  rightCircle: {
    right: -9,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#efefef',
  },
  itemContainer: {
    marginVertical: 4,
    backgroundColor: Colors.background,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 36,
  },

  inputStyle: {
    borderBottomWidth:0.5,

  }
});

// OrdersB
export default class TelaCriarCartaoVisita extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);

    this.state = {
      type: 'Estabelecimento',
      categorias: [],
      categoria:'',
      horarioOpen:'',
      horarioClose:'',
      phoneAuto:'',
      phoneEstab:'',
      nomeAuto:'',
      tituloEstab:'',
      descricaoAuto:'',
      descricaoEstab:'',
      enderecoEstab:'',
      enderecoAuto:'',
      cepEstab: '',
      precoEstab:'',
      cepAuto: '',
      enderecoCepEstab: [],
      enderecoCepAuto: [],
      UFEstab: '',
      UFAuto:'',
      segunda:'',
      terca:'', 
      quarta:'',
      quinta:'',
      sexta:'',
      sabado:'',
      domingo:'',
      modalizeRef: React.createRef(null),
      modalizeRefDescription: React.createRef(null),
      modalizeRefDescriptionEstab: React.createRef(null),
      modalizeRefSub: React.createRef(null),
      modalizeRefAbertura: React.createRef(null),
      modalizeRefFechamento: React.createRef(null),
      modalizePhotos: React.createRef(null),
      modalizeVideoAndPhoto: React.createRef(null),
      modalizeLocationEstab: React.createRef(null),
      modalizeLocationAuto: React.createRef(null),
      image:null,
      image2:null,
      image3:null,
      video:null,
      showHour: false,
      showHourClose: false,
      hour: new Date(),
      hourClose: new Date(),
      imageName:'',
      animated: true,
      modalVisible: false,
      currentDate: new Date(),
      date: '',
      subcategorias:[],
      subcategoria:'',
      usuarioComprou: false,
      arrayWordsAuto: [],
      arrayWordsEstab: [],
      daysWeek: [],
      locationServiceEnabled: false
    };
  }


  convertDate() {
    let day = this.state.currentDate.getDate();
    let month = this.state.currentDate.getMonth() + 1;
    let year = this.state.currentDate.getFullYear();
    let fullDate = day + '/' + month + '/' + year;

    this.setState({date: fullDate});
  }


  async componentDidMount() {
    this.convertDate();
    let e = this;

    if(Platform.OS === "android") {
      let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual');
      this.setState({usuarioComprou: comprou});
    }


    //getting categories
    await firebase.firestore().collection('categorias').get().then(function(querySnapshot) {
      let categoriaDidMount = []
      querySnapshot.forEach(function(doc) {
        categoriaDidMount.push({
          id: doc.data().id,
          title: doc.data().title
        })
      })
      e.setState({categorias: categoriaDidMount})
    })

    console.log('state de categorias: ' + this.state.categorias)

  }


  async getSubCategoryFromFirebase(id, title) {
    let e = this;
    
    //getting subcategories
    await firebase.firestore().collection('categorias').doc(id).collection(title).get().then(function(querySnapshot){
      let subcategoriasDidMount = [];
      querySnapshot.forEach(function(doc) {
        subcategoriasDidMount.push({
          id: doc.data().id,
          title: doc.data().title
        })
        console.log('SUBCATEGORIA:' + doc.data().title)
      })
      e.setState({subcategorias: subcategoriasDidMount})
    })
    console.log('state de SUBcategorias: ' + this.state.subcategorias)
    console.log('SUBcategoria obtida: ' + title)

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




  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  keyExtractor = item => item.orderNumber.toString();

  onChangePhoneAuto(text) {
    this.setState({phoneAuto: text})
    console.log('auto phone: '  + this.state.phoneAuto)
  }

  onChangePhoneEstab(text) {
    this.setState({phoneEstab: text})
    console.log('estab phone: '  + this.state.phoneEstab)
  }



  onChangeTituloEstab(text) {
    this.setState({tituloEstab: text})

    this.state.arrayWordsEstab.push(text)
    console.log('title estab'  + this.state.tituloEstab)
    console.log('array de palavras: '  + this.state.arrayWordsEstab)
  }

  onChangeDescricaoAuto(text) {
    this.setState({descricaoAuto: text})
    console.log('descricao auto'  + this.state.descricaoAuto)
  }

  onChangeDescricaoEstab(text) {
    this.setState({descricaoEstab: text})
    console.log('descricao estab'  + this.state.descricaoEstab)
  }

  onChangeNomeAuto(text) {
    this.setState({nomeAuto: text})

    this.state.arrayWordsAuto.push(text)
    console.log('nome auto'  + this.state.nomeAuto)
    console.log('array de palavras: '  + this.state.arrayWordsAuto)
  }

  onChangeEnderecoEstab(text) {
    this.setState({enderecoEstab: text})
    console.log('endereco estab'  + this.state.enderecoEstab)
  }

  onChangeEnderecoAuto(text) {
    this.setState({enderecoAuto: text})
    console.log('endereco estab'  + this.state.enderecoAuto)
  }

  onChangeCEPEstab(text) {
    this.setState({cepEstab: text})
    console.log('cepEstab'  + this.state.cepEstab)
  }

  onChangeCEPAuto(text) {
    this.setState({cepAuto: text})
    console.log('cepAuto'  + this.state.cepAuto)
  }

  onChangePrecoEstab(text) {
    this.setState({precoEstab: text})
  }

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  openModalizeSubCategoria() {
    const modalizeRefSub = this.state.modalizeRefSub;

    modalizeRefSub.current?.open()
  }


  openModalizeDescricao() {
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.open()
  }

  openModalizeDescricaoEstab() {
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.open()
  }



  openModalizeAbertura() {
    const modalizeRefAbertura = this.state.modalizeRefAbertura;

    modalizeRefAbertura.current?.open()
  }

  openModalizeFechamento() {
    const modalizeRefFechamento = this.state.modalizeRefFechamento;

    modalizeRefFechamento.current?.open()
  }

  openModalizePhotos() {
    const modalizePhotos = this.state.modalizePhotos;

    modalizePhotos.current?.open()
  }



  openModalizePhotosAndVideos() {
    const modalizeVideoAndPhoto = this.state.modalizeVideoAndPhoto;

    modalizeVideoAndPhoto.current?.open()
  }



  openModalizeLocationEstab() {
    const modalizeLocationEstab = this.state.modalizeLocationEstab;

    modalizeLocationEstab.current?.open()
  }


  openModalizeLocationAuto() {
    const modalizeLocationAuto = this.state.modalizeLocationAuto;

    modalizeLocationAuto.current?.open()
  }


  closeDescriptionModal(){
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.close()
  }

  closeDescriptionEstabModal(){
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.close()
  }



  getCategory(id, param) {
    const modalizeRef = this.state.modalizeRef;
    this.setState({categoria: param})
    modalizeRef.current?.close()

    this.getSubCategoryFromFirebase(id, param)
    this.openModalizeSubCategoria()

    console.log('Categoria Selecionada: '  + param)
  }

  getSubCategory(param) {
    const modalizeRefSub = this.state.modalizeRefSub;
    this.setState({subcategoria: param})
    modalizeRefSub.current?.close()

    console.log('SUBCATEGORIA Selecionada: '  + param)
  }

  getHorarioOpen(param) {
    const modalizeRefAbertura = this.state.modalizeRefAbertura;
    this.setState({horarioOpen: param})
    modalizeRefAbertura.current?.close()

    console.log('Horario open Selecionado: '  + param)

  }

  getHorarioClose(param) {
    const modalizeRefFechamento = this.state.modalizeRefFechamento;
    this.setState({horarioClose: param})
    modalizeRefFechamento.current?.close()

    console.log('Horario close Selecionado: '  + param)
  }


  onChange = (event, selectedHour) => {
    this.setState({showHour: false})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    this.setState({horarioOpen: completeTime})
    console.log('hora selecionada: ' + completeTime)
    
  };

  onChangeClose = (event, selectedHour) => {
    this.setState({showHourClose: false})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    this.setState({horarioClose: completeTime})
    console.log('hora selecionada: ' + completeTime)
    
  };

  
  async CheckIfLocationEnabled() {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'O serviço de localização não está ativado',
        'Por favor ative o serviço de localização para continuar',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      this.setState({locationServiceEnabled: enabled});
    }
  };


  async GetCurrentLocation(type){
    let { status } = await Location.requestPermissionsAsync();

    this.setModalVisible(true)

    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada pelo usuário',
        'Permita o app usar o serviço de localização',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  
    let { coords } = await Location.getCurrentPositionAsync();
  
    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
  
      for (let item of response) {
        let address = `${item.region}, ${item.subregion}, ${item.district}, ${item.street} (${item.postalCode})`;
  
        
        if(type == 'Autonomo') {
          this.setState({enderecoAuto: address})
          this.searchCEPAuto(item.postalCode.replace('-', ''))
        }

        if(type == 'Estabelecimento') {
          this.setState({enderecoEstab: address})
          this.searchCEPEstab(item.postalCode.replace('-', ''))
        }
      }
      this.setModalVisible(false)
    }
  };




  async imagePickerGetPhoto() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Desculpa, nós precisamos do acesso a permissão da câmera');
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
        this.setState({ image: result.uri })
        this.setState({imageName: result.uri})
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }

  }


  async imagePickerGetPhoto2() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Desculpa, nós precisamos do acesso a permissão da câmera');
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
        this.setState({ image2: result.uri })
        this.setState({imageName: result.uri})
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }

  }


  async imagePickerGetPhoto3() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Desculpa, nós precisamos do acesso a permissão da câmera');
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
        this.setState({ image3: result.uri })
        this.setState({imageName: result.uri})
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }

  }


  async getVideo() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Desculpa, nós precisamos do acesso a permissão da câmera');
      }
    }

    
    try {
      alert('Escolha um vídeo de até 15 segundos')

      this.sleep(2000).then(async () => { 
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
          this.setState({ video: result.uri })
          console.log(result);
        }
      })


    } catch (E) {
      console.log(E);
    }

  }


  setVideoAndPhotoOrJustPhoto() {
    Alert.alert("Atenção", "Deseja adicionar um vídeo no seu anúncio?", [
      {
          text: "Não",
          onPress: () => this.openModalizePhotos(),
          style: "cancel"
      },
      { text: "Sim", onPress: () => this.openModalizePhotosAndVideos() }
    ]);
  }
  

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



  uploadFormToFirebase(typePublish) {
    let segunda = this.state.segunda;
    let terca = this.state.terca;
    let quarta = this.state.quarta;
    let quinta = this.state.quinta;
    let sexta = this.state.sexta;
    let sabado = this.state.sabado;
    let domingo = this.state.domingo;
    let e = this;

    let publishId = e.makeid(17);
    let getSameIdToDocument = '';
        getSameIdToDocument = publishId;

    let imageId = e.makeid(17);
    let imageId2 = e.makeid(17);
    let imageId3 = e.makeid(17);
    let userUID = firebase.auth().currentUser.uid;
    let storageUrl = userUID;
    let type = this.state.type;
    let imageIdStorageState = '';
    let imageIdStorageState2 = '';
    let imageIdStorageState3 = '';

      var getFileBlob = async function (url, cb) { 
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.responseType = "blob";
          xhr.addEventListener('load', function() {
            cb(xhr.response);
          });
          xhr.send();
      }
      
      if(typePublish === 'Estabelecimento') {
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.phoneEstab !== '' && this.state.enderecoEstab !== '' && this.state.precoEstab !== '') {
        this.setModalVisible(true)

        if(this.state.video !== null){
        getFileBlob(this.state.video, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              console.log('O vídeo foi salvo no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);



              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.phoneEstab !== '' && this.state.enderecoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioOpen !== '' && this.state.horarioClose !== '' && this.state.categoria !== '' && this.state.video !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.phoneAuto !== '' && this.state.categoria !== '' && this.state.enderecoAuto !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
                                })
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                            
                          }
            
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
                      })
                    })
                })
              })
          })
        })

      } else {
        getFileBlob(this.state.image, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);



              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.phoneEstab !== '' && this.state.enderecoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioOpen !== '' && this.state.horarioClose !== '' && this.state.categoria !== '' && this.state.image !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.phoneAuto !== '' && this.state.categoria !== '' && this.state.enderecoAuto !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
                                })
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                            
                          }
            
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
                      })
                    })
                })
              })
          })
        })
      }

      } else {
        alert('Por favor, verifique se TODOS os campos estão preenchidos (incluindo 3 imagens)')
      }

    }


    if(typePublish === 'Autonomo') {
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.nomeAuto !== '' && this.state.descricaoAuto !== '' && this.state.phoneAuto !== '') {
        this.setModalVisible(true)


        if(this.state.video !== null){
        getFileBlob(this.state.video, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              console.log('O vídeo foi salvo no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);



              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.phoneEstab !== '' && this.state.enderecoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioOpen !== '' && this.state.horarioClose !== '' && this.state.categoria !== '' && this.state.video !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.phoneAuto !== '' && this.state.categoria !== '' &&this.state.enderecoAuto !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
                                })
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                            
                          }
            
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
                      })
                    })
                })
              })
          })
        })

      } else {
        getFileBlob(this.state.image, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);



              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.phoneEstab !== '' && this.state.enderecoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioOpen !== '' && this.state.horarioClose !== '' && this.state.categoria !== '' && this.state.image !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        UFEstab: e.state.UFEstab,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: getSameIdToDocument,
                                        publishData: e.state.date,
                                        media: 0,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        type: 'Estabelecimento',
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberEstab: e.state.phoneEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioOpen,
                                        timeClose: e.state.horarioClose
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.phoneAuto !== '' && this.state.categoria !== '' &&this.state.enderecoAuto !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                          
                                      firebase.firestore().collection('cartoes').doc(getSameIdToDocument).set({
                                        idCartao: getSameIdToDocument,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        UFAuto: e.state.UFAuto,
                                        localAuto: e.state.enderecoAuto,
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        phoneNumberAuto: e.state.phoneAuto,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                      }).catch(function(error) {
                                        console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                      })
                                    })
                                  })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
                                })
                            } else {
                              alert('Todos os campos devem ser preenchidos!')
                            }
                            
                          }
            
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
                      })
                    })
                })
              })
          })
        })
      }

      } else {
        alert('Por favor, verifique se TODOS os campos estão preenchidos (incluindo 3 imagens)')
      }
    }
  }


  
  searchCEPEstab() {
    fetch(`https://viacep.com.br/ws/${this.state.cepEstab}/json`).then(resposta => resposta.json()).then(obj =>  this.setState({enderecoCepEstab: obj})).catch(err => alert('O CEP pode estar errado ou não existir!'))
  }

  searchCEPAuto() {
    fetch(`https://viacep.com.br/ws/${this.state.cepAuto}/json`).then(resposta => resposta.json()).then(obj =>  this.setState({enderecoCepAuto: obj})).catch(err => alert('O CEP pode estar errado ou não existir!'))
  }


  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(12, Height);
  }

  addingDaysOfWeek(day) {

    if(day == 'segunda') {
      this.setState({segunda: day})
    }
    if(day == 'terça') {
      this.setState({terca: day})
    }
    if(day == 'quarta') {
      this.setState({quarta: day})
    }
    if(day == 'quinta') {
      this.setState({quinta: day})
    }
    if(day == 'sexta') {
      this.setState({sexta: day})
    }
    if(day == 'sábado') {
      this.setState({sabado: day})
    }
    if(day == 'domingo') {
      this.setState({domingo: day})
    }

    this.state.daysWeek.push(day)
  }


  render() {
    const { categorias, categoria } = this.state
    return (
      <Fragment>
        <SafeAreaView style={styles.topArea} />
        <SafeBackgroundPublish>
          <StatusBar
            backgroundColor={this.context.dark ? '#121212' : 'white'}
            barStyle={this.context.dark ? "light-content" : "dark-content"}
          />

          <SafeViewPublish>
            <ViewTopForm>
              
            <View style={{ width: Layout.SCREEN_WIDTH - 2 * 12}}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding: 16}}>
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
                        
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          { this.state.type == 'Estabelecimento' ?
                            <View style={{flexDirection:'row'}}>
                                <ChooseOption/>
                                <TouchableOpacity>
                                    <Subtitle2Publish
                                      style={{fontWeight: 'bold'}}>Estabelecimento</Subtitle2Publish>
                                </TouchableOpacity>
                            </View>
                          :
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => this.setState({type: 'Estabelecimento'})} style={{backgroundColor:'#E3E3E3', width:18, height:18, borderRadius:30}}/>
                                  <TouchableOpacity onPress={() => this.setState({type: 'Estabelecimento'})}>
                                      <Subtitle2Publish>Estabelecimento</Subtitle2Publish>
                                  </TouchableOpacity>
                            </View>                         
                          }
                        </View>


                        {this.state.image == null ?
                          <View>
                            <TouchableOpacity onPress={() => this.setVideoAndPhotoOrJustPhoto()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                                <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                            </TouchableOpacity>
                          </View> 
                          :
                          <View>
                            <TouchableOpacity onPress={() => this.setVideoAndPhotoOrJustPhoto()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                                <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}} source={{uri: this.state.image2}}/>
                            </TouchableOpacity>
                          </View>
                        }

                        {this.state.type == 'Estabelecimento' ?
                        <View>
                          <TouchableOpacity onPress={() => this.openModalizeLocationEstab()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                              <FontAwesome5 name="map-marker-alt" size={24} color={'#9A9A9A'}/>
                          </TouchableOpacity>
                        </View> 
                        
                        :

                        <View>
                          <TouchableOpacity onPress={() => this.openModalizeLocationAuto()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                            <FontAwesome5 name="map-marker-alt" size={24} color={'#9A9A9A'}/>
                          </TouchableOpacity>
                        </View>
                        }
              </View>

                     {this.state.type == 'Autonomo' ?     
                      <View style={{flexDirection:'row', padding: 16}}>
                              <ChooseOption/>
                                  <TouchableOpacity>
                                      <Subtitle2Publish
                                        style={{fontWeight: 'bold'}}>Autônomo</Subtitle2Publish>
                                  </TouchableOpacity>
                      </View>
                      :
                      <View style={{flexDirection:'row', padding: 16}}>
                              <TouchableOpacity onPress={() => this.setState({type: 'Autonomo'})} style={{backgroundColor:'#E3E3E3', width:18, height:18, borderRadius:30}}/>
                              <TouchableOpacity onPress={() => this.setState({type: 'Autonomo'})}>
                                  <Subtitle2Publish>Autônomo</Subtitle2Publish>
                              </TouchableOpacity>
                      </View>
                     }
                    </View>



                    {/*Divisor estiloso*/}
                    <View style={{ flex: 1,  flexDirection: 'row',  justifyContent: 'space-between',alignItems: 'center'}}>
                      <ViewCircle style={styles.leftCircle} />
                      <View style={styles.dividerLine} />
                      <ViewCircle style={styles.rightCircle} />
                    </View>



                    <ItemContainer>

                      { this.state.type == 'Autonomo' &&
                        <View>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                value={this.state.nomeAuto}
                                onChangeText={text => this.onChangeNomeAuto(text)}
                                autoCapitalize={'words'}
                                maxLength={20}
                                placeholder="Digite seu Nome                                                                       "
                              />
                          </View>

                          <TouchableOpacity onPress={() => this.openModalizeLocationAuto()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                value={this.state.enderecoAuto}
                                onChangeText={text => this.onChangeEnderecoAuto(text)}
                                keyboardType={"default"}
                                editable={false}
                                placeholder="Endereço do Autônomo                                                   "
                              />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.openModalizeDescricao()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                editable={false}
                                value={this.state.descricaoAuto}
                                onChangeText={text => this.onChangeDescricaoAuto(text)}
                                placeholder="Dê a melhor descrição das suas habilidades, detalhe-as                                                    "
                              />
                          </TouchableOpacity>

                          <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputFormMask
                                type={'cel-phone'}
                                keyboardType={"phone-pad"}
                                maxLength={17}
                                value={this.state.phoneAuto}
                                onChangeText={text => this.onChangePhoneAuto(text)}
                                placeholder="Número de Telefone                                                   "
                              />
                          </View>
                          <View style={{flexDirection:'row', paddingTop:50, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>                          
                            <View style={{marginRight:70}}>
                              <TouchableOpacity onPress={() => this.openModalize()} style={{justifyContent:'center', alignItems:'center', flexDirection:'row', marginLeft:8, marginRight:5, borderRadius:10}}>
                                {this.state.subcategoria == '' ?
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <IconResponsiveNOBACK name="align-left" size={24}/>
                                    <TitleChangeColor style={{ marginLeft:10, fontWeight:'bold'}}>Categoria</TitleChangeColor>
                                </View>
                                :
                                <View style={{flexDirection:'row', alignItems:'center', marginLeft:50}}>
                                    <IconResponsiveNOBACK name="align-left" size={24}/>
                                    <TitleChangeColor style={{ marginLeft:10, fontWeight:'bold'}}>Selecionada ;)</TitleChangeColor>
                                </View>
                                }
                              </TouchableOpacity>
                            </View>
                            
                            {this.state.categoria !== '' ?
                              <PublishTouchable onPress={() => this.uploadFormToFirebase('Autonomo')} style={{marginRight:50}}>
                                <Text style={{color:'#fff', fontWeight:'bold', paddingTop:5, paddingLeft:20}}>
                                  Publicar
                                </Text>
                              </PublishTouchable>
                              :
                              <PublishTouchable onPress={() => this.uploadFormToFirebase('Autonomo')}>
                                <Text style={{color:'#fff', fontWeight:'bold', paddingTop:5, paddingLeft:20}}>
                                  Publicar
                                </Text>
                              </PublishTouchable>
                            }
                        </View>
                      </View>
                      }
                        {this.state.type == 'Estabelecimento' &&
                          <View>
                            <View style={styles.item}>
                              <InputForm
                                value={this.state.tituloEstab}
                                onChangeText={text => this.onChangeTituloEstab(text)}
                                maxLength={20}
                                placeholder="Nome do Produto (até 20 caracteres)                                                        "
                              />
                            </View>

                            <TouchableOpacity onPress={() => this.openModalizeDescricaoEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                editable={false}
                                value={this.state.descricaoEstab}
                                onChangeText={text => this.onChangeDescricaoEstab(text)}
                                placeholder="Descrição do seu produto... capriche ;)                                                   "
                              />
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputFormMask
                                type={'money'}
                                value={this.state.precoEstab}
                                onChangeText={text => this.onChangePrecoEstab(text)}
                                keyboardType={"number-pad"}
                                placeholder="Valor do Produto                                                          "
                              />
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputFormMask
                                type={'cel-phone'}
                                keyboardType={"phone-pad"}
                                maxLength={17}
                                value={this.state.phoneEstab}
                                onChangeText={text => this.onChangePhoneEstab(text)}
                                placeholder="Número de Telefone                                                   "
                              />
                            </View>
                          
                            <TouchableOpacity onPress={() => this.openModalizeLocationEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                <InputForm
                                  value={this.state.enderecoEstab}
                                  onChangeText={text => this.onChangeEnderecoEstab(text)}
                                  keyboardType={"default"}
                                  editable={false}
                                  placeholder="Endereço do Estabelecimento                                                   "
                                />
                            </TouchableOpacity>

                            <View>

                            <View style={{flexDirection:'row'}}>
                                
                                { this.state.segunda == '' ?
                                    <View style={{flexDirection:'row'}}>
                                      <TouchableOpacity onPress={() => this.addingDaysOfWeek('segunda')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                      <TextDays>Seg</TextDays>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                      <ChooseOption onPress={() => this.setState({segunda: ''})} style={{marginLeft:15, marginTop:20}}/>
                                      <TextDays>Seg</TextDays>
                                    </View>
                                }

                                { this.state.terca == '' ?
                                    <View style={{flexDirection:'row'}}>
                                      <TouchableOpacity onPress={() => this.addingDaysOfWeek('terça')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                      <TextDays>Ter</TextDays>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                      <ChooseOption onPress={() => this.setState({terca: ''})} style={{marginLeft:15, marginTop:20}}/>
                                      <TextDays>Ter</TextDays>
                                    </View>
                                }


                                { this.state.quarta == '' ?
                                    <View style={{flexDirection:'row'}}>
                                      <TouchableOpacity onPress={() => this.addingDaysOfWeek('quarta')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                      <TextDays>Qua</TextDays>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                      <ChooseOption onPress={() => this.setState({quarta: ''})} style={{marginLeft:15, marginTop:20}}/>
                                      <TextDays>Qua</TextDays>
                                    </View>
                                }
                              </View>

                              <View style={{flexDirection:'row'}}>
                                { this.state.quinta == '' ?
                                  <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity onPress={() => this.addingDaysOfWeek('quinta')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                    <TextDays>Qui</TextDays>
                                  </View>

                                :
                                  <View style={{flexDirection:'row'}}>
                                    <ChooseOption onPress={() => this.setState({quinta: ''})} style={{marginLeft:15, marginTop:20}}/>
                                    <TextDays>Qui</TextDays>
                                  </View>
                                }

                                { this.state.sexta == '' ?
                                    <View style={{flexDirection:'row'}}>
                                        <TouchableOpacity onPress={() => this.addingDaysOfWeek('sexta')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                        <TextDays>Sex</TextDays>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        <ChooseOption onPress={() => this.setState({sexta: ''})} style={{marginLeft:15, marginTop:20}}/>
                                        <TextDays>Sex</TextDays>
                                    </View>
                                }


                                { this.state.sabado == '' ?
                                    <View style={{flexDirection:'row'}}>
                                        <TouchableOpacity onPress={() => this.addingDaysOfWeek('sábado')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                        <TextDays>Sáb</TextDays>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        <ChooseOption onPress={() => this.setState({sabado: ''})} style={{marginLeft:15, marginTop:20}}/>
                                        <TextDays>Sáb</TextDays>
                                    </View>
                                }
                              </View>

                            <View style={{flexDirection:'row'}}>
                                { this.state.domingo == '' ?
                                  <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity onPress={() => this.addingDaysOfWeek('domingo')} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                                    <TextDays>Dom</TextDays>
                                  </View>
                                  :
                                  <View style={{flexDirection:'row'}}>
                                    <ChooseOption onPress={() => this.setState({domingo: ''})} style={{marginLeft:15, marginTop:20}}/>
                                    <TextDays>Dom</TextDays>
                                  </View>
                                }
                            </View>

                            <View style={{flexDirection:'row'}}>
                              <View>
                                <TitleChangeColor style={{fontWeight:'bold', paddingLeft: 15, marginTop:20, fontSize: this.responsibleFont()}}>Horário de Abertura</TitleChangeColor>
                                  <View style={{marginLeft:14, width: 130, height:30}}>
                                  <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginTop:4}} onPress={() => this.setState({showHour: true})}> 
                                        <IconResponsiveNOBACK name="clock" size={24}/>
                                        {this.state.horarioOpen == '' ? 
                                          <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Abertura</Text> 
                                        : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioOpen}</Text> 
                                        }
                                  </TouchableOpacity>
                                  </View>
                              </View>

                                <View>
                                  <TitleChangeColor style={{fontWeight:'bold', paddingLeft: 35, marginTop:20, fontSize: this.responsibleFont()}}>Horário de Fechamento</TitleChangeColor>
                                    <View style={{marginLeft:44, width: 130, height:30}}>
                                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginTop:4}} onPress={() => this.setState({showHourClose: true})}> 
                                          <IconResponsiveNOBACK name="stopwatch" size={24}/>
                                          {this.state.horarioClose == '' ?
                                            <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Fechamento</Text>
                                          : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioClose}</Text>
                                          }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                              
                            </View>

                            {this.state.showHour == true &&
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={this.state.hour}
                                    mode='time'
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.onChange}
                                    style={{width: 320, backgroundColor: "white"}}
                                />
                            }

                            {this.state.showHourClose == true &&
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={this.state.hourClose}
                                    mode='time'
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.onChangeClose}
                                    style={{width: 320, backgroundColor: "white"}}
                                />
                            }

                            <View style={{flexDirection:'row', paddingTop:50, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>                          
                            <View style={{marginRight:70}}>
                              <TouchableOpacity onPress={() => this.openModalize()} style={{justifyContent:'center', alignItems:'center', flexDirection:'row', marginLeft:8, marginRight:5, borderRadius:10}}>
                                {this.state.subcategoria == '' ?
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <IconResponsiveNOBACK name="align-left" size={24}/>
                                    <TitleChangeColor style={{ marginLeft:10, fontWeight:'bold'}}>Categoria</TitleChangeColor>
                                </View>
                                :
                                <View style={{flexDirection:'row', alignItems:'center', marginLeft:50}}>
                                    <IconResponsiveNOBACK name="align-left" size={24}/>
                                    <TitleChangeColor style={{ marginLeft:10, fontWeight:'bold'}}>Selecionada ;)</TitleChangeColor>
                                </View>
                                }
                              </TouchableOpacity>
                            </View>
                            
                            {this.state.categoria !== '' ?
                              <PublishTouchable onPress={() => this.uploadFormToFirebase('Estabelecimento')} style={{marginRight:50}}>
                                <Text style={{color:'#fff', fontWeight:'bold', paddingTop:5, paddingLeft:20}}>
                                  Publicar
                                </Text>
                              </PublishTouchable>
                              :
                              <PublishTouchable onPress={() => this.uploadFormToFirebase('Estabelecimento')}>
                                <Text style={{color:'#fff', fontWeight:'bold', paddingTop:5, paddingLeft:20}}>
                                  Publicar
                                </Text>
                              </PublishTouchable>
                            }
                            </View>
                          </View>

                        }

                    </ItemContainer>

            </ViewTopForm>
          </SafeViewPublish>

          {/*Modalize da categoria*/}
          <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'flex-start', marginTop:40}}>
            <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Selecione a Categoria Desejada</Heading6>
              {categorias.map(l => (
                <View>
                  <TouchableOpacity key={this.makeid(10)} onPress={() => this.getCategory(l.id, l.title)}>
                      <CategoryAndSub>{l.title}</CategoryAndSub>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Modalize>

            {/*Modalize do CEP Estabelecimento*/}
            <Modalize
              ref={this.state.modalizeLocationEstab}
              snapPoint={400}
              modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{flex:1,alignItems:'center', flexDirection:'column'}}>
                <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, color:'#fff'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000'}}>Localização</Text>
                
                {this.state.enderecoEstab == null ?
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>Nenhum endereço encontrado</Text>
                :
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>{this.state.enderecoEstab}</Text>  
                }
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this.GetCurrentLocation('Estabelecimento')} style={{alignItems:'center', justifyContent:'center', marginTop:10, marginRight:15, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="search-location" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({enderecoEstab: null})} style={{alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="times-circle" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>
                </View>
            </View>
                 

            <View>
              <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#fff', textAlign:'center'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000', textAlign:'center'}}>Por favor, verifique se as informações conferem, caso não, pesquise o endereço novamente</Text>
            </View>
          </Modalize>



          {/*Modalize da subcategoria*/}
          <Modalize
            ref={this.state.modalizeRefSub}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'flex-start', marginTop:40}}>
            <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Selecione a SubCategoria Desejada</Heading6>
              {this.state.subcategorias.map(l => (
                <View>
                  <TouchableOpacity key={this.makeid(10)} onPress={() => this.getSubCategory(l.title)}>
                      <CategoryAndSub>{l.title}</CategoryAndSub>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Modalize>

          {/*Modalize da descrição Autonomo*/}
          <Modalize
            ref={this.state.modalizeRefDescription}
            snapPoint={500}
          >
            <View>
                  <ScrollView>
                      <TextInput
                        autoFocus={true}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        value={this.state.descricaoAuto}
                        onChangeText={text => this.onChangeDescricaoAuto(text)}
                        style={{padding: 20}}
                        placeholder="Dê a melhor descrição das suas habilidades, detalhe-as"
                      />

                      <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                          onPress={() => this.closeDescriptionModal()}
                          style={{borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor:'#DAA520', height: 40, width: 40, marginBottom:40}}
                        >
                          <FontAwesome5 name="check-circle" size={24} color={'white'}/>
                        </TouchableOpacity>
                      </View>

                  </ScrollView>
                  
            </View>
          </Modalize>


          {/*Modalize das fotos*/}
          <Modalize
            ref={this.state.modalizePhotos}
            snapPoint={500}
          >
            <View style={{flex:1,alignItems:'center'}}>
                <Text style={{fontWeight: 'bold', padding:15}}>Escolha 3 Fotos</Text>  
              
              <View style={{flexDirection:'row'}}>
                {this.state.image == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7}}>
                        <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7}}>
                        <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20}} source={{uri: this.state.image}}/>
                    </TouchableOpacity>
                  </View>
                }


                {this.state.image2 == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto2()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto2()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20}} source={{uri: this.state.image2}}/>
                    </TouchableOpacity>
                  </View>
                }


                {this.state.image3 == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto3()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto3()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20}} source={{uri: this.state.image3}}/>
                    </TouchableOpacity>
                  </View>
                }
              </View>

            </View>
          </Modalize>







           {/*Modalize do video e fotos*/}
           <Modalize
            ref={this.state.modalizeVideoAndPhoto}
            snapPoint={500}
            >
            <View style={{flex:1,alignItems:'center'}}>
                <Text style={{fontWeight: 'bold', padding:15}}>Escolha 1 Vídeo e 2 Fotos</Text>  

              <View style={{flexDirection:'row'}}>
                {this.state.video == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.getVideo()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7}}>
                        <FontAwesome5 name="video" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.getVideo()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7}}>
                        <FontAwesome5 name="video" size={24} color={'#DAA520'}/>
                    </TouchableOpacity>
                  </View>
                }


                {this.state.image2 == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto2()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto2()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20}} source={{uri: this.state.image2}}/>
                    </TouchableOpacity>
                  </View>
                }


                {this.state.image3 == null ?
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto3()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <FontAwesome5 name="camera-retro" size={24} color={'#9A9A9A'}/>
                    </TouchableOpacity>
                  </View> 
                  :
                  <View>
                    <TouchableOpacity onPress={() => this.imagePickerGetPhoto3()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20, marginTop:7, marginLeft:15}}>
                        <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:60, height:60, borderRadius:20}} source={{uri: this.state.image3}}/>
                    </TouchableOpacity>
                  </View>
                }

              </View>

            </View>
          </Modalize>

          {/*Modalize da descrição Estabelecimento*/}
          <Modalize
            ref={this.state.modalizeRefDescriptionEstab}
            snapPoint={500}
          >
            <View>
                  <ScrollView>
                      <TextInput
                        autoFocus={true}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        value={this.state.descricaoEstab}
                        onChangeText={text => this.onChangeDescricaoEstab(text)}
                        style={{padding: 20}}
                        placeholder="Dê a melhor descrição do seu negócio"
                      />

                      <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                          onPress={() => this.closeDescriptionEstabModal()}
                          style={{borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor:'#DAA520', height: 40, width: 40, marginBottom:40}}
                        >
                          <FontAwesome5 name="check-circle" size={24} color={'white'}/>
                        </TouchableOpacity>
                      </View>

                  </ScrollView>
                  
            </View>
          </Modalize>



          {/*Modalize do horario de abertura*/}
          <Modalize
            ref={this.state.modalizeRefAbertura}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'flex-start', marginTop:40}}>
            <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Selecione o Horário de Abertura</Heading6>
                <View>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('1:00')}>
                      <CategoryAndSub>1:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('2:00')}>
                      <CategoryAndSub>2:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('3:00')}>
                      <CategoryAndSub>3:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('4:00')}>
                      <CategoryAndSub>4:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('5:00')}>
                      <CategoryAndSub>5:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('6:00')}>
                      <CategoryAndSub>6:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('7:00')}>
                      <CategoryAndSub>7:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('8:00')}>
                      <CategoryAndSub>8:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('9:00')}>
                      <CategoryAndSub>9:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('10:00')}>
                      <CategoryAndSub>10:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('11:00')}>
                      <CategoryAndSub>11:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('12:00')}>
                      <CategoryAndSub>12:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('13:00')}>
                      <CategoryAndSub>13:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('14:00')}>
                      <CategoryAndSub>14:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('15:00')}>
                      <CategoryAndSub>15:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('16:00')}>
                      <CategoryAndSub>16:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('17:00')}>
                      <CategoryAndSub>17:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('18:00')}>
                      <CategoryAndSub>18:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('19:00')}>
                      <CategoryAndSub>19:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('20:00')}>
                      <CategoryAndSub>20:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('21:00')}>
                      <CategoryAndSub>21:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('22:00')}>
                      <CategoryAndSub>22:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('23:00')}>
                      <CategoryAndSub>23:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioOpen('00:00')}>
                      <CategoryAndSub>00:00</CategoryAndSub>
                  </TouchableOpacity>
                </View>
            </View>
          </Modalize>




           {/*Modalize do horario de FECHAMENTO*/}
           <Modalize
            ref={this.state.modalizeRefFechamento}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'flex-start', marginTop:40}}>
            <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Selecione o Horário de Fechamento</Heading6>
                <View>

                  <TouchableOpacity onPress={() => this.getHorarioClose('1:00')}>
                      <CategoryAndSub>1:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('2:00')}>
                      <CategoryAndSub>2:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('3:00')}>
                      <CategoryAndSub>3:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('4:00')}>
                      <CategoryAndSub>4:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('5:00')}>
                      <CategoryAndSub>5:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('6:00')}>
                      <CategoryAndSub>6:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('7:00')}>
                      <CategoryAndSub>7:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('8:00')}>
                      <CategoryAndSub>8:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('9:00')}>
                      <CategoryAndSub>9:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('10:00')}>
                      <CategoryAndSub>10:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('11:00')}>
                      <CategoryAndSub>11:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('12:00')}>
                      <CategoryAndSub>12:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('13:00')}>
                      <CategoryAndSub>13:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('14:00')}>
                      <CategoryAndSub>14:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('15:00')}>
                      <CategoryAndSub>15:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('16:00')}>
                      <CategoryAndSub>16:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('17:00')}>
                      <CategoryAndSub>17:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('18:00')}>
                      <CategoryAndSub>18:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('19:00')}>
                      <CategoryAndSub>19:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('20:00')}>
                      <CategoryAndSub>20:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('21:00')}>
                      <CategoryAndSub>21:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('22:00')}>
                      <CategoryAndSub>22:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('23:00')}>
                      <CategoryAndSub>23:00</CategoryAndSub>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getHorarioClose('00:00')}>
                      <CategoryAndSub>00:00</CategoryAndSub>
                  </TouchableOpacity>
                </View>
            </View>
          </Modalize>
        </SafeBackgroundPublish>
      </Fragment>
    );
  }
}
