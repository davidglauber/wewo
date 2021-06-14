
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
import { SafeBackground, IconResponsive, IconResponsive2, AnuncioContainer, Description, TouchCategory, IconResponsiveNOBACK, Heading, Title, ValueField, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from './styles';

import { PulseIndicator } from 'react-native-indicators';

import { ThemeContext } from '../../../ThemeContext';


//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';


//import IAP API 
import {purchased} from '../../config/purchase';

import { Video } from 'expo-av';

import normalize from '../../config/resizeFont';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 
export default class HomeCategory2 extends Component {
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
      value:0,
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
   let titleNavCategory = this.props.route.params.titleOfCategory;

   if(Platform.OS === "android") {
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto');
    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }
  } else {
    /*
    let comprou = purchased('gold.auto.mensal', 'gold.auto.estab', 'gold.estab.mensal', 'gold.estab.anual');
    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }
    */
    //LEMBRAR DE ATIVAR APOS A APPLE APROVAR O IAP
  }

   //obter anuncios PREMIUM ativos autonomo
   await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("categoryAuto", "==", titleNavCategory).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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
  await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("categoryEstab", "==", titleNavCategory).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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
    await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("categoryAuto", "==", titleNavCategory).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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
    await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("categoryEstab", "==", titleNavCategory).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
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
    if(text.length > 25) {
      let shortDescription = text.substr(0, 25)

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

    return RFValue(19, Height);
  }

  render() {
   const { status, emailUserFunction, isFetchedButton, isFetchedPublish, premiumPublishesAuto, premiumPublishesEstab, categories, activesPublishesAuto, activesPublishesEstab, isFetched } = this.state
   
    return (
      <SafeBackground>

        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
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

            <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} style={{padding:15}}>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={() => this.props.navigation.navigate('HomeNavigator')}>
                    <IconResponsiveNOBACK style={{marginRight: 24}} name="arrow-left" size={20}/>
                </TouchableOpacity>
                <FlatList
                  horizontal={true}
                  keyExtractor={() => this.makeid(17)}
                  data={categories}
                  renderItem={({item}) => 
                  <View style={{alignItems: 'center'}}>
                    <TouchCategory onPress={() => this.props.navigation.navigate('HomeCategory', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/5, height:55, alignItems:'center', marginTop: 20, justifyContent:'center', borderRadius:20, marginRight: 20}}>
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
                    <Text style={{fontWeight:'bold', color: this.context.dark ? '#d98b0d' : '#d98b0d', fontSize: normalize(10), marginRight:20}}>{item.titleCategory}</Text>
                  </View>
                }
                ></FlatList>
            </ScrollView>

            <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
              <Heading>Anúncios</Heading>
            </View>


            {activesPublishesAuto.length == 0 && activesPublishesEstab.length == 0  && premiumPublishesAuto.length == 0 && premiumPublishesEstab.length == 0 &&
              <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:50}}>
                <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                <Text style={{fontWeight:'bold'}}>Nenhum Anúncio Foi Encontrado</Text>
              </View>
            }
            



            {/*ANUNCIOS DE USUARIOS PREMIUM AUTONOMO*/}
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
                                      <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
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




              {/*ANUNCIOS DE USUARIOS PREMIUM ESTABELECIMENTOS*/}
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
                                        <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
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
        </View>
      </SafeBackground>
    );
  }
}
