
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Text,
  Platform,
  View,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableOpacityBase,
} from 'react-native';



//import firebase 
import firebase from '../../config/firebase';


//CSS responsivo
import { SafeBackground, IconResponsive, IconResponsive2, TouchCategory, AnuncioContainer, Description, IconResponsiveNOBACK, TextSearch, Heading, Title, ValueField, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from './styles';

import { PulseIndicator } from 'react-native-indicators';

import { ThemeContext } from '../../../ThemeContext';


// import components
import TouchableItem from '../../components/TouchableItem';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//import IAP API 
import {purchased} from '../../config/purchase';

//import ADS
import {AdMobInterstitial} from 'expo-ads-admob';

import * as Notifications from 'expo-notifications';

import { Video } from 'expo-av';

import Constants from 'expo-constants';


import normalize from '../../config/resizeFont';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  headerSty: {
    flexDirection:'column', 
    justifyContent:'flex-start', 
    alignItems:"center", 
    position:"absolute",
    left: windowWidth/1.13,
    top: windowHeight/50
  },
  headerSty2: { 
    position:'absolute',
    left: windowWidth/1.2,
    bottom: windowHeight/57
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
  },
})
 
export default class HomeA extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      verified:false,
      status: null,
      emailUserFunction:'',
      activesPublishesAuto: [],
      activesPublishesEstab: [],
      premiumPublishesAuto: [],
      premiumPublishesEstab: [],
      searchPublishesEstab:[],
      searchPublishesAuto: [],
      bestsPublishesAuto: [],
      bestsPublishesEstab: [],
      categories: [],
      isFetched: false,
      isFetchedPublish: false,
      isFetchedButton: false,
      modalVisible: true,
      products: [],
      purchased: false,
      type:'Autonomo',
      textSearch: '',
      notificationListener: React.createRef(null),
      responseListener: React.createRef(null),
      expoPushToken: ''
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


//Função que, ao usuário permitir as notificações, ele registra o celular dele com um token que será usado para enviar as notificações
async registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao obter token de notificação!');
      return;
    }
    let experienceId = '@zubito/wewo';
    token = (await Notifications.getExpoPushTokenAsync({experienceId})).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async componentDidMount() {
  let e = this;

  //configuração de notificações
  await this.registerForPushNotificationsAsync().then(token => this.setState({expoPushToken: token}));

  
  if(Platform.OS === "android") {
    let comprou = purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto', 'gold.auto.mensal', 'gold.auto.estab', 'gold.estab.mensal', 'gold.estab.anual')
    
    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }
  }
  
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      e.setState({status: true})
          firebase.firestore().collection('usuarios').doc(user.uid).update({
            tokenMessage: e.state.expoPushToken
          })
          firebase.firestore().collection('usuarios').doc(user.uid).get().then(documentSnapshot => {
            var removeCharacters = documentSnapshot.data().email.replace('@', '')
              let removeCharacters2 = removeCharacters.replace('gmail.com', '')
              let removeCharacters3 = removeCharacters2.replace('hotmail.com', '')
              let removeCharacters4 = removeCharacters3.replace('outlook.com', '')
              let removeCharacters5 = removeCharacters4.replace('live.com', '')
              let removeCharacters6 = removeCharacters5.replace('yahoo.com', '')

              e.setState({emailUserFunction: removeCharacters6})
              e.setState({isFetchedButton: true})

        })
        } else {
          e.setState({isFetchedButton: true})
          e.setState({status: false})
        }

    })


    //obter anuncios PREMIUM ativos autonomo 
    await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let premiumanunciosAtivosAuto = [];
      documentSnapshot.forEach(function(doc) {
        premiumanunciosAtivosAuto.push({
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


      e.setState({premiumPublishesAuto: premiumanunciosAtivosAuto})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
      e.setState({isFetchedPublish: true})
      })
    })


    //obter anuncios PREMIUM ativos estabelecimento
    await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let premiumanunciosAtivosEstab = [];
      documentSnapshot.forEach(function(doc) {
        premiumanunciosAtivosEstab.push({
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


      e.setState({premiumPublishesEstab: premiumanunciosAtivosEstab})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })


    //obter anuncios ativos autonomo 
    await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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


    //obter anuncios ativos estabelecimento
    await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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


    //obter categorias do banco
    await firebase.firestore().collection('categorias').onSnapshot(documentSnapshot => {
      let categoriasArray = [];
      documentSnapshot.forEach(function(doc) {
        categoriasArray.push({
          idCategory: doc.data().id,
          titleCategory: doc.data().title
        })
      })


      e.setState({categories: categoriasArray})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    if(Platform.OS === "android" && this.state.purchased == true) {
      null
    }

    if(Platform.OS === "ios" && this.state.purchased == true) {
      null
    }






    //obtem somente os anúncios com melhores avaliações (não importa se é premium ou não, TANTO AUTONOMO COMO ESTABELECIMENTO)
    await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("media", ">=", 4).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let melhoresnunciosAtivosAuto = [];
      documentSnapshot.forEach(function(doc) {
        melhoresnunciosAtivosAuto.push({
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
          value: doc.data().valueServiceAuto,
          media: doc.data().media
        })
      })


      e.setState({bestsPublishesAuto: melhoresnunciosAtivosAuto})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
      e.setState({isFetchedPublish: true})
      })
    })


    await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("media", ">=", 4).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let melhoresnunciosAtivosEstab = [];
      documentSnapshot.forEach(function(doc) {
        melhoresnunciosAtivosEstab.push({
          idUser: doc.data().idUser,
          idAnuncio: doc.data().idAnuncio,
          photo: doc.data().photoPublish,
          video: doc.data().videoPublish,
          title: doc.data().titleEstab,
          description: doc.data().descriptionEstab,
          phone: doc.data().phoneNumberEstab,
          type: doc.data().type,
          verified: doc.data().verifiedPublish,
          value: doc.data().valueServiceEstab,
          media: doc.data().media
        })

      })


      e.setState({bestsPublishesEstab: melhoresnunciosAtivosEstab})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
      e.setState({isFetchedPublish: true})
      })
    })


    // This listener is fired whenever a notification is received while the app is foregrounded
    this.state.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      this.setState({notification: notification});
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    this.state.responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    });

    return () => {
      Notifications.removeNotificationSubscription(this.state.notificationListener.current);
      Notifications.removeNotificationSubscription(this.state.responseListener.current);
    }; 
    
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


  async getPublishes(titlePublish) {
    let e = this;
    this.setModalVisible(true)

    if(this.state.type == 'Estabelecimento') {
      await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("titleEstabArray", "array-contains", titlePublish).onSnapshot(documentSnapshot => {
        let anunciosAtivosEstab = [];
        documentSnapshot.forEach(function(doc) {
          anunciosAtivosEstab.push({
            idUser: doc.data().idUser,
            idAnuncio: doc.data().idAnuncio,
            photo: doc.data().photoPublish,
            video: doc.data().videoPublish,
            title: doc.data().titleEstab,
            premiumUser: doc.data().premiumUser,
            description: doc.data().descriptionEstab,
            phone: doc.data().phoneNumberEstab,
            type: doc.data().type,
            verified: doc.data().verifiedPublish,
            value: doc.data().valueServiceEstab
          })
        })
  
  
        e.setState({searchPublishesEstab: anunciosAtivosEstab})
        this.setModalVisible(false)
      })

    } else {
      await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("titleAutoArray", "array-contains", titlePublish).onSnapshot(documentSnapshot => {
        let anunciosAtivosAuto = [];
        documentSnapshot.forEach(function(doc) {
          anunciosAtivosAuto.push({
            idUser: doc.data().idUser,
            nome: doc.data().nome,
            idAnuncio: doc.data().idAnuncio,
            photo: doc.data().photoPublish,
            video: doc.data().videoPublish,
            title: doc.data().titleAuto,
            premiumUser: doc.data().premiumUser,
            description: doc.data().descriptionAuto,
            type: doc.data().type,
            phone: doc.data().phoneNumberAuto,
            verified: doc.data().verifiedPublish,
            value: doc.data().valueServiceAuto
          })
        })
  
  
        e.setState({searchPublishesAuto: anunciosAtivosAuto})
        this.setModalVisible(false)
  
      })

    }

  }

  cutDescription(text) {
    if(text.length > 25) {
      let shortDescription = text.substr(0, 25)

      return(
        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
          <Description>{shortDescription} ...</Description>
        </View>
      );
    } else {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
          <Description>{text}</Description>
        </View>
      );
    }
  }

  cutDescription2(text) {
    if(text.length > 14) {
      let shortDescription = text.substr(0, 14)

      return(
        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
          <Description>{shortDescription} ...</Description>
        </View>
      );
    } else {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
          <Description>{text}</Description>
        </View>
      );
    }
  }
  

  onChangeTextoSearch(text){
    this.setState({textSearch: text})

    if(text == ''){
      this.setState({searchPublishesEstab: []})
      this.setState({searchPublishesAuto: []})
    } else {
      return null;
    }
    console.log('texto pesquisa'  + this.state.textSearch)
  }



  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(18, Height);
  }

  responsibleFont2() {
    let Height = Dimensions.get('window').height

    return RFValue(16, Height);
  }

  render() {
   const { status, emailUserFunction, isFetchedButton, isFetchedPublish, premiumPublishesAuto, premiumPublishesEstab, categories, activesPublishesAuto, activesPublishesEstab, isFetched } = this.state
   
    return (
      <SafeBackground>

        <StatusBar
          backgroundColor={this.context.dark ? '#3E3C3F' : '#E98D0A'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />
        
        <View style={{flex: 1}}>
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

          <ScrollView showsVerticalScrollIndicator={false}>

            {this.context.dark ?
              <View style={{flexDirection:"row", backgroundColor:'#3E3C3F'}}>
              <View style={{flexDirection: 'row', paddingTop: 16, paddingHorizontal: 5, paddingBottom: 12}}>
                <Image source={require("../../../assets/logobold.png")} style={{height:104, width:104}}/>
              </View>


              <View style={{position: "absolute", top: windowHeight/18, left: windowWidth/3}}>
                    <TextSearch
                      placeholder="Pesquise aqui"
                      placeholderTextColor={this.context.dark ? '#fff' : '#3E3C3F'}
                      returnKeyType="search"
                      maxLength={50}
                      value={this.state.textSearch}
                      onChangeText={text => this.onChangeTextoSearch(text)}
                    />

                    <View style={styles.searchButtonContainer}>
                      <TouchableItem
                        onPress={() => this.getPublishes(this.state.textSearch)}
                        // borderless
                      >
                        <View style={styles.searchButton}>
                          <IconResponsive2
                            name="search"
                            size={18}
                          />
                        </View>
                      </TouchableItem>
                    </View>
              </View>

              {this.state.type == 'Estabelecimento' &&
                <View style={styles.headerSty2}>
                  <TouchableOpacity style={{padding:15}} onPress={() => this.setState({type: 'Autonomo'})}>
                    <IconResponsive
                      style={{color:'#a66811'}}
                      name="user-tie"
                      size={24}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={{padding:15}}>
                    <IconResponsive
                      name="briefcase"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              }

              {this.state.type == 'Autonomo' &&
                <View style={styles.headerSty2}>
                  <TouchableOpacity style={{padding:15}}>
                    <IconResponsive
                      name="user-tie"
                      size={24}
                    /> 
                  </TouchableOpacity>

                  <TouchableOpacity style={{padding:15}} onPress={() => this.setState({type: 'Estabelecimento'})}>
                    <IconResponsive
                      style={{color:'#a66811'}}
                      name="briefcase"
                      size={24}
                    />
                  </TouchableOpacity>

                </View>
              }
              </View>
              :
              <View style={{flexDirection:"row", backgroundColor:'#E98D0A'}}>
                <View style={{flexDirection: 'row', paddingTop: 16, paddingHorizontal: 5, paddingBottom: 12}}>
                  <Image source={require("../../../assets/LOGOICONEAPP.png")} style={{height:104, width:104}}/>
                </View>

                <View style={{position: "absolute", top: windowHeight/18, maxWidth: windowWidth/2, left: windowWidth/3}}>
                    <TextSearch
                      placeholder="Pesquise aqui"
                      placeholderTextColor={this.context.dark ? '#fff' : '#3E3C3F'}
                      returnKeyType="search"
                      maxLength={50}
                      onSubmitEditing={() => this.getPublishes(this.state.textSearch)}
                      value={this.state.textSearch}
                      onChangeText={text => this.onChangeTextoSearch(text)}
                    />

                    <View style={styles.searchButtonContainer}>
                      <TouchableItem
                        onPress={() => this.getPublishes(this.state.textSearch)}
                        // borderless
                      >
                        <View style={styles.searchButton}>
                          <IconResponsive2
                            name="search"
                            size={18}
                          />
                        </View>
                      </TouchableItem>
                    </View>
                </View>


                {this.state.type == 'Estabelecimento' &&
                  <View style={styles.headerSty2}>
                    <TouchableOpacity style={{padding:15}} onPress={() => this.setState({type: 'Autonomo'})}>
                      <IconResponsive
                        style={{color:'#a66811'}}
                        name="user-tie"
                        size={24}
                      />
                    </TouchableOpacity>
                  
                    <TouchableOpacity style={{padding:15}}>
                      <IconResponsive
                        name="briefcase"
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                }

                {this.state.type == 'Autonomo' &&
                  <View style={styles.headerSty2}>
                    <TouchableOpacity style={{padding:15}}>
                      <IconResponsive
                        name="user-tie"
                        size={24}
                      /> 
                    </TouchableOpacity>

                    <TouchableOpacity style={{padding:15}} onPress={() => this.setState({type: 'Estabelecimento'})}>
                      <IconResponsive
                        style={{color:'#a66811'}}
                        name="briefcase"
                        size={24}
                      />
                    </TouchableOpacity>

                  </View>
                }
              </View>
            }

          <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true}>
            <FlatList
              horizontal={true}
              keyExtractor={() => this.makeid(17)}
              data={categories}
              renderItem={({item}) => 
                <View style={{alignItems: 'center', marginTop:10}}>
                  <TouchCategory onPress={() => this.props.navigation.navigate('HomeCategory', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/5, height:55, alignItems:'center', marginTop: 20, marginLeft:18, justifyContent:'center', borderRadius:20, marginRight: 20, backgroundColor: this.context.dark? '#3E3C3F' : '#d98b0d'}}>
                    {item.titleCategory == 'Transportes' &&
                      <IconResponsive name="car" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Animais' &&
                      <IconResponsive name="dog" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }


                    {item.titleCategory == 'Lazer' &&
                      <IconResponsive name="bandcamp" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Comida' &&
                      <IconResponsive name="apple" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Administração' &&
                      <IconResponsive name="pencil-alt" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Negócios' &&
                      <IconResponsive name="building" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Informática' &&
                      <IconResponsive name="laptop" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Audio-Visual' &&
                      <IconResponsive name="camera-retro" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Eletrodomésticos' &&
                      <IconResponsive name="plug" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Automóveis' &&
                      <IconResponsive name="bus" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Beleza' &&
                      <IconResponsive name="kiss-beam" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Saúde' &&
                      <IconResponsive name="heartbeat" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Farmácias' &&
                      <IconResponsive name="capsules" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Market' &&
                      <IconResponsive name="shopping-bag" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Música' &&
                      <IconResponsive name="music" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Artes' &&
                      <IconResponsive name="paint-brush" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Construção' &&
                      <IconResponsive name="wrench" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Imóveis' &&
                      <IconResponsive name="warehouse" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Turismo' &&
                      <IconResponsive name="umbrella-beach" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Aluguel' &&
                      <IconResponsive name="hand-peace" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Shows' &&
                      <IconResponsive name="microphone-alt" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Segurança' &&
                      <IconResponsive name="shield-alt" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Educação' &&
                      <IconResponsive name="book-reader" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Outros' &&
                      <IconResponsive name="cubes" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }
                    
                    {item.titleCategory == 'Assistência Técnica' &&
                      <IconResponsive name="hammer" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Consultoria' &&
                      <IconResponsive name="smile-beam" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                    {item.titleCategory == 'Aulas' &&
                      <IconResponsive name="book-reader" size={24} style={{justifyContent:'center', alignItems:'center'}}></IconResponsive>
                    }

                  </TouchCategory>
                  <Text style={{fontWeight:'bold', color: this.context.dark ? '#fff' : '#000', fontSize: normalize(10), marginRight:3, marginTop:5, marginBottom:10}}>{item.titleCategory}</Text>
                </View>
              }
            ></FlatList>
          </ScrollView>


          <ScrollView horizontal={true} alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection:'row', backgroundColor: this.context.dark? "#121212": "#fff", borderWidth:1, borderColor:"orange", elevation:5, marginHorizontal: windowWidth/50, borderRadius:10, marginTop:20}}>
            <FlatList
              horizontal={true}
              alwaysBounceHorizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={() => this.makeid(17)}
              data={this.state.bestsPublishesAuto}
              renderItem={({item}) => 
              <TouchableOpacity onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true}>
                    <Image source={{uri: item.photo}} style={{width:158, height:108, borderRadius: 10}}></Image>
                    <View style={{flexDirection:'column'}}>
                      <Text style={{fontSize: this.responsibleFont2(), fontWeight:'bold', color: this.context.dark ? "#fff": "#121212", marginLeft: windowWidth/16, marginTop:20}}>{item.title}</Text>
                      {this.cutDescription2(item.description)}

                      {item.media == 4 &&
                      <>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/11}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/14.5}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/21}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/37}}/>
                        </>
                      }

                      {item.media > 4 &&
                        <>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/10}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/12.5}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/17}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/26}}/>
                          <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/54}}/>
                        </>
                      }
                    </View>
                </ScrollView>
              </TouchableOpacity>
              }
            >

            </FlatList>


            <FlatList
              horizontal={true}
              alwaysBounceHorizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={() => this.makeid(17)}
              data={this.state.bestsPublishesEstab}
              renderItem={({item}) => 
              <TouchableOpacity onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true}>
                  <Image source={{uri: item.photo}} style={{width:158, height:108, borderRadius: 10}}></Image>
                  <View style={{flexDirection:'column'}}>
                    <Text style={{fontSize: this.responsibleFont2(), fontWeight:'bold', color: this.context.dark ? "#fff": "#121212", marginLeft: windowWidth/16, marginTop:20}}>{item.title}</Text>
                    {this.cutDescription2(item.description)}

                    {item.media == 4 &&
                    <>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/11}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/14.5}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/21}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/37}}/>
                      </>
                    }

                    {item.media > 4 &&
                      <>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/10}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/12.5}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/17}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/26}}/>
                        <IconResponsiveNOBACK name="star" size={12} style={{position:'absolute', right: windowWidth/4.5, bottom: windowHeight/54}}/>
                      </>
                    }
                  </View>
                </ScrollView>
              </TouchableOpacity>
              }
            >

            </FlatList>
          </ScrollView>
          
          
            <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 25, paddingHorizontal: 16, paddingBottom: 35}}>
              <Heading>Anúncios</Heading>
              <TouchableOpacity onPress={this.navigateTo('Filtro')} style={{width:50, height:20, flexDirection:"row", marginRight:17}}>
                  <ValueField>Filtros</ValueField>
                  <IconResponsiveNOBACK style={{marginLeft:10}}  name="filter" size={19}/>
              </TouchableOpacity>
            </View>


            {this.state.type == 'Autonomo' && this.state.searchPublishesAuto.length == 0 && this.state.searchPublishesEstab.length == 0 &&
              <ScrollView>
                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={premiumPublishesAuto}
                  renderItem={({item}) =>
                  
                  
                  <View style={{flex:1, marginRight: windowWidth/5}}>
                        <View>
                            <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{flexDirection:'row', marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.8, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:6}}  name="user-tie" size={19}/>
                                                <IconResponsive2 style={{marginLeft: 6}}  name="crown" size={19}/>
                                            </View>
                                        </View>
                                    </View>


                                </View> 
                                
                            </AnuncioContainer>
                        </View>

                    </View>
                  
                }
                >
                </FlatList>
              
              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={activesPublishesAuto}
                renderItem={({item}) =>
                
                
                <View style={{flex:1, marginRight: windowWidth/5}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                              <View style={{flexDirection:'row'}}>
                                    {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}
                                      />
                                    }
                                  
                                  <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.5, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:16}}  name="user-tie" size={19}/>
                                            </View>
                                        </View>
                                  </View>

                              </View> 

                              




                          </AnuncioContainer>
                      </View>

                  </View>
                
                  }
                  >
                </FlatList>
              </ScrollView>
            }


            {/*LISTA DE TERMO DE PESQUISA AUTONOMO*/}
            {this.state.type == 'Autonomo' && this.state.searchPublishesAuto.length !== 0 && this.state.searchPublishesEstab.length == 0 &&
            <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={this.state.searchPublishesAuto}
                renderItem={({item}) =>
                <View style={{flex:1, marginRight: windowWidth/5}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                              <View style={{flexDirection:'row'}}>
                                    {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}
                                      />
                                    }
                                  
                                  <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.8, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:16}}  name="user-tie" size={19}/>
                                                {item.premiumUser == true ?
                                                  <IconResponsive2 style={{marginLeft: 6}}  name="crown" size={19}/>
                                                  :
                                                  null
                                                }
                                            </View>
                                        </View>
                                  </View>
                                  <View style={{flexDirection:'row', position:'absolute', left: windowWidth/1, marginTop:18}}>
                                      <IconResponsive2 style={{marginLeft:16}}  name="user-tie" size={19}/>
                                  </View>

                              </View> 

                              




                          </AnuncioContainer>
                      </View>

                  </View>
                
                  }
                  >
                </FlatList>
            }


            {/*LISTA DE TERMO DE PESQUISA ESTABELECIMENTO*/}
            {this.state.type == 'Estabelecimento' && this.state.searchPublishesAuto.length == 0 && this.state.searchPublishesEstab.length !== 0 &&
              <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.searchPublishesEstab}
                  renderItem={({item}) =>
                  
                  <View style={{flex:1, marginRight: windowWidth/5}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                          <View style={{flexDirection:'row', marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.8, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:16}}  name="briefcase" size={19}/>
                                                {item.premiumUser == true ?
                                                  <IconResponsive2 style={{marginLeft: 6}}  name="crown" size={19}/>
                                                  :
                                                  null
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row', position:'absolute', left: windowWidth/1, marginTop:18}}>
                                        <IconResponsive2 style={{marginLeft:16}}  name="briefcase" size={19}/>
                                    </View>
                                </View> 
                                
                            </AnuncioContainer>
                      </View>
                  </View>
                  
                }
                >
                </FlatList>
            }

            {this.state.type == 'Estabelecimento' && this.state.searchPublishesAuto.length == 0 && this.state.searchPublishesEstab.length == 0 &&
              <ScrollView>
                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={premiumPublishesEstab}
                  renderItem={({item}) =>
                  
                  <View style={{flex:1, marginRight: windowWidth/5}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                          <View style={{flexDirection:'row', marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.8, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:6}}  name="briefcase" size={19}/>
                                                <IconResponsive2 style={{marginLeft: 6}}  name="crown" size={19}/>
                                            </View>
                                          </View>
                                    </View>
                                </View> 
                                
                            </AnuncioContainer>
                      </View>
                  </View>
                  
                }
                >
                </FlatList>

                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={activesPublishesEstab}
                  renderItem={({item}) =>
                  
                  <View style={{flex:1, marginRight: windowWidth/5}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:110, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <View style={{flexDirection:'row', position:'absolute', left: windowWidth/2.5, marginTop:8}}>
                                                <IconResponsive2 style={{marginLeft:16}}  name="briefcase" size={19}/>
                                            </View>
                                        </View>
                                    </View>
                                </View> 
                                

                            </AnuncioContainer>
                      </View>
                  </View>
                  
                }
                >
                </FlatList>
              </ScrollView>
            }


          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
