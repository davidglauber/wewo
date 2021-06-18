/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar,
  Share,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';


//import linking
import * as Linking from 'expo-linking';


import { PulseIndicator } from 'react-native-indicators';

// import components
import Button from '../../components/buttons/Button';
import {Caption, Heading5, SmallText} from '../../components/text/CustomText';
import Icon from '../../components/icon/Icon';
import IconMain from '../../components/icon/IconMain';
import SizePicker from '../../components/pickers/SizePicker';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

//import firebase
import firebase from '../../config/firebase';


//importa estrela de voatação
import { Rating, AirbnbRating } from 'react-native-ratings';

// ProductA Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const CLOSE_ICON = IOS ? 'ios-close' : 'md-close';
const SHARE_ICON = IOS ? 'ios-share' : 'md-share';
const imgHolder = require('../../assets/img/confeiteira.jpeg');

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { SafeAnuncioView, SignUpBottom, IconResponsiveNOBACK, ValueFieldPrincipal, ViewComment, ReviewView, InputFormMask, InputForm, TouchableResponsive, ButtonIconContainer, IconResponsive, Heading, TextDescription, TextTheme, TextDescription2 } from '../home/styles';

import { Modalize } from 'react-native-modalize';

import { ThemeContext } from '../../../ThemeContext';


import {Heading6} from '../../components/text/CustomText';

import LottieView from 'lottie-react-native';

import AlertPro from "react-native-alert-pro";

import loading from '../../../assets/loading.json';

// import components
import { FontAwesome5 } from '@expo/vector-icons';

//locationSERVICES
import * as Location from 'expo-location';

//import ADS
import { AdMobBanner} from 'expo-ads-admob';

import { Video } from 'expo-av';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

import { parse } from 'fast-xml-parser';

// ProductA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  swiperContainer: {
    width: Dimensions.get('window').width,
    height: 228,
  },
  paginationStyle: {
    bottom: 12,
    transform: [{scaleX: isRTL ? -1 : 1}],
  },
  dot: {backgroundColor: Colors.background},
  activeDot: {backgroundColor: '#DAA520'},
  slideImg: {
    width: Dimensions.get('window').width,
    height: 228,
    resizeMode: 'cover',
  },
  topButton: {
    position: 'absolute',
    top: 16,
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  left: {left: 16},
  right: {right: 16},
  buttonIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  favorite: {
    backgroundColor: Colors.secondaryColor,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  productTitleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 10,
  },
  productTitle: {
    fontWeight: '700',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  shortDescription: {
    paddingBottom: 8,
    textAlign: 'left',
  },
  pickerGroup: {
    marginTop: 24,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  caption: {
    width: 300,
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 17
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 20,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryColor,
  },
  buttonPriceContainer: {
    position: 'absolute',
    top: 0,
    left: 40,
    height: 48,
    justifyContent: 'center',
  },
  buttonPriceText: {
    fontSize: 16,
    lineHeight: 18,
    color: Colors.onPrimaryColor,
  },
});

// ProductA
export default class MostrarCartao extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      horario: '',
      cartaoAuto:[],
      cartaoEstab:[],
      modalizeRef: React.createRef(null),
      modalizeRefDisponibilidade: React.createRef(null),
      modalizeRefFrete: React.createRef(null),
      modalizeLocation: React.createRef(null),
      usersThatVotedFirebase: [],
      mediaAvaliacao: [],
      notaMedia: 0,
      fotoUser: '',
      nomeUser:'',
      text:'',
      usersThatCommented: [],
      product: {
        images: [
          require('../../assets/img/confeiteira.jpeg'),
          require('../../assets/img/confeiteira.jpeg'),
          require('../../assets/img/confeiteira.jpeg'),
        ],
        name: 'Forneço Cupcakes',
        description:
          'Sou confeiteiro Profissional, tenho variedades de sabores, entrego em todo país. Encomenda a combinar por chat. Peça já o seu!',
        price: 56.7,
        quantity: 1,
        servingSize: 1,
        sideDish: 20,
        total: 10.9,
      },
      favorite: false,
      phoneNavigator: this.props.route.params.phoneNumberNavigator,
      dateAuto:'',
      dateEstab:'',
      isFetched: false,
      qtd: 0,
      locationServiceEnabled: false,
      enderecoUser: null,
      item: [],
      nomeEnd: '',
      cepEnd: '',
      endereco: '',
      numeroEnd: '',
      complementoEnd: '',
      bairroEnd: '',
      cidadeEnd: '',
      estadoEnd: '',
      userLocation: '',
      idCartao: '',
      cepComprador: '',
      codigoCorreios: '',
      valorFrete: '',
      prazoEntrega: '',
      erroFrete: ''
    };
  }



  async CheckIfLocationEnabled() {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      this.AlertPro11.open();
    } else {
      this.setState({locationServiceEnabled: enabled});
    }
  };

  async GetCurrentLocation(){
    let { status } = await Location.requestPermissionsAsync();
    this.setModalVisible(true)

    if (status !== 'granted') {
      this.AlertPro12.open();
    }
  
    let { coords } = await Location.getCurrentPositionAsync();
  
    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
  
      for (let item of response) {
        var address = `${item.region}, ${item.subregion}, ${item.district}, ${item.street} (${item.postalCode})`;
        var cep = item.postalCode;
        var replaceCep = cep.replace('-', '');
      }

      this.setState({enderecoUser: address})
      this.setState({cepComprador: replaceCep})
      
      this.openModalizeFrete(this.state.item, replaceCep)
      //this.saveProductInFirebase(this.state.item)
      this.setModalVisible(false)
    }
  };



  async componentDidMount() {
    let e = this;
    
    let idCartao = this.props.route.params.idDoCartao;
    let currentUserUID = this.props.route.params.idUserCartao;
    let currentUser = firebase.auth().currentUser;
    let arraySumStars = [];

    console.log('ID DO ANUNCIO: ' + idCartao)
    console.log('ROUTE ID USER: ' + currentUserUID)
    console.log('Numero de telefone: ' + this.state.phoneNavigator)

    await firebase.firestore().collection(`usuarios`).doc(`${currentUserUID}`).collection('cartoes').where("idCartao", "==", idCartao).where("type", "==", "Autonomo").get().then(function(querySnapshot){
      let cartaoAutoDidMount = []
      let dataAtual = ''
      querySnapshot.forEach(function(doc) {
        cartaoAutoDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          publishData: e.state.date,
          nome: doc.data().nome,
          video: doc.data().videoPublish,
          fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
          photo: doc.data().photoPublish,
          photo2: doc.data().photoPublish2,
          photo3: doc.data().photoPublish3,
          categoria: doc.data().categoryAuto,
          subcategoria: doc.data().subcategoryAuto,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          verified: doc.data().verifiedPublish
        })
        dataAtual = doc.data().publishData
        e.setState({idCartao: idCartao})
      })
      e.setState({cartaoAuto: cartaoAutoDidMount})
      e.setState({dateAuto: dataAtual})

      e.setModalVisible(false)
      e.setState({isFetched: true})
    })


    await firebase.firestore().collection(`usuarios`).doc(`${currentUserUID}`).collection('cartoes').where("idCartao", "==", idCartao).where("type", "==", "Estabelecimento").get().then(function(querySnapshot){
      let cartaoEstabDidMount = []
      let dataAtual = ''
      querySnapshot.forEach(function(doc) {
        cartaoEstabDidMount.push({
          idUser: doc.data().idUser,
          value: doc.data().valueServiceEstab,
          idCartao: doc.data().idCartao,
          publishData: e.state.date,
          video: doc.data().videoPublish,
          fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
          photo: doc.data().photoPublish,
          photo2: doc.data().photoPublish2,
          photo3: doc.data().photoPublish3,
          phone: doc.data().phoneNumberEstab,
          title: doc.data().titleEstab,
          categoria: doc.data().categoryEstab,
          subcategoria: doc.data().subcategoryEstab,
          description: doc.data().descriptionEstab,
          type: doc.data().type,
          verified: doc.data().verifiedPublish,
          timeOpen: doc.data().timeOpen,
          timeClose: doc.data().timeClose,
          local: doc.data().localEstab,
          workDays: doc.data().workDays,
          valueServiceEstab: doc.data().valueServiceEstab,
          pesoEnc: doc.data().pesoEnc,
          formEnc: doc.data().formEnc,
          comprimentoEnc: doc.data().comprimentoEnc,
          alturaEnc: doc.data().alturaEnc,
          larguraEnc: doc.data().larguraEnc,
          diametroEnc: doc.data().diametroEnc,
          modalidadeCorreio: doc.data().modalidadeCorreio,
          cep: doc.data().cep,
        })
        dataAtual = doc.data().publishData
        e.setState({idCartao: idCartao})
      })
      e.setState({cartaoEstab: cartaoEstabDidMount})
      e.setState({item: cartaoEstabDidMount})
      e.setState({dateEstab: dataAtual})

      e.setModalVisible(false)
      e.setState({isFetched: true})
    })




  if(currentUser == null) {
      e.setState({usersThatVotedFirebase: []})
  } else {
    //verifica se o usuário já votou, se sim, não pode votar de novo
     firebase.firestore().collection('cartoes').doc(idCartao).collection('rating').where("idUserThatGiveStar", "==", currentUser.uid).onSnapshot(documentSnapshot => {
       let usersThatVoted = []
       documentSnapshot.forEach(function(doc) {
         usersThatVoted.push({
           idCartao: doc.data().idCartao,
           idUserThatGiveStar: doc.data().idUserThatGiveStar,
           starRating: doc.data().starRating,
         })
       })
       console.log('LISTA DOS CARTOES COMAPTIVEIS ESTRELA: ' + usersThatVoted)
 
       e.setState({usersThatVotedFirebase: usersThatVoted})
     })
  }



  function myFunc(total, num) {
    return total + num;
  }

  await firebase.firestore().collection('cartoes').doc(idCartao).collection('rating').onSnapshot(documentSnapshot => {
    let usersThatVoted2 = []
    documentSnapshot.forEach(function(doc) {
      usersThatVoted2.push({
        idCartao: doc.data().idCartao,
        idUserThatGiveStar: doc.data().idUserThatGiveStar,
        starRating: doc.data().starRating,
      })
    })
    console.log('LISTA DOS CARTOES COMAPTIVEIS ESTRELA: ' + usersThatVoted2)

    //salvar os valores de estrelas em uma lista separada
    usersThatVoted2.map((l) => (
     arraySumStars.push(l.starRating)
    ))
    
    if(usersThatVoted2.length == 0) {
      e.setState({media: 0})
    } else {
      let medium = arraySumStars.reduce(myFunc) / arraySumStars.length
      e.setState({notaMedia: medium})
      console.log('MEDIA AVALIAÇÃO: ' + e.state.notaMedia)
      //atualiza a media do anuncio
      firebase.firestore().collection('anuncios').doc(idCartao).update({
        media: medium
      })
    }
  })


  //pega os usuarios que comentaram
  firebase.firestore().collection('cartoes').doc(idCartao).collection('comments').onSnapshot(documentSnapshot => {
    let comentarios = []
    documentSnapshot.forEach(function(doc) {
      comentarios.push({
        idCartao: doc.data().idCartao,
        idUserThatComment: doc.data().idUserThatComment,
        comment: doc.data().comment,
        nomeUser: doc.data().nomeUser,
        photoUser: doc.data().photoUser
      })
    })
    console.log('LISTA DOS CARTOES COMAPTIVEIS ESTRELA COMMENTS: ' + comentarios)

    e.setState({usersThatCommented: comentarios})
  })
  

  if(currentUser == null) {
    e.setState({usersThatVotedFirebase: []})
  } else {
    //pega a imagem e nome da pessoa logada
    await firebase.firestore().collection('usuarios').doc(currentUserUID).onSnapshot(documentSnapshot => {
          e.setState({fotoUser: documentSnapshot.data().photoProfile}),
          e.setState({nomeUser: documentSnapshot.data().nome})
    })
    
    await firebase.firestore().collection('usuarios').doc(currentUser.uid).onSnapshot(documentSnapshot => {
      if(documentSnapshot.data().userLocation){
        e.setState({userLocation: documentSnapshot.data().userLocation})
        e.setState({enderecoUser: documentSnapshot.data().userLocation})

        console.log(`LOCATION1: ` + e.state.userLocation + "LOCATION2: " + e.state.enderecoUser)
      } else {
        return null;
      }
    })
  }

    console.log('ARRAY ANUNCIO cartaoEstab: ' + this.state.cartaoEstab)
    console.log('ARRAY ANUNCIO autonomo: ' + this.state.cartaoAuto)


    
  }






  openModalize() {
    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };


  shareIcon = async () => {
    try {
      const result = await Share.share({
        title: 'WeWo - Onde Todos se Encontram',
        message:
          'Veja esse cartão de visita incrível que achei no WeWo!  (WeWo - Onde Todos se Encontram)    https://play.google.com/store/apps/details?id=com.zubito.wewo'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  onPressAddToFavorites = () => {
    const {favorite} = this.state;

    this.setState({
      favorite: !favorite,
    });
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

  
  openModalizeLocation() {
    const modalizeLocation = this.state.modalizeLocation;

    modalizeLocation.current?.open()
  }



  openModalizeDisponibilidade() {
    const modalizeRefDisponibilidade = this.state.modalizeRefDisponibilidade;

    modalizeRefDisponibilidade.current?.open()
  }

  openModalizeFrete(item, cepEx) {
    const modalizeRefFrete = this.state.modalizeRefFrete;
    modalizeRefFrete.current?.open();

    
    var endereco = this.state.enderecoUser;
    var resultado = endereco.substring(endereco.indexOf("(") + 1);
    var removeParetensis = resultado.replace(')', '');
    var removeTrac = removeParetensis.replace('-', '');
    var removeTracOfItem = item.cep.replace('-', '');

    
    if(cepEx == null) {
      fetch(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?sCepOrigem=${removeTracOfItem}&sCepDestino=${removeTrac}&nVlPeso=${item.pesoEnc}&nCdFormato=${item.formEnc}&nVlComprimento=${item.comprimentoEnc}&nVlAltura=${item.alturaEnc}&nVlLargura=${item.larguraEnc}&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=04510&nVlDiametro=${item.diametroEnc}&StrRetorno=xml`)
      .then((response) => response.text())
      .then((textResponse) => {
        let obj = parse(textResponse);
        let Codigo = obj.Servicos.cServico.Codigo;
        let Valor = obj.Servicos.cServico.Valor;
        let PrazoEntrega = obj.Servicos.cServico.PrazoEntrega;
        let ValorSemAdicionais = obj.Servicos.cServico.ValorSemAdicionais;
        let ValorMaoPropria = obj.Servicos.cServico.ValorMaoPropria;
        let ValorAvisoRecebimento = obj.Servicos.cServico.ValorAvisoRecebimento;
        let ValorValorDeclarado = obj.Servicos.cServico.ValorValorDeclarado;
        let EntregaDomiciliar = obj.Servicos.cServico.EntregaDomiciliar;
        let EntregaSabado = obj.Servicos.cServico.EntregaSabado;
        let Erro = obj.Servicos.cServico.MsgErro;
        
        this.setState({codigoCorreios: Codigo})
        this.setState({valorFrete: Valor})
        this.setState({prazoEntrega: PrazoEntrega})
        this.setState({erroFrete: Erro})
        this.setState({item: item})
        
        console.log(`${Codigo} \n${Valor} \n${PrazoEntrega} \n${ValorSemAdicionais} \n${ValorMaoPropria} \n${ValorAvisoRecebimento} \n${ValorValorDeclarado} \n${EntregaDomiciliar} \n ${EntregaSabado} \n${Erro}`)
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      var removeTraco = cepEx.replace('-','');
      
      fetch(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?sCepOrigem=${removeTracOfItem}&sCepDestino=${removeTraco}&nVlPeso=${item.pesoEnc}&nCdFormato=${item.formEnc}&nVlComprimento=${item.comprimentoEnc}&nVlAltura=${item.alturaEnc}&nVlLargura=${item.larguraEnc}&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=04510&nVlDiametro=${item.diametroEnc}&StrRetorno=xml`)
      .then((response) => response.text())
      .then((textResponse) => {
        let obj = parse(textResponse);
        let Codigo = obj.Servicos.cServico.Codigo;
        let Valor = obj.Servicos.cServico.Valor;
        let PrazoEntrega = obj.Servicos.cServico.PrazoEntrega;
        let ValorSemAdicionais = obj.Servicos.cServico.ValorSemAdicionais;
        let ValorMaoPropria = obj.Servicos.cServico.ValorMaoPropria;
        let ValorAvisoRecebimento = obj.Servicos.cServico.ValorAvisoRecebimento;
        let ValorValorDeclarado = obj.Servicos.cServico.ValorValorDeclarado;
        let EntregaDomiciliar = obj.Servicos.cServico.EntregaDomiciliar;
        let EntregaSabado = obj.Servicos.cServico.EntregaSabado;
        let Erro = obj.Servicos.cServico.MsgErro;
        
        this.setState({codigoCorreios: Codigo})
        this.setState({valorFrete: Valor})
        this.setState({prazoEntrega: PrazoEntrega})
        this.setState({erroFrete: Erro})
        this.setState({item: item})
        
        console.log(`${Codigo} \n${Valor} \n${PrazoEntrega} \n${ValorSemAdicionais} \n${ValorMaoPropria} \n${ValorAvisoRecebimento} \n${ValorValorDeclarado} \n${EntregaDomiciliar} \n ${EntregaSabado} \n${Erro}`)
      })
      .catch((error) => {
        console.log(error);
      });
    }

    console.log("ITEM: " + JSON.stringify(item) + '\n CEP: ' + removeTrac)
  }

/*
  openPhoneApp(phone) {
    Linking.openURL(`tel:${phone}`)
  }

  openWhatsApp(phone) {
    Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
      if (supported) {
        return Linking.openURL(
          `whatsapp://send?phone=55${phone}&text=Olá, ${this.props.route.params.nomeToZap} te vi no WeWo e Tenho Interesse no Seu Trabalho`
        );
      } else {
        return Linking.openURL(
          `https://api.whatsapp.com/send?phone=55${phone}&text=Olá, ${this.props.route.params.nomeToZap} te vi no WeWo e Tenho Interesse no Seu Trabalho`
        );
      }
    })
  }

*/

  async finishRating(idCartao, numberOfStar) {
    let currentUser = firebase.auth().currentUser;

    if(currentUser !== null) {
      if(this.state.usersThatVotedFirebase.length == 0) {
        //salva o usuario que votou e qual a qtd de estrelas que ele deu
        firebase.firestore().collection('cartoes').doc(idCartao).collection('rating').doc(currentUser.uid).set({
          idCartao: this.props.route.params.idCartao,
          idUserThatGiveStar: currentUser.uid,
          starRating: numberOfStar,
        })
  
        this.AlertPro3.open()
      } else {
        this.AlertPro4.open()
      }
    } else {
      this.AlertPro5.open()
    }
  }


  async registerComment(text) {
    let currentUser = firebase.auth().currentUser;
    let idCartao = this.props.route.params.idDoCartao;
    let e = this;

    try {
      await firebase.firestore().collection('cartoes').doc(idCartao).collection('comments').doc(currentUser.uid).set({
        idCartao: this.props.route.params.idCartao,
        photoUser: e.state.fotoUser,
        nomeUser: e.state.nomeUser,
        idUserThatComment: currentUser.uid,
        comment: text,
      })

      this.AlertPro6.open();
      e.setState({text: ''})
    } catch (error) {
      alert('Ops, ocorreu um erro ao salvar seu comentário :/')
    }
  }


  setValueToQtd(operation) {
    if(operation == 'sum') {
      this.setState({qtd: this.state.qtd + 1})
    }

    if(operation == 'sub') {
      this.setState({qtd: this.state.qtd - 1})
    }

    if(operation == 'sub' && this.state.qtd <= 0) {
      this.setState({qtd: 0})
    }
  }



  getLocationGPSorText(item) {
    //pede ao usuario para habilitar os serviços de localização
    this.CheckIfLocationEnabled();
    this.openModalizeLocation();
    this.setState({item: item})
  }


  async saveProductInFirebase(item) {
    let e = this;
    let idProduct = e.makeid(22);
    let currentUser = firebase.auth().currentUser;

    const {nomeEnd, cepEnd, endereco, numeroEnd, complementoEnd, bairroEnd, cidadeEnd, estadoEnd} = this.state; 
    
    if(nomeEnd !== '' && cepEnd !== '' && endereco !== '' && numeroEnd !== '' && complementoEnd !== '' && bairroEnd !== '' && cidadeEnd !== '' && estadoEnd !== '') {
      let address = `${nomeEnd}, ${endereco}, ${bairroEnd}, ${cidadeEnd}, ${estadoEnd} (${cepEnd})`
      this.setState({enderecoUser: address})
    } else {
      this.AlertPro13.open()
    }

      if(this.state.enderecoUser !== null) {
        
        await firebase.firestore().collection('usuarios').doc(currentUser.uid).onSnapshot(documentSnapshot => {
          if(currentUser !== null) {
            if(this.state.qtd > 0){
              if(currentUser.uid == item.idUser){
                this.AlertPro8.open();
              } else {
              e.setModalVisible(true)
              firebase.firestore().collection('products').doc(idProduct).set({
                idDonoDoProduto: item.idUser,
                idComprador: currentUser.uid,
                idProduct: idProduct,
                idCartao: e.state.idCartao,
                fotoUsuarioLogado: item.fotoUsuarioLogado,
                fotoUsuarioComprador: documentSnapshot.data().photoProfile,
                fotoProduto: item.photo2,
                quantidade: e.state.qtd,
                valorProduto: item.value,
                valorFrete: e.state.valorFrete,
                tituloProduto: item.title,
                nomeUsuario: e.state.nomeUser,
                nomeUsuarioComprador: documentSnapshot.data().nome,
                enderecoComprador: e.state.enderecoUser,
                status: 'pending'
              })

              firebase.firestore().collection('usuarios').doc(currentUser.uid).update({
                userLocation: e.state.enderecoUser,
              })
              

                e.setModalVisible(false)
                this.AlertPro7.open();
                e.props.navigation.navigate('Checkout')
            }
          } else {
            this.AlertPro9.open();
          }
          } else {
            this.AlertPro10.open();
          }
      
        })
      } else {
        return null
      }
      
    }


  onChangeNomeEnd(text) {
    this.setState({nomeEnd: text})
  }

  onChangeCEPEnd(text) {
    this.setState({cepEnd: text})
  }

  onChangeEnderecoEnd(text) {
    this.setState({endereco: text})
  }

  onChangeNumeroEnd(text) {
    this.setState({numeroEnd: text})
  }

  onChangeComplementoEnd(text) {
    this.setState({complementoEnd: text})
  }

  onChangeBairroEnd(text) {
    this.setState({bairroEnd: text})
  }

  onChangeCidadeEnd(text) {
    this.setState({cidadeEnd: text})
  }

  onChangeEstadoEnd(text) {
    this.setState({estadoEnd: text})
  }


  render() {
    const {product, favorite, cartaoAuto, cartaoEstab, isFetched, qtd} = this.state;
    const {
      images,
    } = product;
    const usuarioEstado = firebase.auth().currentUser;

    return (
      <SafeAnuncioView>

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
            this.AlertPro3 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro3.close()}
          title="Tudo certo ;)"
          message="Avaliação salva com sucesso!"
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
          title="Opa, algo deu errado"
          message="O serviço já foi avaliado! Você não pode avaliar mais de uma vez!"
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
          showCancel={false}
          onConfirm={() => this.AlertPro5.close()}
          title="Opa, algo deu errado"
          message="Você só pode avaliar depois de fazer o login!"
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
            this.AlertPro6 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro6.close()}
          title="Tudo certo ;)"
          message="Comentário salvo com sucesso!"
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
          title="Deu tudo certo!"
          message="O produto foi adicionado ao carrinho"
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
          showCancel={false}
          onConfirm={() => this.AlertPro8.close()}
          title="Ops, algo deu errado!"
          message="Você não pode comprar nada de si mesmo"
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
            this.AlertPro9 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro9.close()}
          title="Ops, algo deu errado!"
          message="Você não pode comprar 0 quantidades de algo ;)"
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
            this.AlertPro10 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro10.close()}
          title="Ops, algo deu errado!"
          message="Você precisa estar logado para comprar um produto"
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
            this.AlertPro11 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro11.close()}
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
            this.AlertPro12 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro12.close()}
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
            this.AlertPro13 = ref;
          }}
          showCancel={false}
          onConfirm={() => this.AlertPro13.close()}
          title="OPS!"
          message="Por favor, preencha todos os campos do seu endereço"
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
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />


        <FlatList
            keyExtractor={() => this.makeid(17)}
            data={cartaoAuto}
            renderItem={({item}) => 
              <View>
                <View style={styles.swiperContainer}>
                  <Swiper
                    loop={false}
                    paginationStyle={styles.paginationStyle}
                    activeDotStyle={styles.activeDot}
                    dotStyle={styles.dot}
                    index={isRTL ? images.length - 1 : 0}>
                        {item.video == null ?
                          <Image
                          source={{uri: item.photo}}
                          style={styles.slideImg}
                          />
                          :
                          <Video 
                            source={{ uri: item.video }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={styles.slideImg}
                          />
                        }

                        <Image
                          source={{uri: item.photo2}}
                          style={styles.slideImg}
                        />

                        <Image
                          source={{uri: item.photo3}}
                          style={styles.slideImg}
                        />
                  </Swiper>

                  <ButtonIconContainer style={{borderRadius:10}}>
                    <TouchableItem onPress={this.goBack} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={CLOSE_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>

                  <ButtonIconContainer style={{marginTop:50, borderRadius:10}}>
                    <TouchableItem onPress={this.shareIcon} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={SHARE_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>

                </View>

                  <View style={styles.descriptionContainer}>
                      <View style={styles.productTitleContainer}>
                            <Heading>{item.nome}</Heading>
                      </View>
                  </View>

                  <View style={styles.descriptionContainer}>
                    <TextDescription>{item.description}</TextDescription>
                  </View>



                  <View style={styles.pickerGroup}>
                    <View style={styles.pickerContainer}>
                      <TextDescription2 style={styles.caption}>Informações do Autônomo:</TextDescription2>
                    </View>
                  </View>

                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </View>


                  <ViewComment>
                      <ReviewView>
                        <AirbnbRating
                          count={5}
                          reviews={["Horrível", "Ruim", "OK", "Bom", "Incrível"]}
                          defaultRating={Math.round(this.state.notaMedia)}
                          size={15}
                          onFinishRating={(number) => this.finishRating(item.idCartao, number)}
                          />

                        <TextDescription2>Média: {(this.state.notaMedia).toFixed(1)}</TextDescription2>

                        <TouchableOpacity style={{marginTop:7}} onPress={() => this.openModalize()}>
                          <IconResponsiveNOBACK style={{marginTop:15}} name="comments" size={17}/>
                        </TouchableOpacity>
                      </ReviewView>
                      
                  </ViewComment>

                  {this.state.dateAuto == '' ? 
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateEstab}</TextDescription>
                      </View>
                    :
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateAuto}</TextDescription>
                      </View>
                  }

                </View>
            }
          />







          {/*Modalize do CEP*/}
          <Modalize
            ref={this.state.modalizeLocation}
            snapPoint={400}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{flex:1,alignItems:'center', flexDirection:'column'}}>
                <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, color:'#fff'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000'}}>Localização</Text>
                
                {this.state.enderecoUser == null ?
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>Nenhum endereço encontrado</Text>
                :
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>{this.state.enderecoUser}</Text>  
                }

                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this.GetCurrentLocation()} style={{alignItems:'center', justifyContent:'center', marginTop:10, marginRight:15, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="search-location" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({enderecoUser: null})} style={{alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="times-circle" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({enderecoUser: 'Digite seu Endereço'})} style={{marginLeft: 15, alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="pencil-alt" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  
                </View>
              
              {this.state.enderecoUser == 'Digite seu Endereço' && 
                <View style={{flexDirection:"column", marginTop:10}}>
                  <InputForm
                    value={this.state.nomeEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeNomeEnd(text)}
                    maxLength={20}
                    placeholder="Nome para o endereço"
                  />

                  <InputFormMask
                    type={'zip-code'}
                    value={this.state.cepEnd}
                    onChangeText={text => this.onChangeCEPEnd(text)}
                    keyboardType={"number-pad"}
                    placeholder="Digite o CEP"
                  />

                  <InputForm
                    value={this.state.endereco}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeEnderecoEnd(text)}
                    maxLength={20}
                    placeholder="Endereço. ex: Rua das Flores"
                  />

                  <InputForm
                    value={this.state.numeroEnd}
                    keyboardType={"number-pad"}
                    onChangeText={text => this.onChangeNumeroEnd(text)}
                    maxLength={20}
                    placeholder="Número do Endereço"
                  />

                  <InputForm
                    value={this.state.complementoEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeComplementoEnd(text)}
                    maxLength={20}
                    placeholder="Complemento"
                  />

                  <InputForm
                    value={this.state.bairroEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeBairroEnd(text)}
                    maxLength={20}
                    placeholder="Bairro"
                  />

                  <InputForm
                    value={this.state.cidadeEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeCidadeEnd(text)}
                    maxLength={20}
                    placeholder="Cidade"
                  />

                  <InputForm
                    value={this.state.estadoEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeEstadoEnd(text)}
                    maxLength={20}
                    placeholder="Estado"
                  />


                  <TouchableOpacity onPress={() => this.openModalizeFrete(this.state.item, this.state.cepEnd)} style={{paddingHorizontal: 23, height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d', marginTop:30}}>
                    <IconResponsive name="check" size={30}/>
                    <Text style={{color: this.context.dark ? 'white' : '#121212', fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
                


              }


            </View>
                 

            <View>
              <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#fff', textAlign:'center'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000', textAlign:'center'}}>Por favor, verifique se as informações conferem, caso não, pesquise o endereço novamente</Text>
            </View>
          </Modalize>



          {/*Modalize mostra frete, valor e prazo*/}
          <Modalize
            ref={this.state.modalizeRefFrete}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40, paddingHorizontal: windowWidth/5}}>
              <Text style={{textAlign:"center"}}>Informações do Frete (no momento só é possível usar os Correios como preço base para o frete)</Text>
            </View>

            <View style={{marginHorizontal: windowWidth/10, marginTop:50, justifyContent:'space-between', backgroundColor:"#3f3f3f", padding: 30, borderRadius: 20}}>
              <Text style={{fontSize:19, color:'#fff'}}>Código: {this.state.codigoCorreios}</Text>
              <Text style={{fontSize:19, color:'#fff'}}>Valor do Frete: R${this.state.valorFrete}</Text>
              <Text style={{fontSize:19, color:'#fff'}}>Prazo de Entrega: {this.state.prazoEntrega} dias</Text>

              {this.state.erroFrete == '' ? 
                <TouchableOpacity onPress={() => this.saveProductInFirebase(this.state.item)} style={{height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', justifyContent:"center", backgroundColor:'#d98b0d', marginTop:30}}>
                  <IconResponsive name="check" size={30}/>
                  <Text style={{color: this.context.dark ? 'white' : '#121212', fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
              :
                <Text>Erro: {this.state.erroFrete}</Text>
              }

            </View>
          </Modalize>



          {/*Modalize dos comentários*/}
          <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40}}>
            <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Comentários</Heading6>
                <View style={{marginTop:7,maxWidth: windowWidth - 60}}>
                     {usuarioEstado == null &&
                        <View style={{marginTop:20}}></View>
                      }


                      {usuarioEstado !== null &&
                        <View>
                          <TextInput
                            multiline
                            placeholder="Deixe o seu comentário..."
                            numberOfLines={3}
                            placeholderTextColor={this.context.dark ? "#fff" : "#000"}
                            style={{borderWidth:3, borderColor: '#DAA520', borderRadius:20, padding:10}}
                            maxLength={255}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                          />
                          <SignUpBottom onPress={() => this.registerComment(this.state.text)} style={{marginTop:20, marginLeft:windowWidth/2}}>
                            <Text style={{fontWeight:'bold', color:'#fff'}}>Enviar</Text>
                          </SignUpBottom>

                          <View style={{marginTop:50}}></View>
                        </View>
                      }
                      <FlatList
                        keyExtractor={() => this.makeid(17)}
                        data={this.state.usersThatCommented}
                        renderItem={({item}) => 
                          <View style={{flex:1, marginTop: 20}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                              <Image source={{uri: item.photoUser}} style={{width:37, height:37, borderRadius:30}}/>
                              <Text style={this.context.dark ? {fontWeight:'bold', marginLeft:10, color:'#fff'} : {fontWeight:'bold', marginLeft:10, color:'#000'}}>{item.nomeUser}</Text>
                            </View>
                            <Text style={this.context.dark ? {color:'#fff'} : {color:'#000'}}>{item.comment}</Text>
                          </View>
                        }
                      />
                </View>
            </View>
          </Modalize>








        <FlatList
            keyExtractor={() => this.makeid(17)}
            data={cartaoEstab}
            renderItem={({item}) => 
              <View>
                <View style={styles.swiperContainer}>
                  <Swiper
                    loop={false}
                    paginationStyle={styles.paginationStyle}
                    activeDotStyle={styles.activeDot}
                    dotStyle={styles.dot}
                    index={isRTL ? images.length - 1 : 0}>
                      {item.video == null ?
                          <Image
                          source={{uri: item.photo}}
                          style={styles.slideImg}
                          />
                          :
                          <Video 
                            source={{ uri: item.video }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={styles.slideImg}
                          />
                      }

                      <Image
                        source={{uri: item.photo2}}
                        style={styles.slideImg}
                      />

                      <Image
                        source={{uri: item.photo3}}
                        style={styles.slideImg}
                      />
                  </Swiper>

                  <ButtonIconContainer style={{borderRadius:10}}>
                    <TouchableItem onPress={this.goBack} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={CLOSE_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>

                  <ButtonIconContainer style={{marginTop:50, borderRadius:10}}>
                    <TouchableItem onPress={this.shareIcon} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={SHARE_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>

                </View>

                  <View style={styles.descriptionContainer}>
                      <View style={styles.productTitleContainer}>
                            <Heading>{item.title}</Heading>
                            <ValueFieldPrincipal style={{fontSize: 18, color: this.context.dark ? '#d98b0d': 'white', marginBottom:30, marginTop: 10, opacity:0.8, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', padding:5, borderRadius:10, overflow: Platform.OS === "ios" ? "hidden" : null}}>A partir de {item.value}</ValueFieldPrincipal>
                      </View>
                  </View>

                  <View style={styles.descriptionContainer}>
                    <TextDescription>{item.description}</TextDescription>
                  </View>



                  <View style={styles.pickerGroup}>
                    <View style={styles.pickerContainer}>
                      <TextDescription2 style={styles.caption}>Informações do Estabelecimento:</TextDescription2>
                    </View>
                  </View>

                  {item.local == null ?
                    <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15}}>Remoto</TextTheme>
                    </View>
                  :
                    <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.local}</TextTheme>
                    </View>
                  }


                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </View>
                  
                  <View style={{paddingHorizontal: 16, marginTop:50, flexDirection:'row', alignItems: 'center'}}>
                    <View style={{flexDirection:'column', marginRight:30}}>
                      <TouchableOpacity onPress={() => this.setValueToQtd('sum')} style={{backgroundColor:"#d98b0d", width:40, height:40, borderRadius:40, alignItems:"center", justifyContent:'center', elevation:10}}>
                        <IconResponsive name="plus" size={20}/>
                      </TouchableOpacity>

                      <TextTheme style={{fontSize:15, marginLeft: 15, marginTop:10}}>{qtd}</TextTheme>
                      
                      <TouchableOpacity onPress={() => this.setValueToQtd('sub')} style={{backgroundColor:"#d98b0d", marginTop:10, width:40, height:40, borderRadius:40, alignItems:"center", justifyContent:'center', elevation:10}}>
                        <IconResponsive name="minus" size={20}/>
                      </TouchableOpacity>
                    </View>

                    {this.state.userLocation == '' ?
                      <TouchableOpacity onPress={() => this.getLocationGPSorText(item)} style={{paddingHorizontal: 23, height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d'}}>
                            <IconResponsive name="shopping-cart" size={30}/>
                            <TextTheme style={{fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Adicionar ao carrinho</TextTheme>
                      </TouchableOpacity>
                      : 
                      <TouchableOpacity onPress={() => this.openModalizeFrete(item, null)} style={{paddingHorizontal: 23, height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d'}}>
                            <IconResponsive name="shopping-cart" size={30}/>
                            <TextTheme style={{fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Adicionar ao carrinho</TextTheme>
                      </TouchableOpacity>
                    }

                  </View>
          
                  <ViewComment>
                      <ReviewView>
                        <AirbnbRating
                          count={5}
                          reviews={["Horrível", "Ruim", "OK", "Bom", "Incrível"]}
                          defaultRating={Math.round(this.state.notaMedia)}
                          size={15}
                          onFinishRating={(number) => this.finishRating(item.idCartao, number)}
                          />

                        <TextDescription2>Média: {(this.state.notaMedia).toFixed(1)}</TextDescription2>

                        <TouchableOpacity style={{marginTop:7}} onPress={() => this.openModalize()}>
                          <IconResponsiveNOBACK style={{marginTop:15}} name="comments" size={17}/>
                        </TouchableOpacity>
                      </ReviewView>
                      
                  </ViewComment>


                  {this.state.dateAuto == '' ? 
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateEstab}</TextDescription>
                      </View>
                    :
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateAuto}</TextDescription>
                      </View>
                  }

            </View>
            }
          />


      </SafeAnuncioView>
    );
  }
}
