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

import {SafeBackground, IconResponsive, IconResponsive2, IconResponsiveNOBACK, TouchableFilter, Description, AnuncioContainer, TouchableFilterUnselected, Heading, TextFilter, Title, ValueField, TouchableDetails, TextDetails, TextSearch} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

// import colors
import Colors from '../../theme/colors';

import { Video } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';

// SearchA Config
const isRTL = I18nManager.isRTL;

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    marginHorizontal: 6
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
  headerSty: {
    flexDirection:'column', 
    justifyContent:'center', 
    alignItems:"center", 
    marginLeft: windowWidth/27
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
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      type:'Autonomo',
      textSearch: '',
      activesPublishesEstab:[],
      activesPublishesAuto: [],
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
            premiumUser: doc.data().premiumUser,
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
  
  
        e.setState({activesPublishesAuto: anunciosAtivosAuto})
        this.setModalVisible(false)
  
      })

    }

  }

  keyExtractor = (item, index) => index.toString();

  onChangeTextoSearch(text){
    this.setState({textSearch: text})

    if(text == ''){
      this.setState({activesPublishesEstab: []})
      this.setState({activesPublishesAuto: []})
    } else {
      return null;
    }
    console.log('texto pesquisa'  + this.state.textSearch)
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

  render() {
    return (
      <SafeBackground>
        <StatusBar
         backgroundColor={this.context.dark ? '#3E3C3F' : '#E98D0A'}
         barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

          {this.context.dark ?
             <View style={{flexDirection:"row", backgroundColor:'#3E3C3F'}}>
              <View style={{flexDirection: 'row', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
                <Image source={require("../../../assets/logobold.png")} style={{height:104, width:104}}/>
                <View style={{marginTop: windowHeight/28, marginLeft: windowWidth/22}}>
                  <TextSearch
                    placeholder="Pesquise aqui..."
                    placeholderTextColor={this.context.dark ? '#DAA520' : '#3E3C3F'}
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
              </View>


              {this.state.type == 'Estabelecimento' &&
                <View style={styles.headerSty}>
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
                <View style={styles.headerSty}>
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
                <View style={{flexDirection: 'row', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12}}>
                  <Image source={require("../../../assets/LOGOICONEAPP.png")} style={{height:104, width:104}}/>
                  <View style={{marginTop: windowHeight/28, marginLeft: windowWidth/22}}>
                    <TextSearch
                      placeholder="Pesquise aqui..."
                      placeholderTextColor={this.context.dark ? '#DAA520' : '#3E3C3F'}
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
                </View>


                {this.state.type == 'Estabelecimento' &&
                  <View style={styles.headerSty}>
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
                  <View style={styles.headerSty}>
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




        <View style={styles.titleContainer}>
          <Heading style={styles.titleText}>Resultados:</Heading>
        </View>

        <View style={styles.container}>
        {this.state.activesPublishesEstab.length !== 0 &&
          <FlatList 
          keyExtractor={() => this.makeid(17)}
          data={this.state.activesPublishesEstab}
          renderItem={({item}) =>
          
          <View style={{flex:1, alignItems: 'center'}}>
              <View>
              <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                  <View style={{flexDirection:'row'}}>
                      {item.video == null ?
                          <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                          :
                          <Video 
                            source={{ uri: item.video }}
                            rate={1.0}
                            volume={0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={{ width:128, height:100, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20 }}
                          />
                        }
                        
                      <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                              <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                            </View>
                              {this.cutDescription(item.description)}
                            <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                <ValueField>{item.value}</ValueField>
                            </View>
                      </View>
                      <View style={{flexDirection:'row', position:'absolute', left: windowWidth/1.15, marginTop:15}}>
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


            {this.state.activesPublishesAuto.length !== 0 &&
              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={this.state.activesPublishesAuto}
                renderItem={({item}) =>
                
                
                <View style={{flex:1, alignItems: 'center'}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                              <View style={{flexDirection:'row'}}>
                                  {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/24, marginTop: 20}}
                                      />
                                    }

                                  <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                        </View>
                                  </View>
                                  <View style={{flexDirection:'row', position:'absolute', left: windowWidth/1.15, marginTop:15}}>
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

          {this.state.activesPublishesAuto.length == 0 && this.state.activesPublishesEstab.length == 0 &&
            <Text style={{color: this.context.dark ? '#fff' : '#000'}}>Nenhum resultado encontrado!</Text>
          }
        </View>
      </SafeBackground>
    );
  }
}
