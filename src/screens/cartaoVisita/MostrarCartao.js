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
  StatusBar,
  Share,
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

//import icons
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

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

import { SafeAnuncioView, ValueFieldPrincipal, IconResponsiveNOBACK,  TouchableResponsive, ButtonIconContainer, CallAndMessageContainer, IconResponsive, Heading, TextDescription, TextTheme, TextDescription2 } from '../home/styles';


import { ThemeContext } from '../../../ThemeContext';

//import IAP API 
import {purchased} from '../../config/purchase';

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
      isFetched: false
    };
  }

  async componentDidMount() {
    let e = this;
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual')

    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }

    let idCartao = this.props.route.params.idDoCartao;
    let currentUserUID = this.props.route.params.idUserCartao;

    console.log('ID DO ANUNCIO: ' + idCartao)
    console.log('ROUTE ID USER: ' + currentUserUID)
    console.log('Numero de telefone: ' + this.state.phoneNavigator)

    await firebase.firestore().collection(`usuarios`).doc(`${currentUserUID}`).collection('cartoes').where("idCartao", "==", idCartao).where("type", "==", "Autonomo").get().then(function(querySnapshot){
      let cartaoAutoDidMount = []
      let dataAtual = ''
      querySnapshot.forEach(function(doc) {
        cartaoAutoDidMount.push({
          idUser: doc.data().idUser,
          idAnuncio: doc.data().idAnuncio,
          publishData: e.state.date,
          nome: doc.data().nome,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          photo2: doc.data().photoPublish2,
          photo3: doc.data().photoPublish3,
          phone: doc.data().phoneNumberAuto,
          categoria: doc.data().categoryAuto,
          local: doc.data().localAuto,
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
          idAnuncio: doc.data().idAnuncio,
          publishData: e.state.date,
          video: doc.data().videoPublish,
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
          timeToOpen: doc.data().timeOpen,
          timeToClose: doc.data().timeClose,
          local: doc.data().localEstab,
          workDays: doc.data().workDays,
          timeClose: doc.data().timeClose
        })
        dataAtual = doc.data().publishData
      })
      e.setState({cartaoEstab: cartaoEstabDidMount})
      e.setState({dateEstab: dataAtual})

      e.setModalVisible(false)
      e.setState({isFetched: true})
    })

    console.log('ARRAY ANUNCIO cartaoEstab: ' + this.state.cartaoEstab)
    console.log('ARRAY ANUNCIO autonomo: ' + this.state.cartaoAuto)
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

  render() {
    const {product, favorite, cartaoAuto, cartaoEstab, isFetched} = this.state;
    const {
      images,
    } = product;

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
                        <IconResponsiveNOBACK name="phone-square" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.phone}</TextTheme>
                  </View>

                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.local}</TextTheme>
                  </View>

                  <View style={{paddingHorizontal: 16, marginTop:20, marginBottom:100, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </View>



                  <View style={{flex: 1, flexDirection:'row', justifyContent:'center', marginBottom:1, bottom:40}}>
                    <CallAndMessageContainer>
                        <TouchableResponsive onPress={() => this.openPhoneApp(this.state.phoneNavigator)}>
                            <TextDescription2 style={{fontWeight:'bold', marginRight:30, marginTop:7}}>Telefonar</TextDescription2>
                            <IconResponsiveNOBACK name="mobile" size={20}/>
                        </TouchableResponsive>   

                        <TouchableResponsive>
                            <TextDescription2 onPress={() => this.openWhatsApp(this.state.phoneNavigator)} style={{fontWeight:'bold', marginRight:30, marginTop:7}}>Conversar</TextDescription2>
                            <IconResponsiveNOBACK name="comment-alt" size={20}/>
                        </TouchableResponsive>            
                    </CallAndMessageContainer>
                  </View>


                  {this.state.dateAuto == '' ? 
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateEstab}</TextDescription>
                      </View>
                    :
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateAuto}</TextDescription>
                      </View>
                  }


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
            }
          />

        </ScrollView>


















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

                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="clock" size={25}/>
                      <TextTheme style={{fontSize:15, marginLeft: 15}}>Aberto por {item.workDays} dias na semana até {item.timeClose} hrs</TextTheme>
                  </View>



                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                      <IconResponsiveNOBACK name="map-marked-alt" size={25}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.local}</TextTheme>
                  </View>


                  <View style={{paddingHorizontal: 16, marginTop:20, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="phone-square" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.phone}</TextTheme>
                  </View>

                  <View style={{paddingHorizontal: 16, marginTop:20, marginBottom:100, flexDirection:'row', alignItems: 'center'}}>
                        <IconResponsiveNOBACK name="list-alt" size={30}/>
                        <TextTheme style={{fontSize:15, marginLeft: 15}}>{item.categoria} / {item.subcategoria}</TextTheme>
                  </View>
          



                  <View style={{flex: 1, flexDirection:'row', justifyContent:'center', marginBottom:1, bottom:40}}>
                    <CallAndMessageContainer>
                        <TouchableResponsive onPress={() => this.openPhoneApp(this.state.phoneNavigator)}>
                            <TextDescription2 style={{fontWeight:'bold', marginRight:30, marginTop:7}}>Telefonar</TextDescription2>
                            <IconResponsiveNOBACK name="mobile" size={20}/>
                        </TouchableResponsive>   

                        <TouchableResponsive>
                            <TextDescription2 onPress={() => this.openWhatsApp(this.state.phoneNavigator)} style={{fontWeight:'bold', marginRight:30, marginTop:7}}>Conversar</TextDescription2>
                            <IconResponsiveNOBACK name="comment-alt" size={20}/>
                        </TouchableResponsive>            
                    </CallAndMessageContainer>
                  </View>


                  {this.state.dateAuto == '' ? 
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateEstab}</TextDescription>
                      </View>
                    :
                      <View style={{alignItems:'center'}}>
                        <TextDescription style={{marginBottom:15, fontWeight:'bold'}}>Publicado em {this.state.dateAuto}</TextDescription>
                      </View>
                  }

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
            }
          />


        </ScrollView>

      </SafeAnuncioView>
    );
  }
}
