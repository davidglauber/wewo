
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TouchableOpacityBase,
} from 'react-native';



//import firebase 
import firebase from '../../config/firebase';


//CSS responsivo
import { SafeBackground, IconResponsive, AnuncioContainer, Description, IconResponsiveNOBACK, Heading, Title, ValueField, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from './styles';

import { PulseIndicator } from 'react-native-indicators';

import { ThemeContext } from '../../../ThemeContext';


//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';


//import ADS
//import { AdMobBanner } from 'expo-ads-admob';





//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 
export default class HomeCategory extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      verified:false,
      status: null,
      emailUserFunction:'',
      activesPublishesAuto: [],
      activesPublishesEstab: [],
      categories: [],
      isFetched: false,
      isFetchedPublish: false,
      isFetchedButton: false,
      modalVisible: true,
      value:0
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

    //obter anuncios ativos autonomo 
    await firebase.firestore().collection('anuncios').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("categoryAuto", "==", titleNavCategory).onSnapshot(documentSnapshot => {
      let anunciosAtivosAuto = [];
      documentSnapshot.forEach(function(doc) {
        anunciosAtivosAuto.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idAnuncio: doc.data().idAnuncio,
          photo: doc.data().photoPublish,
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
    await firebase.firestore().collection('anuncios').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("categoryEstab", "==", titleNavCategory).onSnapshot(documentSnapshot => {
      let anunciosAtivosEstab = [];
      documentSnapshot.forEach(function(doc) {
        anunciosAtivosEstab.push({
          idUser: doc.data().idUser,
          idAnuncio: doc.data().idAnuncio,
          photo: doc.data().photoPublish,
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
   const { status, emailUserFunction, isFetchedButton, isFetchedPublish, categories, activesPublishesAuto, activesPublishesEstab, isFetched } = this.state
   
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


            <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} style={{padding:15}}>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={() => this.props.navigation.navigate('HomeNavigator')}>
                    <IconResponsiveNOBACK style={{marginRight: 24}} name="arrow-left" size={20}/>
                </TouchableOpacity>
                <FlatList
                  horizontal={true}
                  keyExtractor={() => this.makeid(17)}
                  data={categories}
                  renderItem={({item}) => 
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeCategory2', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/3, height:50, alignItems:'center', justifyContent:'center', backgroundColor: '#DAA520', borderRadius:10, marginRight: 20}}>
                      <Text style={{fontWeight:'bold', color:'#fff', fontSize:13}}>{item.titleCategory}</Text>
                    </TouchableOpacity>
                }
                ></FlatList>
            </ScrollView>

            <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
              <Heading>Anúncios</Heading>
            </View>

            {activesPublishesAuto.length == 0 && activesPublishesEstab.length == 0 &&
              <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:50}}>
                <Image style={{width:200, height:200}} source={require("../../assets/img/notfoundnoback.gif")} />
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
                                  <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                  
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

              {/*<AdMobBanner
                style={{marginLeft: 20}}
                bannerSize="leaderboard"
                adUnitID="ca-app-pub-1397640114399871/3366763355"
                setTestDeviceIDAsync
                servePersonalizedAds
                onDidFailToReceiveAdWithError={(err) => console.log(err)} 
              /> */}

              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={activesPublishesEstab}
                renderItem={({item}) =>
                
                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                        <AnuncioContainer>
                            <View style={{flexDirection:'row'}}>
                                <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                
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

              {/*<AdMobBanner
                style={{marginLeft: 20}}
                bannerSize="leaderboard"
                adUnitID="ca-app-pub-1397640114399871/3366763355"
                setTestDeviceIDAsync
                servePersonalizedAds
                onDidFailToReceiveAdWithError={(err) => console.log(err)} 
              /> */}
          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
