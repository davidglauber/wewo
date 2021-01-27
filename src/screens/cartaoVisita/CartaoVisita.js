/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import remove from 'lodash/remove';

import {Heading6, SmallText} from '../../components/text/CustomText';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { FontAwesome5 } from '@expo/vector-icons';

import firebase from '../../config/firebase';


import { RFValue } from 'react-native-responsive-fontsize';

import { PulseIndicator } from 'react-native-indicators';

import Colors from '../../theme/colors';


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//CSS responsivo
import {SafeBackground, IconResponsive, TouchCategory, TextDetails, Description, IconResponsiveNOBACK, TouchableDetails, Favorite, Heading, AnuncioContainer, ValueField, Title, SwipeLeft} from '../home/styles';


import { ThemeContext } from '../../../ThemeContext';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


//import ADS
import { AdMobBanner} from 'expo-ads-admob';

//import IAP API 
import {purchased} from '../../config/purchase';

import { Video } from 'expo-av';

// CartA Styles
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titleText: {
    fontWeight: '700',
    color: 'white'
  },
  productList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    paddingHorizontal: 12,
  },
  subTotalText: {
    top: -2,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  subTotalPriceText: {
    fontWeight: '700',
    color: Colors.primaryColor,
  },
});

// CartA
export default class CartaoVisita extends Component {
  static contextType = ThemeContext
  
  constructor(props) {
    super(props);

    this.state = {
      total: 0.0,
      favorite: false,
      cartoesEstab: [],
      cartoesAuto: [],
      premiumCartoesAuto: [],
      premiumCartoesEstab: [],
      categories: [],
      isFetchedPublish: false,
      switchSwipeState: true,
      isOpen: true,
      modalVisible: true,
      purchased: false,
      products: [
        {
          id: 'product1',
          imageUri: require('../../assets/img/sandwich_2.jpg'),
          name: 'Subway sandwich',
          price: 10.0,
          quantity: 2,
          discountPercentage: 10,
        },
        {
          id: 'product2',
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 20.0,
          quantity: 1,
        },
        {
          id: 'product3',
          imageUri: require('../../assets/img/cake_1.jpg'),
          name: 'Chocolate cake',
          price: 30.0,
          quantity: 2,
        },
      ],
    };
  }

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
    //obter cartoes PREMIUM ativos autonomo 
    await firebase.firestore().collection('cartoes').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let premiumcartoesAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        premiumcartoesAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          videoPublish: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          categoria: doc.data().categoryAuto,
          phone: doc.data().phoneNumberAuto,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({premiumCartoesAuto: premiumcartoesAutoDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    //obter cartoes PREMIUM ativos estabelecimento 
    await firebase.firestore().collection('cartoes').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("premiumUser", "==", true).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let premiumcartoesEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        premiumcartoesEstabDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          videoPublish: doc.data().videoPublish,
          photo: doc.data().photoPublish,
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
      e.setState({premiumCartoesEstab: premiumcartoesEstabDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })


    await firebase.firestore().collection('cartoes').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let cartoesAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          videoPublish: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          categoria: doc.data().categoryAuto,
          phone: doc.data().phoneNumberAuto,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({cartoesAuto: cartoesAutoDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    await firebase.firestore().collection('cartoes').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("premiumUser", "==", false).where("media", ">=", 0).orderBy("media", "desc").onSnapshot(documentSnapshot => {
      let cartoesEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesEstabDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          videoPublish: doc.data().videoPublish,
          photo: doc.data().photoPublish,
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
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
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


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  RightAction() {
      return(
        <TouchableWithoutFeedback style={{width: 336, height: 170, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:5, marginTop: 10, borderRadius: 10, opacity:0.5}}>
            <IconResponsiveNOBACK style={{marginRight:40}} name="star" size={24}/>
            <Favorite>Favoritado</Favorite>
        </TouchableWithoutFeedback>
      );
  }



  AddToFav(id, publishObj) {
    let currentUser = firebase.auth().currentUser;

    if(currentUser == null) {
      alert('Você precisa estar logado para favoritar um cartão!')

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

    }
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
    const {cartoesAuto, cartoesEstab, premiumCartoesAuto, premiumCartoesEstab, products, isOpen, categories, isFetchedPublish, switchSwipeState} = this.state;

    return (
      <SafeBackground>

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

        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "white-content" : "dark-content"}
        />

        <View style={styles.titleContainer}>
          <Heading>Cartões de Visita</Heading>
          {products.length > 0 && (
            <View style={styles.inline}>
              <TouchableOpacity onPress={this.navigateTo('FilterCartao')} style={{marginRight:5}}>
                    <IconResponsiveNOBACK  name="sort-alpha-up" size={19} />
              </TouchableOpacity>
            
            </View>
          )}
        </View>


          <ScrollView>
            <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} style={{padding:15}}>
                <FlatList
                  horizontal={true}
                  keyExtractor={() => this.makeid(17)}
                  data={categories}
                  renderItem={({item}) => 
                    <TouchCategory onPress={() => this.props.navigation.navigate('CartaoCategory', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/3, height:50, alignItems:'center', justifyContent:'center', borderRadius:10, marginRight: 20}}>
                      <Text style={{fontWeight:'bold', color:'#fff', fontSize:13}}>{item.titleCategory}</Text>
                    </TouchCategory>
                }
                ></FlatList>
            </ScrollView>
            <View>

            <FlatList
                data={premiumCartoesAuto}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 
                  <Swipeable
                    renderRightActions={this.RightAction}
                    onSwipeableRightOpen={() => this.AddToFav(item.idCartao, item)}
                    enabled={isOpen}
                  > 

                    <AnuncioContainer>
                          <View style={{flexDirection:'row'}}>
                              {item.videoPublish == null ?
                                    <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                    :
                                    <Video 
                                      source={{ uri: item.videoPublish }}
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
                                <Title style={{fontSize: this.responsibleFont()}}>{item.nome}</Title>

                                {this.cutDescription(item.description)}

                              </View>
                          </View>  

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                              <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                  <TextDetails>Ver Detalhes</TextDetails>
                              </TouchableDetails>

                              <View style={{flexDirection:'row', marginTop:15}}>
                                  <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                  <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19}/>
                              </View>

                              <View style={{flexDirection:'row', marginTop: 24, marginRight: 20}}>
                                  <IconResponsive  name="user-tie" size={19}/>
                                  <IconResponsive style={{marginLeft:10}}  name="crown" size={19}/>
                              </View>
                          </View> 

                    </AnuncioContainer>
                  </Swipeable>
                }
                contentContainerStyle={styles.productList}
              />



                <FlatList
                  data={premiumCartoesEstab}
                  keyExtractor={() => this.makeid(17)}
                  renderItem={({item}) => 
                  <Swipeable
                    renderRightActions={this.RightAction}
                    onSwipeableRightOpen={() => this.AddToFav(item.idCartao, item)}
                  > 

                    <AnuncioContainer>
                              <View style={{flexDirection:'row'}}>
                                  {item.videoPublish == null ?
                                    <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                    :
                                    <Video 
                                      source={{ uri: item.videoPublish }}
                                      rate={1.0}
                                      volume={0}
                                      isMuted={false}
                                      resizeMode="cover"
                                      shouldPlay
                                      isLooping
                                      style={{ width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20 }}
                                    />
                                  }
                                  <View style={{flexDirection:'column', }}>
                                    <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>

                                    {this.cutDescription(item.description)}

                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <View style={{flexDirection:'row', marginTop:15}}>
                                      <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                      <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19}/>
                                  </View>

                                  <View style={{flexDirection:'row', marginTop: 24, marginRight: 20}}>
                                      <IconResponsive  name="briefcase" size={19}/>
                                      <IconResponsive style={{marginLeft:10}}  name="crown" size={19}/>
                                </View>
                              </View> 

                    </AnuncioContainer>
                  </Swipeable>
                }
                contentContainerStyle={styles.productList}
              />

              

              <FlatList
                data={cartoesAuto}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 
                  <Swipeable
                    renderRightActions={this.RightAction}
                    onSwipeableRightOpen={() => this.AddToFav(item.idCartao, item)}
                    enabled={isOpen}
                  > 

                    <AnuncioContainer>
                          <View style={{flexDirection:'row'}}>
                              {item.videoPublish == null ?
                                    <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                    :
                                    <Video 
                                      source={{ uri: item.videoPublish }}
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
                                <Title style={{fontSize: this.responsibleFont()}}>{item.nome}</Title>

                                {this.cutDescription(item.description)}

                              </View>
                          </View>  

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                              <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                  <TextDetails>Ver Detalhes</TextDetails>
                              </TouchableDetails>

                              <View style={{flexDirection:'row', marginTop:15}}>
                                  <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                  <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19}/>
                              </View>

                              <View style={{marginTop: 24, marginRight: 30}}>
                                  <IconResponsive  name="user-tie" size={19}/>
                              </View>
                          </View> 

                    </AnuncioContainer>
                  </Swipeable>
                }
                contentContainerStyle={styles.productList}
              />

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
            </View>

            <View>
              <FlatList
                data={cartoesEstab}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 
                  <Swipeable
                    renderRightActions={this.RightAction}
                    onSwipeableRightOpen={() => this.AddToFav(item.idCartao, item)}
                  > 

                    <AnuncioContainer>
                              <View style={{flexDirection:'row'}}>
                                  {item.videoPublish == null ?
                                    <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                    :
                                    <Video 
                                      source={{ uri: item.videoPublish }}
                                      rate={1.0}
                                      volume={0}
                                      isMuted={false}
                                      resizeMode="cover"
                                      shouldPlay
                                      isLooping
                                      style={{ width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20 }}
                                    />
                                  }
                                  <View style={{flexDirection:'column', }}>
                                    <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>

                                    {this.cutDescription(item.description)}

                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <View style={{flexDirection:'row', marginTop:15}}>
                                      <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                      <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19}/>
                                  </View>

                                  <View style={{marginTop: 24, marginRight: 30}}>
                                      <IconResponsive  name="briefcase" size={19}/>
                                </View>
                              </View> 

                    </AnuncioContainer>
                  </Swipeable>
                }
                contentContainerStyle={styles.productList}
              />
            
            </View>

          </ScrollView>


          <View style={{justifyContent: 'center',alignItems: 'center', padding: 8}}>
            <SwipeLeft>
                <SmallText>
                      {`Deslize para a esquerda para favoritar`}
                </SmallText>
            </SwipeLeft>
          </View>
      </SafeBackground>
    );
  }
}
