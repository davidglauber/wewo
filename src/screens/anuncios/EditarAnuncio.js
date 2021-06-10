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
  Alert,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  View,
  Text,
  Platform,
  Dimensions,
  LogBox
} from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

import {Subtitle2} from '../../components/text/CustomText';
import { Modalize } from 'react-native-modalize';
import Layout from '../../theme/layout';

//import firebase
import firebase from '../../config/firebase';


//import datepicker
import DateTimePicker from '@react-native-community/datetimepicker';

//import image picker
import * as ImagePicker from 'expo-image-picker';

//import Constants
import Constants from 'expo-constants';

//import Permissions
import * as Permissions from 'expo-permissions';

import {Heading6} from '../../components/text/CustomText';

import { PulseIndicator } from 'react-native-indicators';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

// import components
import { FontAwesome5 } from '@expo/vector-icons';

import { TextInputMask } from 'react-native-masked-text';

import { ItemContainer, ViewTopForm, SafeBackgroundPublish, IconResponsive, IconResponsiveNOBACK, PublishTouchable, CategoryAndSub, TextDays, TitleChangeColor, InputFormMask, InputForm, SafeViewPublish, Subtitle2Publish, ViewCircle, ChooseOption } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

import AlertPro from "react-native-alert-pro";

//import IAP API 
import {purchased} from '../../config/purchase';

//locationSERVICES
import * as Location from 'expo-location';

import { Video } from 'expo-av';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// import colors
import Colors from '../../theme/colors';

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
export default class EditarAnuncio extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);

    this.state = {
      type: this.props.route.params.type,
      categorias: [],
      categoria:'',
      horarioOpen:'',
      horarioClose:'',
      precoAuto:'',
      precoEstab:'',
      nomeAuto:'',
      tituloAuto:'',
      tituloEstab:'',
      descricaoAuto:'',
      descricaoEstab:'',
      enderecoEstab:null,
      enderecoAuto:null,
      cepEstab: '',
      cepAuto: '',
      enderecoCepEstab: [],
      enderecoCepAuto: [],
      arrayWordsAuto: [],
      arrayWordsEstab: [],
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
      modalizePhotos: React.createRef(null),
      modalizeRefValueEstab:  React.createRef(null),
      modalizeRefValueAuto:  React.createRef(null),
      modalizeVideoAndPhoto: React.createRef(null),
      modalizeLocationEstab: React.createRef(null),
      modalizeLocationAuto: React.createRef(null),
      image:null,
      image2:null,
      image3:null,
      video:null,
      imageName:'',
      animated: true,
      modalVisible: false,
      modalLoadVisible: false,
      idAnuncio: '',
      currentDate: new Date(),
      date: '',
      hour: new Date(),
      horarioAbre: '',
      horarioFecha: '',
      showHour: false,
      hourClose: new Date(),
      showHourClose: false,
      hourFocusedClose: false,
      hourFocused: false,
      subcategorias:[],
      subcategoria:'',
      usuarioComprou: false,
      daysWeek: [],
      errorMsg: null,
      locationServiceEnabled: false,
      fotoPerfil: null,
      percentWeWoAuto: 0,
      percentWeWoEstab: 0,
    };
  }


  convertDate() {
    let day = this.state.currentDate.getDate();
    let month = this.state.currentDate.getMonth() + 1;
    let year = this.state.currentDate.getFullYear();
    let fullDate = day + '/' + month + '/' + year;

    this.setState({date: fullDate});
  }


  async CheckIfLocationEnabled() {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      this.AlertPro.open();
    } else {
      this.setState({locationServiceEnabled: enabled});
    }
  };



  async GetCurrentLocation(type){
    let { status } = await Location.requestPermissionsAsync();

    this.setModalVisible(true)

    if (status !== 'granted') {
      this.AlertPro2.open();
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

  async componentDidMount() {
    this.convertDate();
    let e = this;
    let usuarioAtual = firebase.auth().currentUser.uid;

    let comprou = purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto');
    this.setState({usuarioComprou: comprou});

    //pede ao usuario para habilitar os serviços de localização
    this.CheckIfLocationEnabled();

    let routeType = this.props.route.params.type;
    let routeIdAnuncio = this.props.route.params.idAnuncio;
    let userUID = firebase.auth().currentUser.uid;


    this.setModalLoadVisible(true)

    this.sleep(2000).then(() => { 
        this.setModalLoadVisible(false)
    })

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


    if(routeType == 'Autonomo') { 
        this.setState({type: 'Autonomo'})
        await firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').where("idAnuncio", "==", routeIdAnuncio).get().then(function(querySnapshot) {
            let idAnuncio = ''
            let categoria = ''
            let subcategoria = ''
            let descricao = ''
            let idUser = ''
            let nome = ''
            let valor = ''
            let imagem = ''
            let imagem2 = ''
            let imagem3 = ''
            let video = ''
            let titulo = ''
            let type = ''
            let abertura = ''
            let fechamento = ''
            let verificado = false
            let location = ''
            let ufauto = ''
            let arrayAuto = []

            querySnapshot.forEach(function(doc) {
                idAnuncio = doc.data().id,
                titulo = doc.data().titleAuto,
                arrayAuto = doc.data().titleAutoArray,
                categoria = doc.data().categoryAuto,
                subcategoria = doc.data().subcategoryAuto,
                descricao = doc.data().descriptionAuto,
                idUser = doc.data().idUser,
                location = doc.data().localAuto,
                nome = doc.data().nome
                valor = doc.data().valueServiceAuto,
                type = doc.data().type,
                ufauto = doc.data().UFAuto,
                imagem = doc.data().photoPublish,
                imagem2 = doc.data().photoPublish2,
                imagem3 = doc.data().photoPublish3,
                video = doc.data().videoPublish,
                abertura = doc.data().timeOpen,
                fechamento = doc.data().timeClose,
                verificado = false
            })

            e.setState({idAnuncio: idAnuncio})
            e.setState({tituloAuto: titulo})
            e.setState({arrayWordsAuto: arrayAuto})
            e.setState({enderecoAuto: location})
            e.setState({descricaoAuto: descricao})
            e.setState({categoria: categoria})
            e.setState({subcategoria: subcategoria})
            e.setState({precoAuto: valor})
            e.setState({nomeAuto: nome})
            e.setState({type: type})
            e.setState({UFAuto: ufauto})
            e.setState({video: video})
            e.setState({image: imagem})
            e.setState({image2: imagem2})
            e.setState({image3: imagem3})
            e.setState({horarioAbre: abertura})
            e.setState({horarioFecha: fechamento})

            console.log("ARRAY DE NOME PESQUISA: " + arrayAuto)
        })

    }


    if(routeType == 'Estabelecimento') { 
        this.setState({type: 'Estabelecimento'})
        await firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').where("idAnuncio", "==", routeIdAnuncio).get().then(function(querySnapshot) {
            let idAnuncio = ''
            let categoria = ''
            let subcategoria = ''
            let descricao = ''
            let idUser = ''
            let valor = ''
            let imagem = ''
            let imagem2 = ''
            let imagem3 = ''
            let video = ''
            let titulo = ''
            let verificado = false
            let local = ''
            let abertura = ''
            let fechamento = ''
            let workDays = ''
            let type = ''
            let ufestab = ''
            let arrayEstab = []

            querySnapshot.forEach(function(doc) {
                idAnuncio = doc.data().id,
                titulo = doc.data().titleEstab,
                arrayEstab = doc.data().titleEstabArray,
                categoria = doc.data().categoryEstab,
                subcategoria = doc.data().subcategoryEstab,
                descricao = doc.data().descriptionEstab,
                idUser = doc.data().idUser,
                valor = doc.data().valueServiceEstab,
                imagem = doc.data().photoPublish,
                imagem2 = doc.data().photoPublish2,
                imagem3 = doc.data().photoPublish3,
                video = doc.data().videoPublish,
                verificado = false,
                ufestab = doc.data().UFEstab,
                type = doc.data().type,
                local = doc.data().localEstab,
                abertura = doc.data().timeOpen,
                fechamento = doc.data().timeClose,
                workDays = doc.data().workDays
            })

            e.setState({idAnuncio: idAnuncio})
            e.setState({tituloEstab: titulo})
            e.setState({arrayWordsEstab: arrayEstab})
            e.setState({descricaoEstab: descricao})
            e.setState({categoria: categoria})
            e.setState({subcategoria: subcategoria})
            e.setState({precoEstab: valor})
            e.setState({video: video})
            e.setState({image: imagem})
            e.setState({image2: imagem2})
            e.setState({image3: imagem3})
            e.setState({type: type})
            e.setState({UFEstab: ufestab})
            e.setState({enderecoEstab: local})
            e.setState({horarioAbre: abertura})
            e.setState({horarioFecha: fechamento})
            e.setState({workDays: workDays})

            console.log("ARRAY DE NOME PESQUISA: " + arrayEstab)
        })

    }

    console.log('state de categorias: ' + this.state.categorias)
    console.log('id do  anuncio: ' + this.props.route.params.idAnuncio)
    console.log('type do  anuncio: ' + this.props.route.params.type)
    
    
    //pegar a foto do usuario
    await firebase.firestore().collection('usuarios').doc(usuarioAtual).onSnapshot(documentSnapshot => {
      e.setState({fotoPerfil: documentSnapshot.data().photoProfile})
    })

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

  onChangePrecoAuto(text) {
    this.setState({precoAuto: text})
    console.log('preco auto'  + this.state.precoAuto)
  }

  onChangePrecoEstab(text) {
    this.setState({precoEstab: text})
    console.log('preco estab'  + this.state.precoEstab)
  }

  onChangeTituloAuto(text) {
    this.setState({tituloAuto: text})

    //se o campo estiver vazio ele limpa a lista
    if(text == '') {
      this.setState({arrayWordsAuto: []})
    }

    this.state.arrayWordsAuto.push(text)
    console.log('title auto'  + this.state.tituloAuto)
    console.log('array de palavras: '  + this.state.arrayWordsAuto)
  }

  onChangeTituloEstab(text) {
    this.setState({tituloEstab: text})

    //se o campo estiver vazio ele limpa a lista
    if(text == '') {
      this.setState({arrayWordsEstab: []})
    }

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
    console.log('nome auto'  + this.state.nomeAuto)
  }


  onChangeEnderecoEstab(text) {
    this.setState({enderecoEstab: text})
    console.log('endereco estab'  + this.state.enderecoEstab)
  }

  onChangeEnderecoAuto(text) {
    this.setState({enderecoAuto: text})
    console.log('endereco estab'  + this.state.enderecoAuto)
  }

 
  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  openModalizeDescricao() {
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.open()
  }

  openModalizeDescricaoEstab() {
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.open()
  }


  openModalizeValueEstab() {
    const modalizeRefValueEstab = this.state.modalizeRefValueEstab;

    modalizeRefValueEstab.current?.open()
  }

  openModalizeValueAuto() {
    const modalizeRefValueAuto = this.state.modalizeRefValueAuto;

    modalizeRefValueAuto.current?.open()
  }

  openModalizeSubCategoria() {
    const modalizeRefSub = this.state.modalizeRefSub;

    modalizeRefSub.current?.open()
  }



  openModalizePhotos() {
    this.AlertPro5.close();
    const modalizePhotos = this.state.modalizePhotos;

    modalizePhotos.current?.open()
  }


  openModalizePhotosAndVideos() {
    this.AlertPro5.close();
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



  async imagePickerGetPhoto() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        this.AlertPro3.open();
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
        this.AlertPro3.open();
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
        this.AlertPro3.open();
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
        this.AlertPro3.open();
      }
    }

    
    try {
      this.AlertPro4.open();

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
    this.AlertPro5.open();
  }


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setModalLoadVisible = (visible) => {
    this.setState({ modalLoadVisible: visible });
  }



  closeDescriptionModal(){
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.close()
  }

  closeDescriptionEstabModal(){
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.close()
  }


  closePhotosModal(){
    const modalizePhotos = this.state.modalizePhotos;

    modalizePhotos.current?.close()
  }






  uploadFormToFirebase(typePublish) {
    let routeIdAnuncio = this.props.route.params.idAnuncio;
    let e = this;

    

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
      
      if(typePublish === 'Autonomo') { 
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.tituloAuto !== '' && this.state.descricaoAuto !== '' && this.state.precoAuto !== '' && this.state.nomeAuto !== '') {
        
        this.setModalVisible(true)

        if(this.state.video !== null){
          getFileBlob(this.state.video, async blob => {
            await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
                imageIdStorageState = imageId
                e.setState({isPhotoLoaded: true})
                console.log('O vídeo foi salvo no Storage!');
                console.log('Valor image state: ' + imageIdStorageState);
                
  
                getFileBlob(this.state.image2, async blob => {
                  await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                      imageIdStorageState2 = imageId2
                      e.setState({isPhotoLoaded2: true})
                      console.log('A imagem foi salva no Storage!');
                      console.log('Valor image state2: ' + imageIdStorageState2);
                      
  
  
  
  
  
  
  
  
                      getFileBlob(this.state.image3, async blob => {
                        await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                            imageIdStorageState3 = imageId3
                            console.log('A imagem foi salva no Storage!');
                            console.log('Valor image state3: ' + imageIdStorageState3);
                            
              
              
                            if(type == 'Estabelecimento'){
                              if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioAbre !== '' && this.state.horarioFecha !== '' && this.state.categoria !== '' && this.state.video !== null) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                      firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                        firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                          titleEstab: e.state.tituloEstab,
                                          titleEstabArray: e.state.arrayWordsEstab,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          descriptionEstab: e.state.descricaoEstab,
                                          valueServiceEstab: e.state.precoEstab,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Estabelecimento',
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          UFEstab: e.state.UFEstab,
                                          localEstab: e.state.enderecoEstab,
                                          categoryEstab: e.state.categoria,
                                          subcategoryEstab: e.state.subcategoria,
                                          videoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          workDays: e.state.daysWeek,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                            
                                        //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                        firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                          titleEstab: e.state.tituloEstab,
                                          titleEstabArray: e.state.arrayWordsEstab,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          descriptionEstab: e.state.descricaoEstab,
                                          valueServiceEstab: e.state.precoEstab,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Estabelecimento',
                                          UFEstab: e.state.UFEstab,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          localEstab: e.state.enderecoEstab,
                                          categoryEstab: e.state.categoria,
                                          subcategoryEstab: e.state.subcategoria,
                                          videoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          workDays: e.state.daysWeek,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
              
                                      })
              
                                  }).catch(function(error) {
                                    console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                  })
                        
                                })
                        
                                  this.setModalVisible(true)
                        
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaPrincipalAnuncio')
                                })
                        
                              } else {
                                this.AlertPro6.open()
                              }
                            }
                        
                        
                            if(type == 'Autonomo') {
                              if(this.state.tituloAuto !== '' && this.state.descricaoAuto !== '' && this.state.precoAuto !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                      firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                        firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                          titleAuto: e.state.tituloAuto,
                                          titleAutoArray: e.state.arrayWordsAuto,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          nome: e.state.nomeAuto,
                                          descriptionAuto: e.state.descricaoAuto,
                                          valueServiceAuto: e.state.precoAuto,
                                          localAuto: e.state.enderecoAuto,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Autonomo',
                                          UFAuto: e.state.UFAuto,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          categoryAuto: e.state.categoria,
                                          subcategoryAuto: e.state.subcategoria,
                                          workDays: e.state.daysWeek,
                                          videoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                            
                                        //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                        firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                          titleAuto: e.state.tituloAuto,
                                          titleAutoArray: e.state.arrayWordsAuto,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          media: 0,
                                          publishData: e.state.date,
                                          nome: e.state.nomeAuto,
                                          descriptionAuto: e.state.descricaoAuto,
                                          valueServiceAuto: e.state.precoAuto,
                                          localAuto: e.state.enderecoAuto,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Autonomo',
                                          UFAuto: e.state.UFAuto,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          categoryAuto: e.state.categoria,
                                          subcategoryAuto: e.state.subcategoria,
                                          workDays: e.state.daysWeek,
                                          videoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                                      })
                                  }).catch(function(error) {
                                    console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                  })
                                })
                        
                                    this.setModalVisible(true)
                        
                                  this.sleep(5000).then(() => { 
                                    this.props.navigation.navigate('TelaPrincipalAnuncio')
                                  })
                              } else {
                                this.AlertPro6.open()
                              }
                              
              
                            } 
              
                        })
                      })
              
                  })
                })
            })
          })


        } if(this.state.image !== null) {
          getFileBlob(this.state.image, async blob => {
            await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
                imageIdStorageState = imageId
                e.setState({isPhotoLoaded: true})
                console.log('A imagem foi salva no Storage!');
                console.log('Valor image state: ' + imageIdStorageState);
                
  
                getFileBlob(this.state.image2, async blob => {
                  await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                      imageIdStorageState2 = imageId2
                      e.setState({isPhotoLoaded2: true})
                      console.log('A imagem foi salva no Storage!');
                      console.log('Valor image state2: ' + imageIdStorageState2);
                      
  
  
  
  
  
  
  
  
                      getFileBlob(this.state.image3, async blob => {
                        await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                            imageIdStorageState3 = imageId3
                            console.log('A imagem foi salva no Storage!');
                            console.log('Valor image state3: ' + imageIdStorageState3);
                            
              
              
                            if(type == 'Estabelecimento'){
                              if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioFecha !== '' && this.state.horarioAbre !== '' && this.state.categoria !== '' && this.state.image !== null) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                      firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                        firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                          titleEstab: e.state.tituloEstab,
                                          titleEstabArray: e.state.arrayWordsEstab,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          descriptionEstab: e.state.descricaoEstab,
                                          valueServiceEstab: e.state.precoEstab,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Estabelecimento',
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          UFEstab: e.state.UFEstab,
                                          localEstab: e.state.enderecoEstab,
                                          categoryEstab: e.state.categoria,
                                          subcategoryEstab: e.state.subcategoria,
                                          photoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          workDays: e.state.daysWeek,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                            
                                        //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                        firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                          titleEstab: e.state.tituloEstab,
                                          titleEstabArray: e.state.arrayWordsEstab,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          descriptionEstab: e.state.descricaoEstab,
                                          valueServiceEstab: e.state.precoEstab,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Estabelecimento',
                                          UFEstab: e.state.UFEstab,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          localEstab: e.state.enderecoEstab,
                                          categoryEstab: e.state.categoria,
                                          subcategoryEstab: e.state.subcategoria,
                                          photoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          workDays: e.state.daysWeek,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
              
                                      })
              
                                  }).catch(function(error) {
                                    console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                  })
                        
                                })
                        
                                  this.setModalVisible(true)
                        
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaPrincipalAnuncio')
                                })
                        
                              } else {
                                this.AlertPro6.open()
                              }
                            }
                        
                        
                            if(type == 'Autonomo') {
                              if(this.state.tituloAuto !== '' && this.state.descricaoAuto !== '' && this.state.precoAuto !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                      firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                        firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                          titleAuto: e.state.tituloAuto,
                                          titleAutoArray: e.state.arrayWordsAuto,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          nome: e.state.nomeAuto,
                                          descriptionAuto: e.state.descricaoAuto,
                                          valueServiceAuto: e.state.precoAuto,
                                          localAuto: e.state.enderecoAuto,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Autonomo',
                                          UFAuto: e.state.UFAuto,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          categoryAuto: e.state.categoria,
                                          subcategoryAuto: e.state.subcategoria,
                                          workDays: e.state.daysWeek,
                                          photoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                            
                                        //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                        firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                          titleAuto: e.state.tituloAuto,
                                          titleAutoArray: e.state.arrayWordsAuto,
                                          idAnuncio: routeIdAnuncio,
                                          idUser: userUID,
                                          publishData: e.state.date,
                                          media: 0,
                                          nome: e.state.nomeAuto,
                                          descriptionAuto: e.state.descricaoAuto,
                                          valueServiceAuto: e.state.precoAuto,
                                          localAuto: e.state.enderecoAuto,
                                          fotoUsuarioLogado: e.state.fotoPerfil,
                                          type: 'Autonomo',
                                          UFAuto: e.state.UFAuto,
                                          verifiedPublish: true,
                                          premiumUser: e.state.usuarioComprou,
                                          categoryAuto: e.state.categoria,
                                          subcategoryAuto: e.state.subcategoria,
                                          workDays: e.state.daysWeek,
                                          photoPublish: urlImage,
                                          photoPublish2: urlImage2,
                                          photoPublish3: urlImage3,
                                          timeOpen: e.state.horarioAbre,
                                          timeClose: e.state.horarioFecha
                                        })
                                      })
                                  }).catch(function(error) {
                                    console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                  })
                                })
                        
                                    this.setModalVisible(true)
                        
                                  this.sleep(5000).then(() => { 
                                    this.props.navigation.navigate('TelaPrincipalAnuncio')
                                  })
                              } else {
                                this.AlertPro6.open()
                              }
                              
              
                            } 
              
                        })
                      })
              
                  })
                })
            })
          })
        }

      } else {
        this.AlertPro7.open()
      }

    }


    if(typePublish === 'Estabelecimento') {
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.precoEstab !== '') {
        
        this.setModalVisible(true)

        if(this.state.video !== null){
        getFileBlob(this.state.video, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              e.setState({isPhotoLoaded: true})
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);
              

              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    e.setState({isPhotoLoaded2: true})
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    








                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioAbre !== '' && this.state.horarioFecha !== '' && this.state.categoria !== '' && this.state.video !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                          
                                      //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                      firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
            
                                    })
            
                                }).catch(function(error) {
                                  console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                })
                      
                              })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaPrincipalAnuncio')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.tituloAuto !== '' && this.state.descricaoAuto !== '' && this.state.precoAuto !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                        titleAuto: e.state.tituloAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        valueServiceAuto: e.state.precoAuto,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Autonomo',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        workDays: e.state.daysWeek,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                          
                                      //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                      firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                        titleAuto: e.state.tituloAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        valueServiceAuto: e.state.precoAuto,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Autonomo',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        workDays: e.state.daysWeek,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                                    })
                                }).catch(function(error) {
                                  console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                })
                              })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaPrincipalAnuncio')
                                })
                            } else {
                              this.AlertPro6.open()
                            }
                            
            
                          } 
            
                      })
                    })
            
                })
              })
          })
        })

      } if(this.state.image !== null) {
        getFileBlob(this.state.image, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              e.setState({isPhotoLoaded: true})
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);
              

              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    e.setState({isPhotoLoaded2: true})
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    








                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
                          console.log('A imagem foi salva no Storage!');
                          console.log('Valor image state3: ' + imageIdStorageState3);
                          
            
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.precoEstab !== '' && this.state.horarioAbre !== '' && this.state.horarioFecha !== '' && this.state.categoria !== '' && this.state.image !== null) {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                          
                                      //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                      firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Estabelecimento',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        workDays: e.state.daysWeek,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
            
                                    })
            
                                }).catch(function(error) {
                                  console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                })
                      
                              })
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaPrincipalAnuncio')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.tituloAuto !== '' && this.state.descricaoAuto !== '' && this.state.precoAuto !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').doc(routeIdAnuncio).set({
                                        titleAuto: e.state.tituloAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        valueServiceAuto: e.state.precoAuto,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Autonomo',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        workDays: e.state.daysWeek,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                          
                                      //subir anuncio para a pasta principal onde todos os anuncios ativos serão visiveis
                                      firebase.firestore().collection('anuncios').doc(routeIdAnuncio).set({
                                        titleAuto: e.state.tituloAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        idAnuncio: routeIdAnuncio,
                                        idUser: userUID,
                                        publishData: e.state.date,
                                        media: 0,
                                        nome: e.state.nomeAuto,
                                        descriptionAuto: e.state.descricaoAuto,
                                        valueServiceAuto: e.state.precoAuto,
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        type: 'Autonomo',
                                        verifiedPublish: true,
                                        premiumUser: e.state.usuarioComprou,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        workDays: e.state.daysWeek,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        timeOpen: e.state.horarioAbre,
                                        timeClose: e.state.horarioFecha
                                      })
                                    })
                                }).catch(function(error) {
                                  console.log('ocorreu um erro ao carregar a imagem: ' + error.message)
                                })
                              })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaPrincipalAnuncio')
                                })
                            } else {
                              this.AlertPro6.open()
                            }
                            
            
                          } 
            
                      })
                    })
            
                })
              })
          })
        })
      }


      } else {
        this.AlertPro7.open()
      }
    }

  }








  searchCEPEstab(cepuser) {
    fetch(`https://viacep.com.br/ws/${cepuser}/json`).then(resposta => resposta.json()).then(obj =>  this.setState({UFEstab: obj.uf})).catch(err => alert('Ocorreu um erro ao consultar o estado!'))
  }

  searchCEPAuto(cepuser) {
    fetch(`https://viacep.com.br/ws/${cepuser}/json`).then(resposta => resposta.json()).then(obj =>  this.setState({UFAuto: obj.uf})).catch(err => alert('Ocorreu um erro ao consultar o estado!'))
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


  onChange = (event, selectedHour) => {
    this.setState({showHour: false})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    this.setState({horarioAbre: completeTime})
    console.log('hora selecionada: ' + completeTime)
    
  };


  onChangeClose = (event, selectedHour) => {
    this.setState({showHourClose: false})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    this.setState({horarioFecha: completeTime})
    console.log('hora selecionada: ' + completeTime)
    
  };






  renderPercentToWeWoAuto() {
    const replace = this.state.precoAuto.replace('R$', '');

    if(replace.includes(',00')){
      let knowLength = replace.length;

      if(knowLength > 10) {
        let replacePoint = replace.split(',00').join('');
        let replacePoint2 = replacePoint.split('.').join('');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      if(knowLength <= 10) {
        let replacePoint = replace.replace(',00','');
        let replacePoint2 = replacePoint.split('.').join('');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      
    } else {
      let knowLength = replace.length;

      if(knowLength <= 6) {
        let replacePoint = replace.split(',').join('.');
        let replaceInter = new Number(replacePoint);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      if(knowLength > 6) {
        let replacePointOne = replace.split(',').join('.');
        let replacePoint2 = replacePointOne.replace('.','');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }
      
    }
  }


  renderPercentToWeWoEstab() {
    const replace = this.state.precoEstab.replace('R$', '');

    if(replace.includes(',00')){
      let knowLength = replace.length;

      if(knowLength > 10) {
        let replacePoint = replace.split(',00').join('');
        let replacePoint2 = replacePoint.split('.').join('');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      if(knowLength <= 10) {
        let replacePoint = replace.replace(',00','');
        let replacePoint2 = replacePoint.split('.').join('');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      
    } else {
      let knowLength = replace.length;

      if(knowLength <= 6) {
        let replacePoint = replace.split(',').join('.');
        let replaceInter = new Number(replacePoint);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }

      if(knowLength > 6) {
        let replacePointOne = replace.split(',').join('.');
        let replacePoint2 = replacePointOne.replace('.','');
        let replaceInter = new Number(replacePoint2);
        let taxWeWo = ((replaceInter / 100) * 15).toFixed(2)
        
        return taxWeWo
      }
      
    }
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


                    <AlertPro
                      ref={ref => {
                        this.AlertPro = ref;
                      }}
                      showCancel={false}
                      onConfirm={() => this.AlertPro.close()}
                      title="O serviço de localização não está ativado"
                      message="Por favor ative o serviço de localização para continuar"
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
                      title="Permissão negada pelo usuário"
                      message="Permita o app usar o serviço de localização"
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
                        this.AlertPro3 = ref;
                      }}
                      showCancel={false}
                      onConfirm={() => this.AlertPro3.close()}
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
                        this.AlertPro4 = ref;
                      }}
                      showCancel={false}
                      onConfirm={() => this.AlertPro4.close()}
                      title="Importante!!!"
                      message="Escolha um vídeo de até 15 segundos"
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
                        this.AlertPro5 = ref;
                      }}
                      onCancel={() => this.openModalizePhotos()}
                      onConfirm={() => this.openModalizePhotosAndVideos()}
                      title="Atenção"
                      message="Deseja adicionar um vídeo no seu anúncio?"
                      textCancel="Não"
                      textConfirm="Sim"
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
                        this.AlertPro6 = ref;
                      }}
                      showCancel={false}
                      onConfirm={() => this.AlertPro6.close()}
                      title="Aviso"
                      message="Todos os campos devem ser preenchidos!"
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
                        this.AlertPro7 = ref;
                      }}
                      showCancel={false}
                      onConfirm={() => this.AlertPro7.close()}
                      title="Aviso"
                      message="Por favor, verifique se TODOS os campos estão preenchidos (incluindo 3 imagens)"
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


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalLoadVisible}
                        onRequestClose={() => {
                          Alert.alert("Modal has been closed.");
                        }}
                      >
                      <View style={{flex:1, alignItems:'center', paddingLeft: windowWidth / 2, paddingTop: windowHeight / 2, width: 100}}>
                          <LottieView source={loading} style={{width:100, height:100}} autoPlay loop />
                      </View>
                    </Modal>
                        
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          {this.state.type == 'Estabelecimento' &&
                            <View style={{flexDirection:'row'}}>
                                <ChooseOption/>
                                <TouchableOpacity>
                                    <Subtitle2Publish
                                      style={{fontWeight: 'bold'}}>Estabelecimento</Subtitle2Publish>
                                </TouchableOpacity>
                            </View>
                          }

                          {this.state.type == 'Autonomo' &&
                            <View style={{flexDirection:'row'}}>
                                <ChooseOption/>
                                <TouchableOpacity>
                                    <Subtitle2Publish
                                      style={{fontWeight: 'bold'}}>Autônomo</Subtitle2Publish>
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
                                <Image style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}} source={{uri: this.state.image}}/>
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
                          <View style={styles.item}>
                              <InputForm
                                value={this.state.tituloAuto}
                                onChangeText={text => this.onChangeTituloAuto(text)}
                                maxLength={20}
                                placeholder="Título Breve do Anúncio                                                        "
                              />
                          </View>

                          <TouchableOpacity onPress={() => this.openModalizeDescricao()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                editable={false}
                                value={this.state.descricaoAuto}
                                onChangeText={text => this.onChangeDescricaoAuto(text)}
                                placeholder="Descrição do Anúncio                                                    "
                              />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.openModalizeValueAuto()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              {this.state.precoAuto == 'Valor a combinar' ?
                                <InputForm
                                  editable={false}
                                  value='Valor a Combinar'
                                  onChangeText={text => this.onChangePrecoAuto(text)}
                                  keyboardType={"number-pad"}
                                  placeholder="Valor do Serviço                                                          "
                                />
                                :
                                <InputFormMask
                                  type={'money'}
                                  editable={false}
                                  value={this.state.precoAuto}
                                  onChangeText={text => this.onChangePrecoAuto(text)}
                                  keyboardType={"number-pad"}
                                  placeholder="Valor do Serviço                                                          "
                                />
                              }
                          </TouchableOpacity>

                          <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                value={this.state.nomeAuto}
                                onChangeText={text => this.onChangeNomeAuto(text)}
                                autoCapitalize={'words'}
                                placeholder="Seu nome                                                                       "
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
                                        {this.state.horarioAbre == '' ? 
                                          <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Abertura</Text> 
                                        : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioAbre}</Text> 
                                        }
                                      </TouchableOpacity>
                                  </View>
                              </View>

                                <View>
                                  <TitleChangeColor style={{fontWeight:'bold', paddingLeft: 35, marginTop:20, fontSize: this.responsibleFont()}}>Horário de Fechamento</TitleChangeColor>
                                    <View style={{marginLeft:44, width: 130, height:30}}>
                                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginTop:4}} onPress={() => this.setState({showHourClose: true})}> 
                                          <IconResponsiveNOBACK name="stopwatch" size={24}/>
                                          {this.state.horarioFecha == '' ?
                                            <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Fechamento</Text>
                                          : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioFecha}</Text>
                                          }
                                        </TouchableOpacity>
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
                                placeholder="Título Breve do Anúncio                                                        "
                              />
                            </View>

                            <TouchableOpacity onPress={() => this.openModalizeDescricaoEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                editable={false}
                                value={this.state.descricaoEstab}
                                onChangeText={text => this.onChangeDescricaoEstab(text)}
                                placeholder="Descrição do Anúncio                                                    "
                              />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.openModalizeValueEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              {this.state.precoEstab == 'Valor a combinar' ?
                                <InputForm
                                  editable={false}
                                  value='Valor a Combinar'
                                  onChangeText={text => this.onChangePrecoEstab(text)}
                                  keyboardType={"number-pad"}
                                  placeholder="Valor do Serviço                                                          "
                                />
                                :
                                <InputFormMask
                                  type={'money'}
                                  editable={false}
                                  value={this.state.precoEstab}
                                  onChangeText={text => this.onChangePrecoEstab(text)}
                                  keyboardType={"number-pad"}
                                  placeholder="Valor do Serviço                                                          "
                                />
                              }
                            </TouchableOpacity>
                          
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
                                        {this.state.horarioAbre == '' ? 
                                          <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Abertura</Text> 
                                        : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioAbre}</Text> 
                                        }
                                      </TouchableOpacity>
                                  </View>
                              </View>

                                <View>
                                  <TitleChangeColor style={{fontWeight:'bold', paddingLeft: 35, marginTop:20, fontSize: this.responsibleFont()}}>Horário de Fechamento</TitleChangeColor>
                                    <View style={{marginLeft:44, width: 130, height:30}}>
                                        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginTop:4}} onPress={() => this.setState({showHourClose: true})}> 
                                          <IconResponsiveNOBACK name="stopwatch" size={24}/>
                                          {this.state.horarioFecha == '' ?
                                            <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>Fechamento</Text>
                                          : <Text style={{color:'#9A9A9A', fontWeight:'bold', marginLeft:5}}>{this.state.horarioFecha}</Text>
                                          }
                                        </TouchableOpacity>
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



          {/*Modalize do preço AUTONOMO*/}
          <Modalize
            ref={this.state.modalizeRefValueAuto}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{flex:1,alignItems:'center'}}>
                <TextDays style={{fontWeight: 'bold', padding:15, textAlign:'center'}}>Deseja selecionar um preço? {'\n'}(caso não, o valor será "a combinar" )</TextDays>  
                {this.state.precoAuto == '' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({precoAuto: 'Valor a combinar'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>A combinar</TextDays>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({precoAuto: 'definir valor'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>Definir valor</TextDays>
                    </View>
                  </View>
                }

                {this.state.precoAuto == 'definir valor' &&
                  <View style={{flexDirection: 'column'}}>
                    <InputFormMask
                      type={'money'}
                      value={this.state.precoAuto}
                      onChangeText={text => this.onChangePrecoAuto(text)}
                      keyboardType={"number-pad"}
                      placeholder="Valor do Serviço"
                      />
                  </View>
                }

                {this.state.precoAuto.indexOf('R$') > -1 &&
                  <View style={{flexDirection: 'column'}}>
                    <TextDays>Taxa de Manutenção (15%): R${this.renderPercentToWeWoAuto()}</TextDays>
                    <InputFormMask
                      type={'money'}
                      value={this.state.precoAuto}
                      onChangeText={text => this.onChangePrecoAuto(text)}
                      keyboardType={"number-pad"}
                      placeholder="Valor do Serviço"
                    />
                  </View>
                }

                {this.state.precoAuto == 'Valor a combinar' &&
                  <View style={{alignItems:"center"}}>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({precoAuto: 'definir valor'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>Definir valor</TextDays>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                      <CategoryAndSub>Definido como: {this.state.precoAuto}</CategoryAndSub>
                    </View>
                  </View>
                }



            </View>
          </Modalize>

          {/*Modalize do preço ESTABELECIMENTO*/}
          <Modalize
            ref={this.state.modalizeRefValueEstab}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{flex:1,alignItems:'center'}}>
                <TextDays style={{fontWeight: 'bold', padding:15, textAlign:'center'}}>Deseja selecionar um preço? {'\n'}(caso não, o valor será "a combinar" )</TextDays>  
                {this.state.precoEstab == '' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({precoEstab: 'Valor a combinar'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>A combinar</TextDays>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({precoEstab: 'definir valor'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>Definir valor</TextDays>
                    </View>
                  </View>
                }

                {this.state.precoEstab == 'definir valor' &&
                  <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                    <InputFormMask
                      type={'money'}
                      value={this.state.precoEstab}
                      onChangeText={text => this.onChangePrecoEstab(text)}
                      keyboardType={"number-pad"}
                      placeholder="Valor do Serviço"
                    />
                  </View>
                }

                {this.state.precoEstab.indexOf('R$') > -1 &&
                  <View style={{flexDirection: 'column'}}>
                    <TextDays>Taxa de Manutenção (15%): R${this.renderPercentToWeWoEstab()}</TextDays>
                    <InputFormMask
                      type={'money'}
                      value={this.state.precoEstab}
                      onChangeText={text => this.onChangePrecoEstab(text)}
                      keyboardType={"number-pad"}
                      placeholder="Valor do Serviço"
                    />
                  </View>
                }

                {this.state.precoEstab == 'Valor a combinar' &&
                  <View style={{alignItems:"center"}}>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({precoEstab: 'definir valor'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>Definir valor</TextDays>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                      <CategoryAndSub>Definido como: {this.state.precoEstab}</CategoryAndSub>
                    </View>
                  </View>
                }



            </View>
          </Modalize>




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


          {/*Modalize da subcategoria*/}
          <Modalize
            ref={this.state.modalizeRefSub}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'flex-start', marginTop:40}}>
            <Heading6 style={ this.context.dark ? {fontWeight:'bold', marginLeft: 10,color:'#fff'}: {fontWeight:'bold', marginLeft: 10,color:'#000'}}>Selecione a SubCategoria Desejada</Heading6>
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
                        placeholder="Digite uma descrição detalhada para o anúncio"
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
                        <Video 
                          source={{ uri: this.state.video }}
                          rate={1.0}
                          volume={0}
                          isMuted={true}
                          resizeMode="cover"
                          shouldPlay
                          isLooping
                          style={{width:60, height:60, borderRadius:20}}
                        />
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



          {/*Modalize do CEP Auto*/}
          <Modalize
            ref={this.state.modalizeLocationAuto}
            snapPoint={400}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{flex:1,alignItems:'center', flexDirection:'column'}}>
                <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, color:'#fff'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000'}}>Localização</Text>
                
                {this.state.enderecoAuto == null ?
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>Nenhum endereço encontrado</Text>
                :
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>{this.state.enderecoAuto}</Text>  
                }
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this.GetCurrentLocation('Autonomo')} style={{alignItems:'center', justifyContent:'center', marginTop:10, marginRight:15, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="search-location" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({enderecoAuto: null})} style={{alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="times-circle" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>
                </View>
            </View>
                 

            <View>
              <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#fff', textAlign:'center'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000', textAlign:'center'}}>Por favor, verifique se as informações conferem, caso não, pesquise o endereço novamente</Text>
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
                        placeholder="Digite uma descrição detalhada para o anúncio"
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
        </SafeBackgroundPublish>
      </Fragment>
    );
  }
}
