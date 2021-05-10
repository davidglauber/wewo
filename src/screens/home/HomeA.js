
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


import { Video } from 'expo-av';


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
      categories: [],
      isFetched: false,
      isFetchedPublish: false,
      isFetchedButton: false,
      modalVisible: true,
      products: [],
      purchased: false,
      type:'Autonomo'
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

  if(Platform.OS === "android") {
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto')
  
    if(comprou == true) {
      this.setState({purchased: true})
    } else {
      this.setState({purchased: false})
    }
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

    if(Platform.OS === "android" && this.state.purchased == true) {
      null
    }

    if(Platform.OS === "ios" && this.state.purchased == true) {
      null
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
  

  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(18, Height);
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
                <View style={{flexDirection: 'row', paddingTop: 16, paddingHorizontal: 5, paddingBottom: 12}}>
                  <Image source={require("../../../assets/LOGOICONEAPP.png")} style={{height:104, width:104}}/>
                </View>

                <View style={{marginTop: windowHeight/18, marginLeft: windowWidth/54}}>
                    <TextSearch
                      placeholder="Pesquise aqui      "
                      placeholderTextColor={this.context.dark ? '#DAA520' : '#3E3C3F'}
                      returnKeyType="search"
                      maxLength={50}
                    />

                    <View style={styles.searchButtonContainer}>
                      <TouchableItem
                        onPress={() => {}}
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

            <ScrollView alwaysBounceHorizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} style={{padding:15}}>
                <FlatList
                  horizontal={true}
                  keyExtractor={() => this.makeid(17)}
                  data={categories}
                  renderItem={({item}) => 
                    <TouchCategory onPress={() => this.props.navigation.navigate('HomeCategory', {titleOfCategory: item.titleCategory})} style={{width: windowWidth/3, height:75, alignItems:'center', justifyContent:'center', borderRadius:20, marginRight: 20}}>
                      {item.titleCategory == 'Transportes' &&
                        <Image source={{uri: 'https://www.infoescola.com/wp-content/uploads/2011/04/geografia-do-transporte-1262195809.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Animais' &&
                        <Image source={{uri: 'http://s2.glbimg.com/cYa3pKAKIPidjKyGPuAd8T4Hd1I=/e.glbimg.com/og/ed/f/original/2017/08/21/dog-2570398_960_720.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }


                      {item.titleCategory == 'Lazer' &&
                        <Image source={{uri: 'https://www.marinha.mil.br/saudenaval/sites/www.marinha.mil.br.saudenaval/files/ST_saude_lazer_noticias_redes.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Comida' &&
                        <Image source={{uri: 'https://lightchef.com.br/wp-content/uploads/2019/10/Comida-Congelada-em-S%C3%A3o-Paulo-Como-pedir-no-delivery.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Administração' &&
                        <Image source={{uri: 'https://www.napratica.org.br/wp-content/uploads/2018/09/curso-de-administra%C3%A7%C3%A3o.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Negócios' &&
                        <Image source={{uri: 'https://blog.solarprime.com.br/app/uploads/2019/03/279321-gestao-de-negocios-tudo-o-que-voce-precisa-saber-sobre-o-assunto-1280x640.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Informática' &&
                        <Image source={{uri: 'https://www.wreducacional.com.br/img_cursos/prod/img_1230x644/informatica/informatica-basica.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Audio-Visual' &&
                        <Image source={{uri: 'https://ebac.art.br/upload/iblock/a9b/fil1.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Eletrodomésticos' &&
                        <Image source={{uri: 'https://i0.wp.com/amodaeparatodos.com.br/wp-content/uploads/2020/06/3-eletrodomesticos-praticos-para-ter-em-casa.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Automóveis' &&
                        <Image source={{uri: 'https://www.instacarro.com/uploads/2019/01/a41ac9a1-269180-conheca-as-principais-expectativas-para-o-mercado-de-automoveis.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Beleza' &&
                        <Image source={{uri: 'https://static1.belezaextraordinaria.com.br/articles/8/35/88/@/33352-nova-etapa-na-rotina-de-cuidados-com-a-opengraph_1200-2.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Saúde' &&
                        <Image source={{uri: 'https://ansemp.org.br/wp-content/uploads/2020/12/plano-de-sau%CC%81de-760x450-1.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Farmácias' &&
                        <Image source={{uri: 'https://s2.glbimg.com/jVnNPEN6cGzKOuxFeyTye1qWACA=/0x0:1057x585/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/O/t/IMjQQOTBKPayhaSAN7aA/medicamentos.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Market' &&
                        <Image source={{uri: 'https://www.doisamaisalimentos.com.br/wp-content/uploads/2021/01/Ambiente-Koa-14-foto_-Arne-Lee-660x330.jpeg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Música' &&
                        <Image source={{uri: 'https://www.encorda.com.br/wp-content/uploads/2019/12/original-07a3b6b19bbc223a97160238d495d34e-scaled.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Artes' &&
                        <Image source={{uri: 'https://artout.com.br/wp-content/uploads/2019/02/O-que-%C3%A9-arte-visual-1.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Construção' &&
                        <Image source={{uri: 'https://blog.obraprimaweb.com.br/wp-content/uploads/2019/12/mercado-da-constru%C3%A7%C3%A3o-civil-em-crescimento-935x614.png'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Imóveis' &&
                        <Image source={{uri: 'https://www.jornalcontabil.com.br/wp-content/uploads/2016/03/locacao-imoveis.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Turismo' &&
                        <Image source={{uri: 'https://www.saopaulo.sp.gov.br/wp-content/uploads/2020/09/turismo.png'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Aluguel' &&
                        <Image source={{uri: 'https://s2.glbimg.com/LJyz6a7REaciGEMB5i3I8m8IDrc=/0x98:2000x1200/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_f035dd6fd91c438fa04ab718d608bbaa/internal_photos/bs/2020/4/C/1YVBjWSiWp1jS38ofUoA/gettyimages-979070020.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Shows' &&
                        <Image source={{uri: 'https://www.tenhomaisdiscosqueamigos.com/wp-content/uploads/2020/04/shows-coronavirus-1280x720.jpg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Segurança' &&
                        <Image source={{uri: 'https://www.armazemdc.com.br/storage/blog/o-que-e-seguranca-de-dados.jpeg'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      {item.titleCategory == 'Educação' &&
                        <Image source={{uri: 'https://revistamelhor.com.br/wp-content/uploads/2019/10/O-poder-da-educac%CC%A7a%CC%83o.png'}} style={{width: windowWidth/3.8, height:50, borderRadius:20, marginTop:5}}></Image>
                      }

                      <Text style={{fontWeight:'bold', color: this.context.dark ? '#d98b0d' : '#fff', fontSize:13}}>{item.titleCategory}</Text>
                    </TouchCategory>
                }
                ></FlatList>

            </ScrollView>


            <View style={{flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center', paddingTop: 46, paddingHorizontal: 16, paddingBottom: 12}}>
              <Heading>Anúncios</Heading>
              <TouchableOpacity onPress={this.navigateTo('Filtro')} style={{width:20, height:20}}>
                  <IconResponsiveNOBACK  name="sort-alpha-up" size={19}/>
              </TouchableOpacity>
            </View>


            {this.state.type == 'Autonomo' &&
              <ScrollView>
                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={premiumPublishesAuto}
                  renderItem={({item}) =>
                  
                  
                  <View style={{flex:1, alignItems: 'center'}}>
                        <View>
                            <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                        <View style={{flexDirection:'row', marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <IconResponsive2 style={{marginLeft: windowWidth/3.3}}  name="crown" size={15}/>
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
              
              <FlatList 
                keyExtractor={() => this.makeid(17)}
                data={activesPublishesAuto}
                renderItem={({item}) =>
                
                
                <View style={{flex:1, alignItems: 'center'}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                              <View style={{flexDirection:'row'}}>
                                    {item.video == null ?
                                      <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20}}></Image>
                                      :
                                      <Video 
                                        source={{ uri: item.video }}
                                        rate={1.0}
                                        volume={0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                        style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20}}
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
              </ScrollView>
            }


            {this.state.type == 'Estabelecimento' &&
              <ScrollView>
                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={premiumPublishesEstab}
                  renderItem={({item}) =>
                  
                  <View style={{flex:1, alignItems: 'center'}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20 }}
                                        />
                                      }
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row', marginRight: windowWidth/4, alignItems:'flex-start', marginTop:20, marginLeft:30}}>
                                          <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>
                                        </View>
                                          {this.cutDescription(item.description)}
                                          <View style={{flexDirection:'row', marginLeft:windowWidth/15, marginTop:10, backgroundColor: this.context.dark ? '#3E3C3F' : '#f3f3f3', padding:10, borderRadius:30}}>
                                            <ValueField>{item.value}</ValueField>
                                            <IconResponsive2 style={{marginLeft: windowWidth/3.2}}  name="crown" size={15}/>
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

                <FlatList 
                  keyExtractor={() => this.makeid(17)}
                  data={activesPublishesEstab}
                  renderItem={({item}) =>
                  
                  <View style={{flex:1, alignItems: 'center'}}>
                      <View>
                      <AnuncioContainer onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                <View style={{flexDirection:'row'}}>
                                      {item.video == null ?
                                        <Image source={{uri: item.photo}} style={{width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20}}></Image>
                                        :
                                        <Video 
                                          source={{ uri: item.video }}
                                          rate={1.0}
                                          volume={0}
                                          isMuted={false}
                                          resizeMode="cover"
                                          shouldPlay
                                          isLooping
                                          style={{ width:128, height:100, borderRadius: 20, marginLeft: windowWidth/5.5, marginTop: 20 }}
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
              </ScrollView>
            }


          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
