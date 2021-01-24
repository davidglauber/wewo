/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  I18nManager,
  ImageBackground,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
} from 'react-native';


//import firebase 
import firebase from '../../config/firebase';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

// import components
import TouchableItem from '../../components/TouchableItem';

import {SafeBackground, IconResponsive, TouchableFilter, Description, AnuncioContainer, TouchableFilterUnselected, Heading, TextFilter, Title, ValueField, TouchableDetails, TextDetails} from '../home/styles';

// import colors
import Colors from '../../theme/colors';

import { Video } from 'expo-av';

// SearchA Config
const isRTL = I18nManager.isRTL;

// SearchA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '700',
    textAlign: 'left',
  },
  inputContainer: {
    marginHorizontal: 16,
    paddingBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    paddingLeft: 8,
    paddingRight: 51,
    height: 46,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 4,
    backgroundColor: '#DAA520',
    overflow: 'hidden',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
  },
  categoriesList: {
    paddingBottom: 10,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    height: 100,
    resizeMode: 'cover',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    padding: 16,
    fontWeight: '700',
    fontSize: 18,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

// SearchA
export default class SearchA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:'Autonomo',
      textSearch: '',
      activesPublishesEstab:[],
      activesPublishesAuto: [],
      cartoesEstab: [],
      cartoesAuto: [],
      modalVisible: false,
      categories: [
        {
          key: 1,
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'Pizza',
        },
        {
          key: 2,
          imageUri: require('../../assets/img/meat_1.jpg'),
          name: 'Grill',
        },
        {
          key: 3,
          imageUri: require('../../assets/img/spaghetti_2.jpg'),
          name: 'Pasta',
        },
        {
          key: 4,
          imageUri: require('../../assets/img/soup_1.jpg'),
          name: 'Soups',
        },
        {
          key: 5,
          imageUri: require('../../assets/img/salad_1.jpg'),
          name: 'Salads',
        },
        {
          key: 6,
          imageUri: require('../../assets/img/cake_2.jpg'),
          name: 'Dessert',
        },
      ],
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;

    Keyboard.dismiss();

    navigation.navigate(screen);
  };

  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(15, Height);
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
            description: doc.data().descriptionEstab,
            phone: doc.data().phoneNumberEstab,
            type: doc.data().type,
            verified: doc.data().verifiedPublish,
            value: doc.data().valueServiceEstab
          })
        })
  
  
        e.setState({activesPublishesEstab: anunciosAtivosEstab})
        this.setModalVisible(false)
      })

      await firebase.firestore().collection('cartoes').where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).where("titleEstabArray", "array-contains", titlePublish).onSnapshot(documentSnapshot => {
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
            description: doc.data().descriptionAuto,
            type: doc.data().type,
            phone: doc.data().phoneNumberAuto,
            verified: doc.data().verifiedPublish,
            value: doc.data().valueServiceAuto
          })
        })
  
  
        e.setState({activesPublishesAuto: anunciosAtivosAuto})
        this.setModalVisible(false)
  
      })



      await firebase.firestore().collection('cartoes').where("type", "==", "Autonomo").where("verifiedPublish", "==", true).where("titleAutoArray", "array-contains", titlePublish).onSnapshot(documentSnapshot => {
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
  
      })
    }

  }

  keyExtractor = (item, index) => index.toString();

  onChangeTextoSearch(text){
    this.setState({textSearch: text})

    if(text == ''){
      this.setState({activesPublishesEstab: []})
      this.setState({cartoesEstab: []})
      this.setState({activesPublishesAuto: []})
      this.setState({cartoesAuto: []})
    } else {
      return null;
    }
    console.log('texto pesquisa'  + this.state.textSearch)
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

  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading style={styles.titleText}>Pesquisar</Heading>
        </View>

        <View style={{flexDirection:'row'}}>
                  { this.state.type == 'Estabelecimento' &&
                    <View style={{flexDirection:'row'}}>
                      <TouchableFilterUnselected onPress={() => this.setState({type: 'Autonomo'})}>
                        <TextFilter style={{color:'black'}}>Autônomo</TextFilter>
                      </TouchableFilterUnselected>

                      <TouchableFilter>
                        <TextFilter>Estabelecimento</TextFilter>
                      </TouchableFilter>
                    </View>
                  }

                  { this.state.type == 'Autonomo' &&
                    <View style={{flexDirection:'row'}}>
                      <TouchableFilter>
                        <TextFilter>Autônomo</TextFilter> 
                      </TouchableFilter>

                      <TouchableFilterUnselected onPress={() => this.setState({type: 'Estabelecimento'})}>
                        <TextFilter style={{color:'black'}}>Estabelecimento</TextFilter>
                      </TouchableFilterUnselected>
                    </View>
                  }
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite o título do cartão ou anúncio..."
            returnKeyType="search"
            maxLength={50}
            value={this.state.textSearch}
            onChangeText={text => this.onChangeTextoSearch(text)}
            style={styles.textInput}
          />
          <View style={styles.searchButtonContainer}>
            <TouchableItem
              onPress={() => this.getPublishes(this.state.textSearch)}
              // borderless
            >
              <View style={styles.searchButton}>
                <IconResponsive
                  name="search"
                  size={20}
                />
              </View>
            </TouchableItem>
          </View>
        </View>

        <View style={styles.container}>
        {this.state.activesPublishesEstab.length !== 0 &&
          <FlatList 
          keyExtractor={() => this.makeid(17)}
          data={this.state.activesPublishesEstab}
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
        }


            {this.state.activesPublishesAuto.length !== 0 &&
              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={this.state.activesPublishesAuto}
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
            }

              {this.state.cartoesAuto.length !== 0 &&
              <FlatList
                data={this.state.cartoesAuto}
                keyExtractor={() => this.makeid(17)}
                renderItem={({item}) => 

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
                }
              />
              }

          {this.state.activesPublishesAuto.length == 0 && this.state.activesPublishesEstab.length == 0 && this.state.cartoesAuto.length == 0 && this.state.cartoesEstab.length == 0 &&
            <Text>Nenhum resultado encontrado!</Text>
          }
        </View>
      </SafeBackground>
    );
  }
}
