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
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  View,
  Dimensions,
  Text,
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

import { TextInputMask } from 'react-native-masked-text';

import { ItemContainer, ViewTopForm, SafeBackgroundPublish, IconResponsive, IconResponsiveNOBACK, PublishTouchable, CategoryAndSub, TextDays, TitleChangeColor, InputFormMask, InputForm, SafeViewPublish, Subtitle2Publish, ViewCircle, ChooseOption } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


//import IAP API 
import {purchased} from '../../config/purchase';

import AlertPro from "react-native-alert-pro";

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import LottieView from 'lottie-react-native';

//locationSERVICES
import * as Location from 'expo-location';

//import datepicker
import DateTimePicker from '@react-native-community/datetimepicker';

import loading from '../../../assets/loading.json';

// import colors
import Colors from '../../theme/colors';

import { Video } from 'expo-av';

import RNIap from 'react-native-iap';

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
export default class EditarCartao extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      type: 'Estabelecimento',
      categorias: [],
      categoria:'',
      nomeAuto:'',
      tituloEstab:'',
      descricaoAuto:'',
      descricaoEstab:'',
      enderecoEstab: null,
      cepEstab: '',
      cepAuto: '',
      precoEstab:'',
      enderecoCepEstab: [],
      enderecoCepAuto: [],
      UFEstab: '',
      modalizeRef: React.createRef(null),
      modalizeRefSub: React.createRef(null),
      modalizeRefDescription: React.createRef(null),
      modalizeRefDescriptionEstab: React.createRef(null),
      modalizeRefAbertura: React.createRef(null),
      modalizeRefValueEstab:  React.createRef(null),
      modalizeRefFreteEstab: React.createRef(null),
      modalizeRefFechamento: React.createRef(null),
      modalizePhotos: React.createRef(null),
      modalizeVideoAndPhoto: React.createRef(null),
      modalizeLocationEstab: React.createRef(null),
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
      modalLoadVisible:false,
      currentDate: new Date(),
      date: '',
      subcategorias:[],
      arrayWordsAuto: [],
      arrayWordsEstab: [],
      subcategoria:'',
      locationServiceEnabled: false,
      fotoPerfil: null,
      freteValue: '',
      cep: '',
      pesoEnc: '',
      formEnc: 1,
      comprimentoEnc: 0.0,
      alturaEnc: 0.0,
      larguraEnc: 0.0,
      diametroEnc: 0.0,
      modalidadeCorreio: '04014'
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
    let usuarioAtual = firebase.auth().currentUser.uid;
    let userUID = firebase.auth().currentUser.uid;
    let routeType = this.props.route.params.type;
    let routeIdCartao = this.props.route.params.idCartao;


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
        await firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').where("idCartao", "==", routeIdCartao).get().then(function(querySnapshot) {
            let idCartao = ''
            let idUser = ''
            let categoria = ''
            let subcategoria = ''
            let descricao = ''
            let nome = ''
            let telefone = ''
            let imagem = ''
            let imagem2 = ''
            let imagem3 = ''
            let video = ''
            let type = ''
            let verificado = false
            let location = ''
            let arrayAuto = []

            querySnapshot.forEach(function(doc) {
                idCartao = doc.data().id,
                idUser = doc.data().idUser,
                arrayAuto = doc.data().titleAutoArray,
                categoria = doc.data().categoryAuto,
                subcategoria = doc.data().subcategoryAuto,
                descricao = doc.data().descriptionAuto,
                location = doc.data().localAuto,
                nome = doc.data().nome,
                imagem = doc.data().photoPublish,
                imagem2 = doc.data().photoPublish2,
                imagem3 = doc.data().photoPublish3,
                video = doc.data().videoPublish,
                type = doc.data().type,
                verificado = false
            })

            e.setState({idCartao: idCartao})
            e.setState({arrayWordsAuto: arrayAuto})
            e.setState({categoria: categoria})
            e.setState({subcategoria: subcategoria})
            e.setState({descricaoAuto: descricao})
            e.setState({nomeAuto: nome})
            e.setState({image: imagem})
            e.setState({image2: imagem2})
            e.setState({image3: imagem3})
            e.setState({video: video})
            e.setState({type: type})
        })

    }


    if(routeType == 'Estabelecimento') { 
        this.setState({type: 'Estabelecimento'})
        await firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').where("idCartao", "==", routeIdCartao).get().then(function(querySnapshot) {
            let idCartao = ''
            let categoria = ''
            let subcategoria = ''
            let descricao = ''
            let idUser = ''
            let imagem = ''
            let imagem2 = ''
            let imagem3 = ''
            let video = ''
            let titulo = ''
            let valor = ''
            let verificado = false
            let local = ''
            let type = ''
            let ufestab = ''
            let arrayEstab = []
            let peso = ''
            let form = ''
            let comprimento = ''
            let altura = ''
            let largura = ''
            let diametro = ''
            let modalidade = ''
            let cep = ''

            querySnapshot.forEach(function(doc) {
                idCartao = doc.data().id,
                titulo = doc.data().titleEstab,
                arrayEstab = doc.data().titleEstabArray,
                peso = doc.data().pesoEnc,
                form = doc.data().formEnc,
                comprimento = doc.data().comprimentoEnc,
                altura = doc.data().alturaEnc,
                largura = doc.data().larguraEnc,
                diametro = doc.data().diametroEnc,
                modalidade = doc.data().modalidadeCorreio,
                cep = doc.data().cep,
                categoria = doc.data().categoryEstab,
                subcategoria = doc.data().subcategoryEstab,
                descricao = doc.data().descriptionEstab,
                idUser = doc.data().idUser,
                imagem = doc.data().photoPublish,
                imagem2 = doc.data().photoPublish2,
                imagem3 = doc.data().photoPublish3,
                video = doc.data().videoPublish,
                valor = doc.data().valueServiceEstab,
                verificado = false,
                ufestab = doc.data().UFEstab,
                type = doc.data().type,
                local = doc.data().localEstab
            })

            e.setState({idCartao: idCartao})
            e.setState({tituloEstab: titulo})
            e.setState({arrayWordsEstab: arrayEstab})
            e.setState({descricaoEstab: descricao})
            e.setState({categoria: categoria})
            e.setState({subcategoria: subcategoria})
            e.setState({image: imagem})
            e.setState({image2: imagem2})
            e.setState({image3: imagem3})
            e.setState({video: video})
            e.setState({precoEstab: valor})
            e.setState({type: type})
            e.setState({UFEstab: ufestab})
            e.setState({enderecoEstab: local})
            e.setState({pesoEnc: peso})
            e.setState({formEnc: form})
            e.setState({comprimentoEnc: comprimento})
            e.setState({alturaEnc: altura})
            e.setState({larguraEnc: largura})
            e.setState({diametroEnc: diametro})
            e.setState({modalidadeCorreio: modalidade})
            e.setState({cep: cep})
        })

    }

    console.log('state de categorias: ' + this.state.categorias)


    //pegar a foto do usuario
    await firebase.firestore().collection('usuarios').doc(usuarioAtual).onSnapshot(documentSnapshot => {
      e.setState({fotoPerfil: documentSnapshot.data().photoProfile})
    })


  }



  setModalLoadVisible = (visible) => {
    this.setState({ modalLoadVisible: visible });
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

    //se o campo estiver vazio ele limpa a lista
    if(text == '') {
      this.setState({arrayWordsAuto: []})
    }

    this.state.arrayWordsAuto.push(text)
    console.log('nome auto'  + this.state.nomeAuto)
    console.log('array de palavras: '  + this.state.arrayWordsAuto)
  }

  onChangeEnderecoEstab(text) {
    this.setState({enderecoEstab: text})
    console.log('endereco estab'  + this.state.enderecoEstab)
  }

  onChangePrecoEstab(text) {
    this.setState({precoEstab: text})
  }

  onChangeFreteEstab(text) {
    this.setState({freteValue: text})
  }

  onChangeCEPEstab(text) {
    this.setState({cepEstab: text})
    console.log('cepEstab'  + this.state.cepEstab)
  }

  onChangeCEPAuto(text) {
    this.setState({cepAuto: text})
    console.log('cepAuto'  + this.state.cepAuto)
  }

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  openModalizeSubCategoria() {
    const modalizeRefSub = this.state.modalizeRefSub;

    modalizeRefSub.current?.open()
  }


  openModalizeAbertura() {
    const modalizeRefAbertura = this.state.modalizeRefAbertura;

    modalizeRefAbertura.current?.open()
  }



  openModalizeDescricao() {
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.open()
  }

  openModalizeDescricaoEstab() {
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.open()
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


  
  closeDescriptionModal(){
    const modalizeRefDescription = this.state.modalizeRefDescription;

    modalizeRefDescription.current?.close()
  }


  closeFreteModal(){
    const modalizeRefFreteEstab = this.state.modalizeRefFreteEstab;
    modalizeRefFreteEstab.current?.close();

    this.setState({freteValue: 'Preenchido'})
  }

  closeDescriptionEstabModal(){
    const modalizeRefDescriptionEstab = this.state.modalizeRefDescriptionEstab;

    modalizeRefDescriptionEstab.current?.close()
  }

  closeLocationModalEstab(estado, local, lograd) {
    const modalizeLocationEstab = this.state.modalizeLocationEstab;

    const sumLocation = `${lograd}, ${local}, ${estado}`;

    this.setState({enderecoEstab: sumLocation})
    this.setState({UFEstab: estado})
    modalizeLocationEstab.current?.close()
  }


  openModalizeFechamento() {
    const modalizeRefFechamento = this.state.modalizeRefFechamento;

    modalizeRefFechamento.current?.open()
  }

  
  openModalizeValueEstab() {
    const modalizeRefValueEstab = this.state.modalizeRefValueEstab;

    modalizeRefValueEstab.current?.open()
  }


  openModalizeFreteEstab() {
    const modalizeRefFreteEstab = this.state.modalizeRefFreteEstab;
    modalizeRefFreteEstab.current?.open()

    this.AlertPro8.close();
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


  onChange = (event, selectedHour) => {
    this.setState({showHour: false})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    console.log('hora selecionada: ' + completeTime)
    
  };


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


  onChangePesoEnc(text) {
    this.setState({pesoEnc: text})
    console.log('pesoEnc estab'  + this.state.pesoEnc)
  }

  onChangeComprimentoEnc(text) {
    this.setState({comprimentoEnc: text})
    console.log('comprimentoEnc estab'  + this.state.comprimentoEnc)
  }

  onChangeAlturaEnc(text) {
    this.setState({alturaEnc: text})
    console.log('alturaEnc estab'  + this.state.alturaEnc)
  }

  onChangeLarguraEnc(text) {
    this.setState({larguraEnc: text})
    console.log('larguraEnc estab'  + this.state.larguraEnc)
  }

  onChangeDiametroEnc(text) {
    this.setState({diametroEnc: text})
    console.log('diametroEnc estab'  + this.state.diametroEnc)
  }

  onChangeCEP(text) {
    this.setState({cep: text})
  }



  uploadFormToFirebase(typePublish) {
    let routeIdCartao = this.props.route.params.idCartao;
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

    var isPhotoLoaded = false;
    var isPhotoLoaded2 = false;
    var isPhotoLoaded3 = false;

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
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.enderecoEstab !== '', this.state.precoEstab !== '') {
        this.setModalVisible(true)


        if(this.state.video !== null){
        getFileBlob(this.state.video, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              isPhotoLoaded = true
              console.log('O video foi salvo no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);





              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    isPhotoLoaded2 = true
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.enderecoEstab !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.precoEstab !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                                  })
                                    })
                                      })
                      
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                  })
                                    })
                                      })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
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
              isPhotoLoaded = true
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);





              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    isPhotoLoaded2 = true
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.enderecoEstab !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.precoEstab !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                                  })
                                    })
                                      })
                      
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                  })
                                    })
                                      })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
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


    if(typePublish === 'Autonomo') {
      if(this.state.image !== null || this.state.video !== null && this.state.image2 !== null && this.state.image3 !== null && this.state.nomeAuto !== '' && this.state.descricaoAuto !== '') {
        this.setModalVisible(true)

        if(this.state.video !== null){
        getFileBlob(this.state.video, async blob => {
          await firebase.storage().ref(`${storageUrl}/images/${imageId}`).put(blob).then((snapshot) => {
              imageIdStorageState = imageId
              isPhotoLoaded = true
              console.log('O video foi salvo no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);





              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    isPhotoLoaded2 = true
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.enderecoEstab !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.precoEstab !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        UFEstab: e.state.UFEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                                  })
                                    })
                                      })
                      
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.categoria !== '' && this.state.video !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        videoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                  })
                                    })
                                      })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
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
              isPhotoLoaded = true
              console.log('A imagem foi salva no Storage!');
              console.log('Valor image state: ' + imageIdStorageState);





              getFileBlob(this.state.image2, async blob => {
                await firebase.storage().ref(`${storageUrl}/images/${imageId2}`).put(blob).then((snapshot) => {
                    imageIdStorageState2 = imageId2
                    isPhotoLoaded2 = true
                    console.log('A imagem foi salva no Storage!');
                    console.log('Valor image state2: ' + imageIdStorageState2);
                    






                    getFileBlob(this.state.image3, async blob => {
                      await firebase.storage().ref(`${storageUrl}/images/${imageId3}`).put(blob).then((snapshot) => {
                          imageIdStorageState3 = imageId3
            
                          if(type == 'Estabelecimento'){
                            if(this.state.tituloEstab !== '' && this.state.descricaoEstab !== '' && this.state.enderecoEstab !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.precoEstab !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        UFEstab: e.state.UFEstab,
                                        verifiedPublish: true,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        titleEstab: e.state.tituloEstab,
                                        titleEstabArray: e.state.arrayWordsEstab,
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        descriptionEstab: e.state.descricaoEstab,
                                        valueServiceEstab: e.state.precoEstab,
                                        publishData: e.state.date,
                                        media: 0,
                                        type: 'Estabelecimento',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        UFEstab: e.state.UFEstab,
                                        localEstab: e.state.enderecoEstab,
                                        categoryEstab: e.state.categoria,
                                        subcategoryEstab: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                        pesoEnc: e.state.pesoEnc,
                                        formEnc: e.state.formEnc,
                                        comprimentoEnc: e.state.comprimentoEnc,
                                        alturaEnc: e.state.alturaEnc,
                                        larguraEnc: e.state.larguraEnc,
                                        diametroEnc: e.state.diametroEnc,
                                        modalidadeCorreio: e.state.modalidadeCorreio,
                                        cep: e.state.cep
                                      })
                                  })
                                    })
                                      })
                      
                      
                                this.setModalVisible(true)
                      
                              this.sleep(5000).then(() => { 
                                this.props.navigation.navigate('TelaGeralCriarCartao')
                              })
                      
                            } else {
                              this.AlertPro6.open()
                            }
                          }
                      
                      
                          if(type == 'Autonomo') {
                            if(this.state.descricaoAuto !== '' && this.state.categoria !== '' && this.state.image !== null && this.state.nomeAuto !== '') {
                                firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState}`).getDownloadURL().then(function(urlImage) {
                                  firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState2}`).getDownloadURL().then(function(urlImage2) {   
                                    firebase.storage().ref(`${storageUrl}/images/${imageIdStorageState3}`).getDownloadURL().then(function(urlImage3) {  
                                      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                          
                                      //editar cartao para a pasta principal onde todos os cartoes ativos serão visiveis
                                      firebase.firestore().collection('cartoes').doc(routeIdCartao).update({
                                        idCartao: routeIdCartao,
                                        idUser: userUID,
                                        nome: e.state.nomeAuto,
                                        titleAutoArray: e.state.arrayWordsAuto,
                                        publishData: e.state.date,
                                        media: 0,
                                        descriptionAuto: e.state.descricaoAuto,
                                        type: 'Autonomo',
                                        fotoUsuarioLogado: e.state.fotoPerfil,
                                        verifiedPublish: true,
                                        categoryAuto: e.state.categoria,
                                        subcategoryAuto: e.state.subcategoria,
                                        photoPublish: urlImage,
                                        photoPublish2: urlImage2,
                                        photoPublish3: urlImage3,
                                      })
                                  })
                                    })
                                      })
                      
                                  this.setModalVisible(true)
                      
                                this.sleep(5000).then(() => { 
                                  this.props.navigation.navigate('TelaGeralCriarCartao')
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

  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(12, Height);
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


  closeModal() {
    this.setState({freteValue: 'Retirada no Local'})
    this.AlertPro8.close();
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

                    <AlertPro
                      ref={ref => {
                        this.AlertPro8 = ref;
                      }}
                      onCancel={() => this.openModalizeFreteEstab()}
                      onConfirm={() => this.closeModal()}
                      title="Como será o frete?"
                      message="Por favor, defina se o cliente vai retirar no local ou pagar pelo frete"
                      textConfirm="Retirar"
                      textCancel="Cobrar Frete"
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
                        
                      >
                      <View style={{flex:1, alignItems:'center', paddingLeft: windowWidth / 2, paddingTop: windowHeight / 2, width: 100}}>
                          <LottieView source={loading} style={{width:100, height:100}} autoPlay loop />
                      </View>
                    </Modal>


                        
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          { this.state.type == 'Estabelecimento' &&
                            <View style={{flexDirection:'row'}}>
                                <ChooseOption/>
                                <TouchableOpacity>
                                    <Subtitle2Publish
                                      style={{fontWeight: 'bold'}}>Estabelecimento</Subtitle2Publish>
                                </TouchableOpacity>
                            </View>
                          }

                          {this.state.type == 'Autonomo' &&  
                          <View style={{flexDirection:'row', padding: 16}}>
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

                        {this.state.type == 'Estabelecimento' &&
                          <View>
                            <TouchableOpacity onPress={() => this.openModalizeLocationEstab()} style={{alignItems:'center', justifyContent:'center', backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
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
                          <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                              <InputForm
                                value={this.state.nomeAuto}
                                maxLength={20}
                                onChangeText={text => this.onChangeNomeAuto(text)}
                                autoCapitalize={'words'}
                                style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                                placeholder="Digite seu Nome                                                                       "
                              />
                          </View>

                          {Platform.OS === "ios" ?
                            <TouchableOpacity onPress={() => this.openModalizeDescricao()} style={{flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingHorizontal: 4,
                              height: 36, borderBottomWidth:0.5, maxWidth: windowWidth/1.15, marginLeft: 15, borderBottomColor: "#DAA250"}}>
                                {this.state.descricaoAuto == '' ?
                                  <Text style={{color: '#c4bcbc', padding: 10}}>
                                    Dê a melhor descrição das suas habilidades, detalhe-as
                                  </Text>
                                :
                                  <Text style={{color: '#000', padding: 10}}>
                                    {this.state.descricaoAuto}
                                  </Text>
                                }
                                  
                            </TouchableOpacity>
                          :
                            <TouchableOpacity onPress={() => this.openModalizeDescricao()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                <InputForm
                                  value={this.state.descricaoAuto}
                                  onChangeText={text => this.onChangeDescricaoAuto(text)}
                                  placeholder="Dê a melhor descrição das suas habilidades, detalhe-as                                                    "
                                  editable={false}
                                />
                            </TouchableOpacity>
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
                                style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                                placeholder="Nome do Produto (até 20 caracteres)                                                        "
                              />
                            </View>

                              {Platform.OS === "ios" ?
                                <TouchableOpacity onPress={() => this.openModalizeDescricaoEstab()} style={{flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingHorizontal: 4,
                                  height: 36, borderBottomWidth:0.5, maxWidth: windowWidth/1.15, marginLeft: 15, borderBottomColor: "#DAA250"}}>
                                    {this.state.descricaoEstab == '' ?
                                      <Text style={{color: '#c4bcbc', padding: 10}}>
                                        Descrição do seu produto... capriche ;)
                                      </Text>
                                    :
                                      <Text style={{color: '#000', padding: 10}}>
                                        {this.state.descricaoEstab}
                                      </Text>
                                    }
                                      
                                </TouchableOpacity>
                              :
                                <TouchableOpacity onPress={() => this.openModalizeDescricaoEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                    <InputForm
                                      value={this.state.descricaoEstab}
                                      onChangeText={text => this.onChangeDescricaoEstab(text)}
                                      placeholder="Descrição do Anúncio                                                    "
                                      editable={false}
                                    />
                                </TouchableOpacity>
                              }

                              {Platform.OS === "ios" ?
                                <TouchableOpacity onPress={() => this.openModalizeValueEstab()} style={{flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingHorizontal: 4,
                                  height: 36, borderBottomWidth:0.5, maxWidth: windowWidth/1.15, marginLeft: 15, borderBottomColor: "#DAA250"}}>
                                      <Text style={{color: '#c4bcbc', padding: 10}}>
                                        Valor do Produto
                                      </Text>
                                      <Text style={{color: '#000', padding: 10}}>
                                        {this.state.precoEstab}
                                      </Text>
                                </TouchableOpacity>
                              :
                                <TouchableOpacity onPress={() => this.openModalizeValueEstab()} style={{flexDirection: 'row', justifyContent: 'space-between', padding: Platform.OS === "ios" ? 10 : 0, alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                    {this.state.precoEstab == 'Valor a combinar' ?
                                      <InputForm
                                        editable={false}
                                        value='Valor a Combinar'
                                        onChangeText={text => this.onChangePrecoEstab(text)}
                                        keyboardType={"number-pad"}
                                        style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                                        placeholder="Valor do Produto                                                          "
                                      />
                                      :
                                      <InputFormMask
                                        type={'money'}
                                        editable={false}
                                        value={this.state.precoEstab}
                                        onChangeText={text => this.onChangePrecoEstab(text)}
                                        keyboardType={"number-pad"}
                                        style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                                        placeholder="Valor do Produto                                                          "
                                      />
                                    }
                                  </TouchableOpacity>
                              }

                            {Platform.OS === "ios" ?
                              <TouchableOpacity onPress={() => this.AlertPro8.open()} style={{flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 4,
                                height: 36, borderBottomWidth:0.5, maxWidth: windowWidth/1.15, marginLeft: 15, borderBottomColor: "#DAA250"}}>
                                  {this.state.freteValue == '' ?
                                    <Text style={{color: '#c4bcbc', padding: 10}}>
                                      Defina seu frete aqui
                                    </Text>
                                  :
                                    <Text style={{color: '#000', padding: 10}}>
                                      {this.state.freteValue}
                                    </Text>
                                  }
                                    
                              </TouchableOpacity>
                            :
                              <TouchableOpacity onPress={() => this.AlertPro8.open()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                  <InputForm
                                    editable={false}
                                    value={this.state.freteValue}
                                    placeholder="Defina seu frete aqui                                                    "
                                  />
                              </TouchableOpacity>
                            }

                            {Platform.OS === "ios" ?
                              <TouchableOpacity onPress={() => this.openModalizeLocationEstab()} style={{flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 4,
                                height: 36, borderBottomWidth:0.5, maxWidth: windowWidth/1.15, marginLeft: 15, borderBottomColor: "#DAA250"}}>
                                  {this.state.enderecoEstab == null ?
                                    <Text style={{color: '#c4bcbc', padding: 10}}>
                                      Endereço do Estabelecimento
                                    </Text>
                                  :
                                    <Text style={{color: '#000', padding: 10}}>
                                      {this.state.enderecoEstab}
                                    </Text>
                                  }
                                    
                              </TouchableOpacity>
                            :
                              <TouchableOpacity onPress={() => this.openModalizeLocationEstab()} style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 36}}>
                                  <InputForm
                                    value={this.state.enderecoEstab}
                                    keyboardType={"default"}
                                    editable={false}
                                    placeholder="Endereço do Estabelecimento                                                   "
                                  />
                              </TouchableOpacity>
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



         {/*Modalize do FRETE ESTABELECIMENTO*/}
         <Modalize
            ref={this.state.modalizeRefFreteEstab}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{flex:1,alignItems:'center'}}>
                <TextDays style={{fontWeight: 'bold', maxWidth: windowWidth/1.2, textAlign:'center'}}>Aqui você pode definir o valor do frete, no momento somente os Correios está disponível (Digite as informações necessárias)</TextDays>  
                <View style={{flexDirection: 'column', alignItems: 'center',paddingHorizontal: 16, height: windowHeight}}>
                  <InputFormMask
                    type={'zip-code'}
                    value={this.state.cep}
                    onChangeText={text => this.onChangeCEP(text)}
                    keyboardType={"number-pad"}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Digite o CEP de onde o produto sairá"
                  />

                  <InputForm
                    value={this.state.pesoEnc}
                    onChangeText={text => this.onChangePesoEnc(text)}
                    keyboardType={"number-pad"}
                    maxLength={3}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Digite o peso da encomenda em KG"
                  />
                  

                  <InputForm
                    value={this.state.alturaEnc}
                    onChangeText={text => this.onChangeAlturaEnc(text)}
                    keyboardType={"decimal-pad"}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Altura da encomenda, em centímetros"
                  />

                  <InputForm
                    value={this.state.larguraEnc}
                    onChangeText={text => this.onChangeLarguraEnc(text)}
                    keyboardType={"decimal-pad"}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Largura da encomenda, em centímetros"
                  />

                  <InputForm
                    value={this.state.diametroEnc}
                    onChangeText={text => this.onChangeDiametroEnc(text)}
                    keyboardType={"decimal-pad"}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Diâmetro da encomenda, em centímetros"
                  />

                  <InputForm
                    value={this.state.comprimentoEnc}
                    onChangeText={text => this.onChangeComprimentoEnc(text)}
                    keyboardType={"decimal-pad"}
                    style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
                    placeholder="Comprimento da encomenda, em centímetros."
                  />

                  <View style={{flexDirection:'row'}}>
                    {this.state.formEnc !== 1 ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({formEnc: 1})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:5, marginTop:20}}/>
                        <TextDays>Caixa/Pacote</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:5, marginTop:20}}/>
                        <TextDays>Caixa/Pacote</TextDays>
                      </View>
                    }

                    {this.state.formEnc !== 2 ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({formEnc: 2})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>Rolo/Prisma</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:15, marginTop:20}}/>
                        <TextDays>Rolo/Prisma</TextDays>
                      </View>
                    }

                    {this.state.formEnc !== 3 ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({formEnc: 3})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>Envelope</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:15, marginTop:20}}/>
                        <TextDays>Envelope</TextDays>
                      </View>
                    }
                  </View>



                  {/*Definir a modalidade de entrega*/}
                  <View style={{flexDirection:'row'}}>
                    {this.state.modalidadeCorreio !== '04014' ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({modalidadeCorreio: '04014'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:5, marginTop:20}}/>
                        <TextDays>SEDEX à vista</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:5, marginTop:20}}/>
                        <TextDays>SEDEX à vista</TextDays>
                      </View>
                    }

                    {this.state.modalidadeCorreio !== '04510' ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({modalidadeCorreio: '04510'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>PAC à vista</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:15, marginTop:20}}/>
                        <TextDays>PAC à vista</TextDays>
                      </View>
                    }

                    {this.state.modalidadeCorreio !== '04782' ? 
                      <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => this.setState({modalidadeCorreio: '04782'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                        <TextDays>SEDEX 12</TextDays>
                      </View>
                      :
                      <View style={{flexDirection:'row'}}>
                        <ChooseOption onPress={() => {}} style={{marginLeft:15, marginTop:20}}/>
                        <TextDays>SEDEX 12</TextDays>
                      </View>
                    }
                  </View>

                  <TouchableOpacity
                    onPress={() => this.closeFreteModal()}
                    style={{borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor:'#DAA520', height: 60, width: 60, marginTop:60, marginBottom:40}}
                  >
                    <FontAwesome5 name="check-circle" size={34} color={'white'}/>
                  </TouchableOpacity>
                </View>


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
                      style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
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
                      style={{minWidth: Platform.OS === "ios" ? windowWidth/1.15 : 0, padding: Platform.OS === "ios" ? 10 : 0}}
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
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center',paddingHorizontal: 16, height: 106}}>
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

        </SafeBackgroundPublish>
      </Fragment>
    );
  }
}
