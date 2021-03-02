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
  Platform,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';

// import components
import {SmallText} from '../../components/text/CustomText';

//import GestureHandler
import Swipeable from 'react-native-gesture-handler/Swipeable';


//import firebase
import firebase from '../../config/firebase';


const fotoCartaoVisita = require('../../assets/img/smile.jpg');

// import colors
import Colors from '../../theme/colors';

// CartA Config
const EMPTY_STATE_ICON = 'cart-remove';

//CSS responsivo
import {SafeBackground, IconResponsive,TextDetails, Description, IconResponsiveNOBACK, TouchableDetails, Favorite, Heading, AnuncioContainer, ValueField, Title, SwipeLeft} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
  }
});

// CartA
export default class FavoritesA extends Component {
  static contextType = ThemeContext
  
  constructor(props) {
    super(props);

    this.state = {
      total: 0.0,
      favorite: false,
      cartoesEstab: [],
      cartoesAuto: [],
      isFetchedPublish: false,
      switchSwipeState: true,
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
    let currentUser = firebase.auth().currentUser.uid;

    await firebase.firestore().collection('usuarios').doc(currentUser).collection('favoritos').where("type", "==", "Autonomo").where("verified", "==", true).onSnapshot(documentSnapshot => {
      let cartoesAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
          photo: doc.data().photo,
          description: doc.data().description,
          type: doc.data().type,
          categoria: doc.data().categoria,
          phone: doc.data().phoneNumberAuto,
        })
      })
      e.setState({cartoesAuto: cartoesAutoDidMount})

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    await firebase.firestore().collection('usuarios').doc(currentUser).collection('favoritos').where("type", "==", "Estabelecimento").where("verified", "==", true).onSnapshot(documentSnapshot => {
      let cartoesEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesEstabDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
          photo: doc.data().photo,
          local: doc.data().localEstab,
          title: doc.data().title,
          description: doc.data().description,
          phone: doc.data().phoneNumberEstab,
          timeOpen: doc.data().timeOpen,
          timeClose: doc.data().timeClose,
          type: doc.data().type,
          verified: doc.data().verifiedPublish,
          categoria: doc.data().categoria,
          workDays: doc.data().workDays
        })

      })
      e.setState({cartoesEstab: cartoesEstabDidMount})

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


  RightAction() {
      return(
        <TouchableWithoutFeedback style={{width: 336, height: 170, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:5, marginTop: 10, borderRadius: 10, opacity:0.5}}>
            <IconResponsiveNOBACK style={{marginRight:40}} name="trash-alt" size={24}/>
            <Favorite>Deletado</Favorite>
        </TouchableWithoutFeedback>
      );
  }



  RemoveFav(id) {
    let currentUser = firebase.auth().currentUser.uid;
      firebase.firestore().collection('usuarios').doc(currentUser).collection('favoritos').where("idCartao", "==", id).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
          doc.ref.delete();
        })
    })
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
  render() {
    const {cartoesAuto, cartoesEstab, products, isFetchedPublish, switchSwipeState} = this.state;

    return (

      <SafeBackground>

        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "white-content" : "dark-content"}
        />
        

        <View style={{alignItems:'center', paddingTop:16}}>
          {this.context.dark ? 
            <Image source={require("../../../assets/nobacklogo.png")} style={{height:54, width:54, justifyContent:'center'}}/>
            :
            <Image source={require("../../../assets/nobackblack.png")} style={{height:54, width:54, justifyContent:'center'}}/>
          }      
        </View>

        <View style={styles.titleContainer}>
          <Heading>Favoritos</Heading>
        </View>

          <ScrollView>
            <View>

              {cartoesAuto.length == 0 && cartoesEstab.length == 0 &&
                <View style={{flex:1, alignItems:'center', paddingTop:70, marginLeft:30}}>
                  <Heading>Parece que você ainda não tem nenhum cartão favoritado :(</Heading>
                </View>
              }
              
              <FlatList
                data={cartoesAuto}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 
                  <Swipeable
                    renderLeftActions={this.RightAction}
                    onSwipeableLeftOpen={() => this.RemoveFav(item.idCartao)}
                  > 

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
                                <Title>{item.nome}</Title>

                                {this.cutDescription(item.description)}

                              </View>
                          </View>  

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                              <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                  <TextDetails>+ detalhes</TextDetails>
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

            </View>

            <View>
              <FlatList
                data={cartoesEstab}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 
                  <Swipeable
                    renderLeftActions={this.RightAction}
                    onSwipeableLeftOpen={() => this.RemoveFav(item.idCartao)}
                  > 

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
                                  <View style={{flexDirection:'column', }}>
                                    <Title>{item.title}</Title>

                                    {this.cutDescription(item.description)}

                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>+ detalhes</TextDetails>
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
                      {`Deslize para a direita para excluir`}
                </SmallText>
            </SwipeLeft>
          </View>
      </SafeBackground>
    );
  }
}
