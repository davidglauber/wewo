
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
  TouchableOpacity,
  Dimensions,
  TouchableOpacityBase,
} from 'react-native';



//import firebase 
import firebase from '../../config/firebase';


//CSS responsivo
import { SafeBackground, IconResponsive, TouchCategory, AnuncioContainer, Description, IconResponsiveNOBACK, Heading, Title, ValueField, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from './styles';

import { PulseIndicator } from 'react-native-indicators';

import { ThemeContext } from '../../../ThemeContext';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';


//import IAP API 
import {purchased} from '../../config/purchase';

//import ADS
import { AdMobBanner} from 'expo-ads-admob';

import { Video } from 'expo-av';


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 
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
      categories: [],
      isFetched: false,
      isFetchedPublish: false,
      isFetchedButton: false,
      modalVisible: true,
      products: [],
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
  let e = this;
  let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual')

  if(comprou == true) {
    this.setState({purchased: true})
  } else {
    this.setState({purchased: false})
  }

    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          e.setState({status: true})
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
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Description>{shortDescription} ...</Description>
        </View>
      );
    } else {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
   const { status, emailUserFunction, isFetchedButton, isFetchedPublish, premiumPublishesAuto, premiumPublishesEstab, categories, activesPublishesAuto, activesPublishesEstab, isFetched } = this.state
   
    return (
      <SafeBackground>

        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'white-content' : 'dark-content'}
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
            <View style={{alignItems:'center', borderWidth:2, borderColor:'black', backgroundColor:'white', height:100, width: 200, backgroundColor:'white', borderRadius:15}}>
              <Text style={{fontWeight:'bold', marginTop:10, color:'#9A9A9A'}}>Carregando...</Text>
              <PulseIndicator color='#DAA520'/>
            </View>
          </View>
        </Modal>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{paddingBottom: 16}}>
              <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
              
                {status == true ? 
                  <View>
                      <TouchableOpacity onPress={this.navigateTo('Settings')}>
                        <IconResponsiveNOBACK  name="user" size={19}/>
                      </TouchableOpacity>
                    </View>
                    :
                      <TouchableOpacity onPress={this.navigateTo('SignUp')}>
                          <IconResponsiveNOBACK  name="user-plus" size={19}/>
                      </TouchableOpacity>
                }

                <Image source={require("../../../assets/iconnoback.png")} style={{height:54, width:54, justifyContent:'center'}}/>
                    
                <TouchableOpacity onPress={this.navigateTo('Filtro')} style={{width:20, height:20}}>
                    <IconResponsiveNOBACK  name="sort-alpha-up" size={19}/>
                </TouchableOpacity>
              </View>

            

            </View>

            <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} style={{padding:15}}>
                <FlatList
                  horizontal={true}
                  keyExtractor={() => this.makeid(17)}
                  data={categories}
                  renderItem={({item}) => 
                    <TouchCategory onPress={() => this.props.navigation.navigate('HomeCategory', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/3, height:50, alignItems:'center', justifyContent:'center', borderRadius:10, marginRight: 20}}>
                      <Text style={{fontWeight:'bold', color:'#fff', fontSize:13}}>{item.titleCategory}</Text>
                    </TouchCategory>
                }
                ></FlatList>
            </ScrollView>

            <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
              <Heading>Anúncios</Heading>
            </View>

            {/*ANUNCIOS DE USUARIOS PREMIUM AUTONOMO*/}
            <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={premiumPublishesAuto}
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
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <View style={{marginTop: 24}}>
                                      <ValueField>{item.value}</ValueField>
                                  </View>

                                  <View style={{flexDirection:'row', marginTop: 24, marginRight: 20}}>
                                      <IconResponsive  name="user-tie" size={19}/>
                                      <IconResponsive style={{marginLeft:10}}  name="crown" size={19}/>
                                  </View>
                              </View> 

                          </AnuncioContainer>
                      </View>

                  </View>
                
              }
              >
              </FlatList>

              {/*ANUNCIOS DE USUARIOS PREMIUM ESTABELECIMENTOS*/}
              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={premiumPublishesEstab}
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

                                <View style={{flexDirection:'row', marginTop: 24, marginRight: 20}}>
                                    <IconResponsive  name="briefcase" size={19}/>
                                    <IconResponsive style={{marginLeft:10}}  name="crown" size={19}/>
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
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
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

          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
