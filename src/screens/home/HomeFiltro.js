
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal,
  Alert,
  Text,
  Dimensions,
  Image,
  AsyncStorage,
  View,
  TouchableOpacity,
} from 'react-native';
import Color from 'color';

import {Heading6} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';


//import firebase 
import firebase from '../../config/firebase';

// HomeA Config
const imgHolder = require('../../assets/img/imgholder.png');

//CSS responsivo
import { SafeBackground, IconResponsive, AnuncioContainer, Heading, Title, ValueField, Description, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from './styles';

import { ThemeContext } from '../../../ThemeContext';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import { PulseIndicator } from 'react-native-indicators';

//import icons
import { FontAwesome5 } from '@expo/vector-icons';

import LottieView from 'lottie-react-native';

//import IAP API 
import {purchased} from '../../config/purchase';

//import ADS
import { AdMobBanner } from 'expo-ads-admob';


import { Video } from 'expo-av';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// HomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 8,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginLeft: 8,
    width: 104,
    height: 72,
    resizeMode: 'cover',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  productsList: {
    paddingBottom: 16,
    // spacing = paddingHorizontal + ActionProductCard margin = 12 + 4 = 16
    paddingHorizontal: 12,
  },
  popularProductsList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});

export default class HomeFiltro extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);

    this.state = {
      verified:false,
      status: null,
      emailUserFunction:'',
      activesPublishesAuto: [],
      activesPublishesEstab: [],
      modalVisible: true,
      purchased: false
    };
  }



  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };



  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }



async componentDidMount() {
  console.reportErrorsAsExceptions = false;
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual')

    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }
    let arrayOfSelectedCategories = this.props.route.params.categoriasFiltradas;
    let arrayOfSelectedStates = this.props.route.params.estadosFiltrados;
    let sumLengthArrays = arrayOfSelectedStates.length + arrayOfSelectedCategories.length;


    let typeRoute = this.props.route.params.type;

    console.log('ARRAY RECEBIDO DO NAVIGATOR: ' + arrayOfSelectedCategories)
    console.log('ARRAY RECEBIDO DO NAVIGATOR ESTADOS: ' + arrayOfSelectedStates)
    console.log('type RECEBIDO DO NAVIGATOR: ' + typeRoute)

    let e = this;

    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          e.setState({status: true})
          firebase.firestore().collection('usuarios').doc(user.uid).onSnapshot(documentSnapshot => {
            var removeCharacters = documentSnapshot.data().email.replace('@', '')
              let removeCharacters2 = removeCharacters.replace('gmail.com', '')
              let removeCharacters3 = removeCharacters2.replace('hotmail.com', '')
              let removeCharacters4 = removeCharacters3.replace('outlook.com', '')
              let removeCharacters5 = removeCharacters4.replace('live.com', '')
              let removeCharacters6 = removeCharacters5.replace('yahoo.com', '')

              e.setState({emailUserFunction: removeCharacters6})
              e.setState({isFetched: true})


        })
        } else {
          e.setState({status: false})
        }

    })



   let nomeUser = '';
   let emailUser = '';
   let senhaUser = '';
   let telefoneUser = '';
   let dataNascimentoUser = '';


    AsyncStorage.getItem('verified').then((value) => {
      if(value == 'true') {
        AsyncStorage.setItem('verified', JSON.stringify(true))
      }

      if(value == 'false') {
         AsyncStorage.getItem('nome').then((value) =>{nomeUser = value})
         AsyncStorage.getItem('email').then((value) =>{emailUser = value})
         AsyncStorage.getItem('senha').then((value) =>{senhaUser = value})
         AsyncStorage.getItem('telefone').then((value) =>{telefoneUser = value})
         AsyncStorage.getItem('dataNascimento').then((value) =>{dataNascimentoUser = value})

        this.props.navigation.navigate('EmailVerificacao', {
            nome: nomeUser,
            email: emailUser,
            senha: senhaUser,
            telefone: telefoneUser,
            dataNascimento: dataNascimentoUser
        })
        alert('Você ainda não confirmou o email!')
      }

      if(value == 'undefined' || value == 'null') {
        return null;
      }
      console.log('VALOR DO ASYNC STORAGE: ' + value)
    })



    if(arrayOfSelectedCategories.length == 0 && arrayOfSelectedStates.length == 0) {
        this.props.navigation.navigate('HomeNavigator')
    }

    //Pegando lista de categorias selecionadas
    for(var i = 0; i < sumLengthArrays; i++) {
        console.log('Elementos: ' + arrayOfSelectedCategories)

        if(typeRoute == 'Autonomo') {

          if(arrayOfSelectedStates.length <= 0 && arrayOfSelectedCategories.length > 0) {
            firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("categoryAuto", "in", arrayOfSelectedCategories).onSnapshot(documentSnapshot => {
              let anunciosAtivosAuto = [];
              documentSnapshot.forEach(function(doc) {
                anunciosAtivosAuto.push({
                  idUser: doc.data().idUser,
                  nome: doc.data().nome,
                  idAnuncio: doc.data().idAnuncio,
                  photo: doc.data().photoPublish,
                  video: doc.data().videoPublish,
                  title: doc.data().titleAuto,
                  description: doc.data().descriptionAuto,
                  type: doc.data().type,
                  phone: doc.data().phoneNumberAuto,
                  verified: doc.data().verifiedPublish,
                  value: doc.data().valueServiceAuto
                })
              })
        
        
              e.setState({activesPublishesAuto: anunciosAtivosAuto})
              this.setModalVisible(false)

              this.sleep(1000).then(() => { 
                e.setState({isFetchedPublish: true})
              })
            })
          }


          if(arrayOfSelectedStates.length > 0 && arrayOfSelectedCategories.length <= 0) {
            firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("UFAuto", "in", arrayOfSelectedStates).onSnapshot(documentSnapshot => {
              let anunciosAtivosAuto = [];
              documentSnapshot.forEach(function(doc) {
                anunciosAtivosAuto.push({
                  idUser: doc.data().idUser,
                  nome: doc.data().nome,
                  idAnuncio: doc.data().idAnuncio,
                  photo: doc.data().photoPublish,
                  video: doc.data().videoPublish,
                  title: doc.data().titleAuto,
                  description: doc.data().descriptionAuto,
                  type: doc.data().type,
                  phone: doc.data().phoneNumberAuto,
                  verified: doc.data().verifiedPublish,
                  value: doc.data().valueServiceAuto
                })
              })
        
        
              e.setState({activesPublishesAuto: anunciosAtivosAuto})
              this.setModalVisible(false)

              this.sleep(1000).then(() => { 
                e.setState({isFetchedPublish: true})
              })
            })
          }


          if(arrayOfSelectedStates.length > 0 && arrayOfSelectedCategories.length > 0) {
            firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("categoryAuto", "in", arrayOfSelectedCategories).onSnapshot(documentSnapshot => {
              let anunciosAtivosAuto = [];
              documentSnapshot.forEach(function(doc) {
                anunciosAtivosAuto.push({
                  idUser: doc.data().idUser,
                  nome: doc.data().nome,
                  idAnuncio: doc.data().idAnuncio,
                  photo: doc.data().photoPublish,
                  video: doc.data().videoPublish,
                  title: doc.data().titleAuto,
                  description: doc.data().descriptionAuto,
                  type: doc.data().type,
                  phone: doc.data().phoneNumberAuto,
                  verified: doc.data().verifiedPublish,
                  value: doc.data().valueServiceAuto
                })
              })
        
        
              e.setState({activesPublishesAuto: anunciosAtivosAuto})
              this.setModalVisible(false)

              this.sleep(1000).then(() => { 
                e.setState({isFetchedPublish: true})
              })
            })


            firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("UFAuto", "in", arrayOfSelectedStates).onSnapshot(documentSnapshot => {
              let anunciosAtivosAuto = [];
              documentSnapshot.forEach(function(doc) {
                anunciosAtivosAuto.push({
                  idUser: doc.data().idUser,
                  nome: doc.data().nome,
                  idAnuncio: doc.data().idAnuncio,
                  photo: doc.data().photoPublish,
                  video: doc.data().videoPublish,
                  title: doc.data().titleAuto,
                  description: doc.data().descriptionAuto,
                  type: doc.data().type,
                  phone: doc.data().phoneNumberAuto,
                  verified: doc.data().verifiedPublish,
                  value: doc.data().valueServiceAuto
                })
              })
        
        
              e.setState({activesPublishesAuto: anunciosAtivosAuto})
              this.setModalVisible(false)

              this.sleep(1000).then(() => { 
                e.setState({isFetchedPublish: true})
              })
            })
          }

        }

        
        if(typeRoute == 'Estabelecimento') {

          if(arrayOfSelectedStates.length <= 0 && arrayOfSelectedCategories.length > 0) {
          //obter anuncios ativos estabelecimento
          await firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("categoryEstab", "in", arrayOfSelectedCategories).onSnapshot(documentSnapshot => {
            let anunciosAtivosEstab = [];
            documentSnapshot.forEach(function(doc) {
                anunciosAtivosEstab.push({
                    idUser: doc.data().idUser,
                    idAnuncio: doc.data().idAnuncio,
                    photo: doc.data().photoPublish,
                    video: doc.data().videoPublish,
                    title: doc.data().titleEstab,
                    description: doc.data().descriptionEstab,
                    phone: doc.data().phoneNumberEstab,
                    type: doc.data().type,
                    verified: doc.data().verifiedPublish,
                    value: doc.data().valueServiceEstab
                })
            })
  
  
          e.setState({activesPublishesEstab: anunciosAtivosEstab})
          this.setModalVisible(false)

          this.sleep(1000).then(() => { 
            e.setState({isFetchedPublish: true})
          })
        })

        }

        if(arrayOfSelectedStates.length > 0 && arrayOfSelectedCategories.length <= 0) {
          await firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("UFEstab", "in", arrayOfSelectedStates).onSnapshot(documentSnapshot => {
            let anunciosAtivosEstab = [];
            documentSnapshot.forEach(function(doc) {
                anunciosAtivosEstab.push({
                    idUser: doc.data().idUser,
                    idAnuncio: doc.data().idAnuncio,
                    photo: doc.data().photoPublish,
                    video: doc.data().videoPublish,
                    title: doc.data().titleEstab,
                    description: doc.data().descriptionEstab,
                    phone: doc.data().phoneNumberEstab,
                    type: doc.data().type,
                    verified: doc.data().verifiedPublish,
                    value: doc.data().valueServiceEstab
                })
            })
  
  
          e.setState({activesPublishesEstab: anunciosAtivosEstab})
          this.setModalVisible(false)

            this.sleep(1000).then(() => { 
              e.setState({isFetchedPublish: true})
            })
          })
        }

        if(arrayOfSelectedStates.length > 0 && arrayOfSelectedCategories.length > 0) {
          await firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("UFEstab", "in", arrayOfSelectedStates).onSnapshot(documentSnapshot => {
            let anunciosAtivosEstab = [];
            documentSnapshot.forEach(function(doc) {
                anunciosAtivosEstab.push({
                    idUser: doc.data().idUser,
                    idAnuncio: doc.data().idAnuncio,
                    photo: doc.data().photoPublish,
                    video: doc.data().videoPublish,
                    title: doc.data().titleEstab,
                    description: doc.data().descriptionEstab,
                    phone: doc.data().phoneNumberEstab,
                    type: doc.data().type,
                    verified: doc.data().verifiedPublish,
                    value: doc.data().valueServiceEstab
                })
            })
  
  
          e.setState({activesPublishesEstab: anunciosAtivosEstab})
          this.setModalVisible(false)

            this.sleep(1000).then(() => { 
              e.setState({isFetchedPublish: true})
            })
          })

          await firebase.firestore().collection('anuncios').where("type", "==", typeRoute).where("verifiedPublish", "==", true).where("categoryEstab", "in", arrayOfSelectedCategories).onSnapshot(documentSnapshot => {
            let anunciosAtivosEstab = [];
            documentSnapshot.forEach(function(doc) {
                anunciosAtivosEstab.push({
                    idUser: doc.data().idUser,
                    idAnuncio: doc.data().idAnuncio,
                    photo: doc.data().photoPublish,
                    video: doc.data().videoPublish,
                    title: doc.data().titleEstab,
                    description: doc.data().descriptionEstab,
                    phone: doc.data().phoneNumberEstab,
                    type: doc.data().type,
                    verified: doc.data().verifiedPublish,
                    value: doc.data().valueServiceEstab
                })
            })
  
  
          e.setState({activesPublishesEstab: anunciosAtivosEstab})
          this.setModalVisible(false)

            this.sleep(1000).then(() => { 
              e.setState({isFetchedPublish: true})
            })
          })
        }

        }


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

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


  cutDescription(text) {
    if(text.length > 40) {
      let shortDescription = text.substr(0, 40)

      return(
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Description>{shortDescription} ...</Description>
        </View>
      );
    } else {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Description>{text}</Description>
        </View>
      );
    }
  }

  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(15, Height);
  }

  render() {
    const { status, emailUserFunction, activesPublishesAuto, isFetchedPublish, activesPublishesEstab, isFetched } = this.state

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "white-content" : "dark-content"}
        />

        <View style={styles.container}>
        
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
          <View style={{flex:1, alignItems:'center', paddingLeft: windowWidth / 2, paddingTop: windowHeight / 2, width: 100}}>
            <View style={{alignItems:'center', borderWidth:2, borderColor:'black', backgroundColor:'white', height:100, width: 200, backgroundColor:'white', borderRadius:15}}>
              <Text style={{fontWeight:'bold', marginTop:10, color:'#9A9A9A'}}>Carregando...</Text>
              <PulseIndicator color='#DAA520'/>
            </View>
          </View>
        </Modal>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
              
                {status == true ? 
                    <TouchableOpacity onPress={this.navigateTo('Settings')} style={{borderRadius:5, justifyContent:'center', width:216, height:27}}>
                        <TextBoldGolden>Acessar o Meu Perfil</TextBoldGolden>
                    </TouchableOpacity>
                    :

                    <SignUpBottom onPress={this.navigateTo('SignUp')}>
                        <TextBold>Criar Conta</TextBold>
                    </SignUpBottom>
                }
                    
                <TouchableOpacity onPress={this.navigateTo('Filtro')} style={{width:20, height:20}}>
                    <IconResponsive  name="sort-alpha-up" size={19}/>
                </TouchableOpacity>
              </View>

            

            </View>

            <View style={styles.titleContainer}>
              <Heading>Anúncios</Heading>
            </View>

            {activesPublishesAuto.length == 0 && activesPublishesEstab.length == 0 &&
              <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:50}}>
                <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                <Text style={{fontWeight:'bold'}}>Nenhum Anúncio Foi Encontrado</Text>
              </View>
            }

              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={activesPublishesAuto}
                renderItem={({item}) =>
                
                  <View style={{flex:1, alignItems: 'center'}}>
                      <View>
                          <AnuncioContainer>
                              <View style={{flexDirection:'row'}}>
                                  {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{ width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20 }}
                                      />
                                    }
                                  <View style={{flexDirection:'column'}}>
                                      <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                      {this.cutDescription(item.description)}
                                  </View>
                              </View>  

                              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <View style={{marginTop: 24}}>
                                      <ValueField>{item.value}</ValueField>
                                  </View>

                                  <View style={{marginTop: 24, marginRight: 30}}>
                                      <IconResponsive  name="user-tie" size={19}/>
                                  </View>
                              </View> 

                          </AnuncioContainer>
                      </View>
                  </View>
                
                }
              >
              </FlatList>


              { this.state.purchased == false ?
                  <AdMobBanner
                    style={{marginLeft: 20}}
                    bannerSize="leaderboard"
                    adUnitID="ca-app-pub-1397640114399871/3366763355"
                    servePersonalizedAds
                    onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                  /> 
                  :
                  null
              } 

              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={activesPublishesEstab}
                renderItem={({item}) =>
                
                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                        <AnuncioContainer>
                            <View style={{flexDirection:'row'}}>
                                {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{ width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20 }}
                                      />
                                    }
                                <View style={{flexDirection:'column'}}>
                                    <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                    {this.cutDescription(item.description)}
                                </View>
                            </View>  

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                    <TextDetails>Ver Detalhes</TextDetails>
                                </TouchableDetails>


                                <View style={{marginTop: 24}}>
                                      <ValueField>{item.value}</ValueField>
                                </View>

                                <View style={{marginTop: 24, marginRight: 30}}>
                                    <IconResponsive  name="briefcase" size={19}/>
                                </View>
                            </View> 

                        </AnuncioContainer>
                    </View>
                </View>
                
                }
              >
              </FlatList>

              { this.state.purchased == false ?
                  <AdMobBanner
                    style={{marginLeft: 20}}
                    bannerSize="leaderboard"
                    adUnitID="ca-app-pub-1397640114399871/3366763355"
                    servePersonalizedAds
                    onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                  /> 
                  :
                  null
              }
          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
