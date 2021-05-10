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

import { SafeAnuncioView, SignUpBottom, IconResponsiveNOBACK, ValueFieldPrincipal, ViewComment, ReviewView,  TouchableResponsive, ButtonIconContainer, IconResponsive, Heading, TextDescription, TextTheme, TextDescription2 } from '../home/styles';

import { Modalize } from 'react-native-modalize';

import { ThemeContext } from '../../../ThemeContext';

import {Heading6} from '../../components/text/CustomText';

//import IAP API 
import {purchased} from '../../config/purchase';

import LottieView from 'lottie-react-native';

import AlertPro from "react-native-alert-pro";

import loading from '../../../assets/loading.json';

//import ADS
import { AdMobBanner} from 'expo-ads-admob';

import { Video } from 'expo-av';

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
export default class MostrarCartao extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      horario: '',
      cartaoAuto:[],
      cartaoEstab:[],
      purchased: false,
      modalizeRef: React.createRef(null),
      modalizeRefDisponibilidade: React.createRef(null),
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
    };
  }

  async componentDidMount() {
    let e = this;
    
    if(Platform.OS === "android") {
      let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto')
    
      if(comprou == true) {
        this.setState({purchased: true})
      } else {
        this.setState({purchased: false})
      }
    }

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
          valueServiceEstab: doc.data().valueServiceEstab
        })
        dataAtual = doc.data().publishData
      })
      e.setState({cartaoEstab: cartaoEstabDidMount})
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

  

  openModalizeDisponibilidade() {
    const modalizeRefDisponibilidade = this.state.modalizeRefDisponibilidade;

    modalizeRefDisponibilidade.current?.open()
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



  async saveProductInFirebase(item) {
    let e = this;
    let idProduct = e.makeid(22);
    let currentUser = firebase.auth().currentUser;

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
            fotoUsuarioLogado: item.fotoUsuarioLogado,
            fotoUsuarioComprador: documentSnapshot.data().photoProfile,
            fotoProduto: item.photo2,
            quantidade: e.state.qtd,
            valorProduto: item.value,
            tituloProduto: item.title,
            nomeUsuario: e.state.nomeUser,
            nomeUsuarioComprador: documentSnapshot.data().nome,
            status: 'pending'
          })
          e.setModalVisible(false)
          e.AlertPro7.open();
          e.props.navigation.navigate('Checkout')
        }
      } else {
        this.AlertPro9.open();
      }
    } else {
      this.AlertPro10.open();
    }
    
  })
   
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



        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <ScrollView>

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


                { this.state.purchased == true &&
                  null
                }
                </View>
            }
          />

        </ScrollView>





          {/*Modalize do Calendário*/}
          <Modalize
            ref={this.state.modalizeRefDisponibilidade}
            snapPoint={250}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40}}>
              <Heading6 style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, color:'#fff'} : {fontWeight:'bold', marginLeft: 10, color:'#000'}}>Disponibilidade</Heading6>
              {this.state.cartaoAuto.length !== 0 &&
                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.cartaoAuto}
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

              {this.state.cartaoEstab.length !== 0 &&
                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.cartaoEstab}
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









        <ScrollView>

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

                  <ValueFieldPrincipal style={{fontSize: 18, color: this.context.dark ? '#d98b0d': 'white', position:'absolute', bottom: windowHeight/3.9, opacity:0.8, left: windowWidth/3.7, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', padding:5, borderRadius:10}}>Valor: {item.valueServiceEstab}</ValueFieldPrincipal>
                  
                </View>

                  <View style={styles.descriptionContainer}>
                      <View style={styles.productTitleContainer}>
                            <Heading>{item.title}</Heading>
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

                    <TouchableOpacity onPress={() => this.saveProductInFirebase(item)} style={{paddingHorizontal: 23, height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d'}}>
                          <IconResponsive name="shopping-cart" size={30}/>
                          <TextTheme style={{fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Adicionar ao carrinho</TextTheme>
                    </TouchableOpacity>
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

                { this.state.purchased == true &&
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
