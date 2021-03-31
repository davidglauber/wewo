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
  StatusBar,
  TextInput,
  Modal,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Share,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';


//import linking
import * as Linking from 'expo-linking';


import { PulseIndicator } from 'react-native-indicators';

// import components
import IconMain from '../../components/icon/IconMain';

import TouchableItem from '../../components/TouchableItem';

//importa estrela de voatação
import { Rating, AirbnbRating } from 'react-native-ratings';

// import colors
import Colors from '../../theme/colors';

//import firebase
import firebase from '../../config/firebase';

//import icons
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAnuncioView, ValueFieldPrincipal, ViewComment, ReviewView, TextDetails, CategoryAndSub, TouchableResponsive, SignUpBottom, IconResponsiveNOBACK, ButtonIconContainer, CallAndMessageContainer, IconResponsive, Heading, TextDescription, TextTheme, TextDescription2 } from '../home/styles';

import {Heading6} from '../../components/text/CustomText';

import { ThemeContext } from '../../../ThemeContext';

import { Modalize } from 'react-native-modalize';


import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//import IAP API 
import {purchased} from '../../config/purchase';


//import ADS
import { AdMobBanner} from 'expo-ads-admob';

import { Video } from 'expo-av';


// ProductA Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const CLOSE_ICON = IOS ? 'ios-close' : 'md-close';
const SHARE_ICON = IOS ? 'ios-share' : 'md-share';
const PORTFOLIO_ICON = IOS ? 'md-bookmarks' : 'md-bookmarks';
const FAV_ICON = IOS ? 'heart' : 'heart';
const imgHolder = require('../../assets/img/confeiteira.jpeg');

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  productTitleContainer: {
    flexDirection: 'row',
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
export default class TelaAnuncio extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      horario: '',
      anuncioAuto:[],
      anuncioEstab:[],
      cartoesAuto: [],
      cartoesEstab: [],
      modalVisible: true,
      purchased: false,
      usersThatVotedFirebase: [],
      mediaAvaliacao: [],
      modalizeRef: React.createRef(null),
      modalizeRefDisponibilidade: React.createRef(null),
      modalizeRefPortfolio: React.createRef(null),
      notaMedia: 0,
      fotoUser: '',
      nomeUser:'',
      textPortfolio: '',
      text:'',
      usersThatCommented: [],
      product: {
        images: [
          require('../../assets/img/confeiteira.jpeg'),
        ],
      },
      phoneNavigator: this.props.route.params.phoneNumberNavigator,
      dateAuto:'',
      dateEstab:'',
      isFetched: false,
      emailDoContratante: '',
      fotoDoContratante:'',
      nomeDoContratante:'',
      telefoneDoContratante:''
    };
  }


  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  async componentDidMount() {
    let e = this;
    
    if(Platform.OS === "android") {
      let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual')
    
      if(comprou == true) {
        this.setState({purchased: true})
      } else {
        this.setState({purchased: false})
      }
    }

    let idDoAnuncio = this.props.route.params.idDoAnuncio;
    let currentUserUID = this.props.route.params.idUserCartao;
    let currentUser = firebase.auth().currentUser;
    let arraySumStars = [];

    console.log('ID DO ANUNCIO: ' + idDoAnuncio)
    console.log('Numero de telefone: ' + this.state.phoneNavigator)
    console.log('DATA ATUAL: ' + this.state.dateAuto)

    await firebase.firestore().collection(`usuarios`).doc(`${currentUserUID}`).collection('anuncios').where("idAnuncio", "==", idDoAnuncio).where("type", "==", "Autonomo").get().then(function(querySnapshot){
      let anuncioAutoDidMount = []
      let dataAtual = ''
      querySnapshot.forEach(function(doc) {
        anuncioAutoDidMount.push({
          idUser: doc.data().idUser,
          publishData: e.state.date,
          value: doc.data().valueServiceAuto,
          idAnuncio: doc.data().idAnuncio,
          nome: doc.data().nome,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          photo2: doc.data().photoPublish2,
          photo3: doc.data().photoPublish3,
          phone: doc.data().phoneNumberAuto,
          title: doc.data().titleAuto,
          local: doc.data().localAuto,
          categoria: doc.data().categoryAuto,
          subcategoria: doc.data().subcategoryAuto,
          description: doc.data().descriptionAuto,
          workDays: doc.data().workDays,
          type: doc.data().type,
          verified: doc.data().verifiedPublish,
          timeOpen: doc.data().timeOpen,
          timeClose: doc.data().timeClose,
        })
        dataAtual = doc.data().publishData
      })
      e.setState({anuncioAuto: anuncioAutoDidMount})
      e.setState({dateAuto: dataAtual})
      
      e.setModalVisible(false)
      e.setState({isFetched: true})
    })


    await firebase.firestore().collection(`usuarios`).doc(`${currentUserUID}`).collection('anuncios').where("idAnuncio", "==", idDoAnuncio).where("type", "==", "Estabelecimento").get().then(function(querySnapshot){
      let anuncioEstabDidMount = []
      let dataAtual = ''
      querySnapshot.forEach(function(doc) {
        anuncioEstabDidMount.push({
          idUser: doc.data().idUser,
          value: doc.data().valueServiceEstab,
          publishData: e.state.date,
          idAnuncio: doc.data().idAnuncio,
          video: doc.data().videoPublish,
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
          local: doc.data().localEstab,
          workDays: doc.data().workDays,
          timeClose: doc.data().timeClose
        })
        dataAtual = doc.data().publishData
      })
      e.setState({anuncioEstab: anuncioEstabDidMount})
      e.setState({dateEstab: dataAtual})

      e.setModalVisible(false)
      e.setState({isFetched: true})
    })

    await firebase.auth().onAuthStateChanged(user => {
      if(user.uid !== null || user.uid !== undefined || user.uid !== '') {
        firebase.firestore().collection('usuarios').doc(user.uid).onSnapshot(documentSnapshot => {
          console.log('User data: ', documentSnapshot.data());
          e.setState({emailDoContratante: documentSnapshot.data().email})
          e.setState({nomeDoContratante: documentSnapshot.data().nome})
          e.setState({fotoDoContratante: documentSnapshot.data().photoProfile})
          e.setState({telefoneDoContratante: documentSnapshot.data().telefone})
        })
      } 
      
      if(user.uid == null || user.uid == undefined || user.uid == ''){
        return null
      }
    })


    if(currentUser == null) {
        e.setState({usersThatVotedFirebase: []})
    } else {
      //verifica se o usuário já votou, se sim, não pode votar de novo
       firebase.firestore().collection('anuncios').doc(idDoAnuncio).collection('rating').where("idUserThatGiveStar", "==", currentUser.uid).onSnapshot(documentSnapshot => {
         let usersThatVoted = []
         documentSnapshot.forEach(function(doc) {
           usersThatVoted.push({
             idAnuncio: doc.data().idAnuncio,
             idUserThatGiveStar: doc.data().idUserThatGiveStar,
             starRating: doc.data().starRating,
           })
         })
         console.log('LISTA DOS ANUNCIOS COMAPTIVEIS ESTRELA: ' + usersThatVoted)
   
         e.setState({usersThatVotedFirebase: usersThatVoted})
       })
    }



    function myFunc(total, num) {
      return total + num;
    }

    await firebase.firestore().collection('anuncios').doc(idDoAnuncio).collection('rating').onSnapshot(documentSnapshot => {
      let usersThatVoted2 = []
      documentSnapshot.forEach(function(doc) {
        usersThatVoted2.push({
          idAnuncio: doc.data().idAnuncio,
          idUserThatGiveStar: doc.data().idUserThatGiveStar,
          starRating: doc.data().starRating,
        })
      })
      console.log('LISTA DOS ANUNCIOS COMAPTIVEIS ESTRELA: ' + usersThatVoted2)

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
        firebase.firestore().collection('anuncios').doc(idDoAnuncio).update({
          media: medium
        })
      }
      

    })



    console.log('ARRAY ANUNCIO anuncioEstab: ' + this.state.anuncioEstab)
    console.log('ARRAY ANUNCIO autonomo: ' + this.state.anuncioAuto)

    //pega os usuarios que comentaram
    firebase.firestore().collection('anuncios').doc(idDoAnuncio).collection('comments').onSnapshot(documentSnapshot => {
      let comentarios = []
      documentSnapshot.forEach(function(doc) {
        comentarios.push({
          idAnuncio: doc.data().idAnuncio,
          idUserThatComment: doc.data().idUserThatComment,
          comment: doc.data().comment,
          nomeUser: doc.data().nomeUser,
          photoUser: doc.data().photoUser
        })
      })
      console.log('LISTA DOS ANUNCIOS COMAPTIVEIS ESTRELA COMMENTS: ' + comentarios)

      e.setState({usersThatCommented: comentarios})
    })
    

    if(currentUser == null) {
      e.setState({usersThatVotedFirebase: []})
      await firebase.firestore().collection('usuarios').doc(currentUserUID).onSnapshot(documentSnapshot => {
        e.setState({fotoUser: documentSnapshot.data().photoProfile}),
        e.setState({nomeUser: documentSnapshot.data().nome}),
        e.setState({textPortfolio: documentSnapshot.data().textPortfolio})
      })
    } else {
      //pega a imagem e nome da pessoa logada
      await firebase.firestore().collection('usuarios').doc(currentUserUID).onSnapshot(documentSnapshot => {
            e.setState({fotoUser: documentSnapshot.data().photoProfile}),
            e.setState({nomeUser: documentSnapshot.data().nome}),
            e.setState({textPortfolio: documentSnapshot.data().textPortfolio})
      })
    }

    await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Autonomo").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let cartoesAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish2,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          categoria: doc.data().categoryAuto,
          phone: doc.data().phoneNumberAuto,
        })
      })
      e.setState({cartoesAuto: cartoesAutoDidMount})

    })

    await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let cartoesEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesEstabDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish2,
          local: doc.data().localEstab,
          title: doc.data().titleEstab,
          description: doc.data().descriptionEstab,
          phone: doc.data().phoneNumberEstab,
          timeOpen: doc.data().timeOpen,
          timeClose: doc.data().timeClose,
          type: doc.data().type,
          verified: doc.data().verifiedPublish,
          categoria: doc.data().categoryEstab,
          workDays: doc.data().workDays
        })
      })
      e.setState({cartoesEstab: cartoesEstabDidMount})

    })


}


  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }

  openModalizePortfolio() {
    const modalizeRefPortfolio = this.state.modalizeRefPortfolio;

    modalizeRefPortfolio.current?.open()
  }


  openModalizeDisponibilidade() {
    const modalizeRefDisponibilidade = this.state.modalizeRefDisponibilidade;

    modalizeRefDisponibilidade.current?.open()
  }

  addTOFAVFIREBASE(id, publishObj) {
    let currentUser = firebase.auth().currentUser;

    if(currentUser == null) {
      alert('Você precisa estar logado para favoritar um anúncio!')

      this.setState({isOpen: false})

      this.sleep(500).then(() => { 
        this.setState({isOpen: true})
      })
    }

    if(currentUser != null) {
      firebase.firestore().collection('usuarios').doc(currentUser.uid).collection('favoritos').doc(id).set(publishObj)
    
      this.setState({isOpen: false})

      this.sleep(500).then(() => { 
        this.setState({isOpen: true})
      })

      alert("Anúncio salvo com sucesso!")
    }
  }


  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  shareIcon = async () => {
      try {
        const result = await Share.share({
          title: 'WeWo - Onde Todos se Encontram',
          message:
            'Veja esse cartão de visita incrível que achei no WeWo!  (WeWo - Onde Todos se Encontram)    https://play.google.com/store/apps/details?id=com.zubito.wewo',
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


  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


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




  async finishRating(idDoAnuncio, numberOfStar) {
    let currentUser = firebase.auth().currentUser;

    if(currentUser !== null) {
      if(this.state.usersThatVotedFirebase.length == 0) {
        //salva o usuario que votou e qual a qtd de estrelas que ele deu
        firebase.firestore().collection('anuncios').doc(idDoAnuncio).collection('rating').doc(currentUser.uid).set({
          idAnuncio: this.props.route.params.idDoAnuncio,
          idUserThatGiveStar: currentUser.uid,
          starRating: numberOfStar,
        })
  
        alert('O serviço foi avaliado!')
      } else {
        alert('O serviço já foi avaliado! Você não pode avaliar mais de uma vez!')
      }
    } else {
      alert('Você só pode avaliar depois de fazer o login!')
    }
  }


  async registerComment(text) {
    let currentUser = firebase.auth().currentUser;
    let idDoAnuncio = this.props.route.params.idDoAnuncio;
    let e = this;

    try {
      await firebase.firestore().collection('anuncios').doc(idDoAnuncio).collection('comments').doc(currentUser.uid).set({
        idAnuncio: this.props.route.params.idDoAnuncio,
        photoUser: e.state.fotoUser,
        nomeUser: e.state.nomeUser,
        idUserThatComment: currentUser.uid,
        comment: text,
      })
      alert('Comentário salvo com sucesso!')
      e.setState({text: ''})
    } catch (error) {
      alert('Ops, ocorreu um erro ao salvar seu comentário :/')
    }
  }

  sendService(idDoContratado, service, value) {
    let userID = firebase.auth().currentUser;

    if(userID == null) {
      alert('Você não pode contratar alguém sem estar logado')
    } else if (idDoContratado == userID.uid){
      alert('Você não pode contratar a si mesmo')
    } else {
      //parâmetros que devem ser enviados ao BD: Foto, nome, CEP, Serviço que quer contratar, Valor, Telefone, Calendário
      this.props.navigation.navigate('ServiceCadaster', {
        idDoContratado: idDoContratado,
        idDoContratante: userID.uid,
        nome: this.state.nomeDoContratante,
        foto: this.state.fotoDoContratante,
        servico: service,
        telefone: this.state.telefoneDoContratante,
        valor: value,
      });
    }
  }

  render() {
    const {product, anuncioAuto, anuncioEstab, isFetched} = this.state;
    const {
      images,
    } = product;
    const usuarioEstado = firebase.auth().currentUser;
    const idDoAnuncioRoute = this.props.route.params.idDoAnuncio;
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

        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <ScrollView>

        <FlatList
            keyExtractor={() => this.makeid(17)}
            data={anuncioAuto}
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

                  <ButtonIconContainer style={{marginTop:100, borderRadius:10}}>
                    <TouchableItem onPress={() => this.openModalizePortfolio()} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={PORTFOLIO_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>


                  <ButtonIconContainer style={{marginTop:150, borderRadius:10}}>
                    <TouchableItem onPress={() => this.addTOFAVFIREBASE(idDoAnuncioRoute, item)} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={FAV_ICON}
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
                          <ValueFieldPrincipal style={{fontSize: 18}}>{item.value}</ValueFieldPrincipal>
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



                  <TouchableOpacity onPress={() => this.openModalizeDisponibilidade()} style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="clock" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15}}>Ver disponibilidade</TextTheme>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.openModalizePortfolio()} style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="user-tie" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15, marginRight: windowWidth/3}}>{item.nome}</TextTheme>
                  </TouchableOpacity>

                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                        {item.local == null ?
                          <TextTheme style={{fontSize:15, marginLeft: 15}}>Remoto</TextTheme>
                        :
                          <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.local}</TextTheme>
                        }
                  </View>

                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </View>

                  <TouchableOpacity onPress={() => this.sendService(item.idUser, item.categoria, item.value)} style={{paddingHorizontal: 73, marginLeft:30, marginRight:30, marginTop:20, height:50, borderRadius:40,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d'}}>
                        <IconResponsive name="hands-helping" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Contratar</TextTheme>
                  </TouchableOpacity>



                  <ViewComment>
                      <ReviewView>
                        <AirbnbRating
                          count={5}
                          reviews={["Horrível", "Ruim", "OK", "Bom", "Incrível"]}
                          defaultRating={this.state.notaMedia}
                          size={15}
                          onFinishRating={(number) => this.finishRating(item.idAnuncio, number)}
                          />

                        <TextDescription2>Média: {this.state.notaMedia}</TextDescription2>

                        <CallAndMessageContainer>
                          <TouchableResponsive onPress={() => this.openPhoneApp(this.state.phoneNavigator)}>
                              <IconResponsiveNOBACK name="phone" size={20}/>
                          </TouchableResponsive> 
                          
                          <TouchableResponsive onPress={() => this.openWhatsApp(this.state.phoneNavigator)}>
                              <IconResponsiveNOBACK name="comment" size={20}/>
                          </TouchableResponsive>            
                        </CallAndMessageContainer>
                        
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


              { this.state.purchased == false && Platform.OS === "android" &&
                <AdMobBanner
                  style={{marginLeft: 20}}
                  bannerSize="leaderboard"
                  adUnitID="ca-app-pub-1397640114399871/3366763355"
                  servePersonalizedAds
                  onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                /> 
              }

              { this.state.purchased == true && Platform.OS === "android" &&
                null
              }

              { this.state.purchased == false && Platform.OS === "ios" &&
                <AdMobBanner
                  style={{marginLeft: 20}}
                  bannerSize="leaderboard"
                  adUnitID="ca-app-pub-1397640114399871/5484416301"
                  servePersonalizedAds
                  onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                /> 
              }

              { this.state.purchased == true && Platform.OS === "ios" &&
                null
              }
                </View>
            }
          />

        </ScrollView>








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



          {/*Modalize do Portfolio*/}
          <Modalize
            ref={this.state.modalizeRefPortfolio}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40}}>
              <Heading6 style={this.context.dark ? {fontWeight:'bold', color:'#fff'} : {fontWeight:'bold', color:'#000'}}>Portfólio</Heading6>
              
              <Image source={{uri: this.state.fotoUser}} style={{width:60, height:60, borderRadius:50}}/>
              
              <Text style={this.context.dark ? {color:'#fff', padding:10, fontWeight:'bold', fontSize:20} : {color:'#000', padding:10, fontWeight:'bold', fontSize:20}}>{this.state.nomeUser}</Text>
              <Text style={this.context.dark ? {color:'#fff', paddingLeft:40, paddingRight:40} : {color:'#000', paddingLeft:40, paddingRight:40}}>{this.state.textPortfolio}</Text>
              
              <Heading6 style={this.context.dark ? {fontWeight:'bold', marginTop: 50, color:'#FFD700'} : {fontWeight:'bold', marginTop:50, color:'#000'}}>Mais detalhes</Heading6>
              
              
              <FlatList keyExtractor={() => this.makeid(17)} data={this.state.cartoesAuto} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{marginTop:20,flexGrow: 1, justifyContent: 'center'}} 
                renderItem={({item}) => 
                  <View style={{paddingHorizontal:100}}>
                    <View style={{backgroundColor:'#FFD700', borderRadius:30, width: windowWidth/2, height:200, alignItems:'center', paddingTop:20, justifyContent:'center'}}>
                      <FontAwesome5 style={{marginTop:7, marginBottom:7}} name="user-tie" size={20}/>
                      <Image source={{uri: item.photo}} style={{width:100, height:50, borderRadius:30}}/>
                      <Text style={{fontWeight:'bold'}}>{item.nome}</Text>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                        <FontAwesome5 style={{marginTop:35}} name="chevron-circle-up" size={30}/>
                      </TouchableOpacity>
                    </View>
                  </View>
              }
              />

              <FlatList keyExtractor={() => this.makeid(17)} data={this.state.cartoesEstab} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{marginTop:20,flexGrow: 1, justifyContent: 'center'}} 
                renderItem={({item}) => 
                  <View style={{paddingHorizontal:100}}>
                    <View style={{backgroundColor:'#FFD700', borderRadius:30, width: windowWidth/2, height:200, alignItems:'center', paddingTop:20, justifyContent:'center', paddingBottom:30}}>
                      <FontAwesome5 style={{marginTop:7, marginBottom:7}} name="briefcase" size={20}/>
                      <Image source={{uri: item.photo}} style={{width:100, height:50, borderRadius:30}}/>
                      <Text style={{fontWeight:'bold'}}>{item.title}</Text>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                        <FontAwesome5 style={{marginTop:35}} name="chevron-circle-up" size={30}/>
                      </TouchableOpacity>
                    </View>
                  </View>
              }
              />
                    

            </View>
          </Modalize>





          {/*Modalize do Calendário*/}
          <Modalize
            ref={this.state.modalizeRefDisponibilidade}
            snapPoint={250}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40}}>
              <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Disponibilidade</Heading6>
              {this.state.anuncioAuto.length !== 0 &&
                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.anuncioAuto}
                  horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{marginTop:20,flexGrow: 1, justifyContent: 'center'}} 
                  renderItem={({item}) =>
                  <View>
                  <View style={{flexDirection:'row'}}>
                    {item.workDays.includes('domingo') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, marginLeft:10, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>D</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, marginLeft:10,  alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>D</Text>
                      </View>
                    }

                    {item.workDays.includes('segunda') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }


                    {item.workDays.includes('terça') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>T</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>T</Text>
                      </View>
                    }


                    {item.workDays.includes('quarta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                    }


                    {item.workDays.includes('quinta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                    }

                    {item.workDays.includes('sexta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }

                    {item.workDays.includes('sábado') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }



                  </View>
                    <View style={{marginTop:40, marginHorizontal:100, borderWidth:3, borderColor:'#d98b0d', padding:20, borderRadius:30}}>
                      <Text style={{fontWeight:'bold', color: this.context.dark ? 'white' : 'black'}}>{item.timeOpen} - {item.timeClose}</Text>
                    </View>
                  </View>
                  }
                /> 
              }

              {this.state.anuncioEstab.length !== 0 &&
                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.anuncioEstab}
                  horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{marginTop:20,flexGrow: 1, justifyContent: 'center'}} 
                  renderItem={({item}) =>
                  <View>
                  <View style={{flexDirection:'row'}}>
                    {item.workDays.includes('domingo') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, marginLeft:10, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>D</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, marginLeft:10, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>D</Text>
                      </View>
                    }

                    {item.workDays.includes('segunda') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }


                    {item.workDays.includes('terça') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>T</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>T</Text>
                      </View>
                    }


                    {item.workDays.includes('quarta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                    }


                    {item.workDays.includes('quinta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Q</Text>
                      </View>
                    }

                    {item.workDays.includes('sexta') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }

                    {item.workDays.includes('sábado') ?
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#d98b0d'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                      :
                      <View style={{width:30, height:30, borderRadius:50, marginRight:15, alignItems:'center', justifyContent:'center', backgroundColor:'#3F3F3F'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>S</Text>
                      </View>
                    }

                  </View>
                    <View style={{marginTop:40, marginHorizontal:100, borderWidth:3, borderColor:'#d98b0d', padding:20, borderRadius:30}}>
                      <Text style={{fontWeight:'bold', color: this.context.dark ? 'white' : 'black'}}>{item.timeOpen} - {item.timeClose}</Text>
                    </View>
                  </View>
                  }
                /> 
              }

            
            </View>
          </Modalize>





        <ScrollView>

        <FlatList
            keyExtractor={() => this.makeid(17)}
            data={anuncioEstab}
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

                  <ButtonIconContainer style={{marginTop:100, borderRadius:10}}>
                    <TouchableItem onPress={() => this.openModalizePortfolio()} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={PORTFOLIO_ICON}
                          size={22}
                          color={Colors.secondaryText}
                        />
                      </View>
                    </TouchableItem>
                  </ButtonIconContainer>

                  <ButtonIconContainer style={{marginTop:150, borderRadius:10}}>
                    <TouchableItem onPress={() => this.addTOFAVFIREBASE(idDoAnuncioRoute, item)} borderless>
                      <View style={styles.buttonIconContainer}>
                        <IconMain
                          name={FAV_ICON}
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
                          <ValueFieldPrincipal style={{fontSize: 18}}>{item.value}</ValueFieldPrincipal>
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

                  <TouchableOpacity onPress={() => this.openModalizeDisponibilidade()} style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="clock" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15}}>Ver disponibilidade</TextTheme>
                  </TouchableOpacity>



                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                        {item.local == null ?
                          <TextTheme style={{fontSize:15, marginLeft: 15}}>Remoto</TextTheme>
                        :
                          <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.local}</TextTheme>
                        }
                  </View>


                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="phone-square" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.phone}</TextTheme>
                  </View>

                  <TouchableOpacity onPress={() => this.openModalizePortfolio()} style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </TouchableOpacity>


                  <ViewComment>
                      <ReviewView>
                        <AirbnbRating
                          count={5}
                          reviews={["Horrível", "Ruim", "OK", "Bom", "Incrível"]}
                          defaultRating={this.state.notaMedia}
                          size={15}
                          onFinishRating={(number) => this.finishRating(item.idAnuncio, number)}
                          />

                        <TextDescription2>Média: {this.state.notaMedia}</TextDescription2>

                        <CallAndMessageContainer>
                          <TouchableResponsive onPress={() => this.openPhoneApp(this.state.phoneNavigator)}>
                              <IconResponsiveNOBACK name="phone" size={20}/>
                          </TouchableResponsive> 
                          
                          <TouchableResponsive onPress={() => this.openWhatsApp(this.state.phoneNavigator)}>
                              <IconResponsiveNOBACK name="comment" size={20}/>
                          </TouchableResponsive>            
                        </CallAndMessageContainer>
                        
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



              { this.state.purchased == false && Platform.OS === "android" &&
                <AdMobBanner
                  style={{marginLeft: 20}}
                  bannerSize="leaderboard"
                  adUnitID="ca-app-pub-1397640114399871/3366763355"
                  servePersonalizedAds
                  onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                /> 
              }

              { this.state.purchased == true && Platform.OS === "android" &&
                null
              }

              { this.state.purchased == false && Platform.OS === "ios" &&
                <AdMobBanner
                  style={{marginLeft: 20}}
                  bannerSize="leaderboard"
                  adUnitID="ca-app-pub-1397640114399871/5484416301"
                  servePersonalizedAds
                  onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                /> 
              }

              { this.state.purchased == true && Platform.OS === "ios" &&
                null
              }
                </View>

            }
          />


        </ScrollView>

      </SafeAnuncioView>
    );
  }
}
