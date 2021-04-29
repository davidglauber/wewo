
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal,
  Dimensions,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Color from 'color';



// import colors
import Colors from '../../theme/colors';

import firebase from '../../config/firebase'; 

import { PulseIndicator } from 'react-native-indicators';


import { SafeBackground, Title, AnuncioContainer, PlusContainer, PlusIcon, Description, IconResponsiveNOBACK, TouchableDetails, TextDetails, IconResponsive, Heading } from '../home/styles';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import { ThemeContext } from '../../../ThemeContext';

//MODULE IAP
import {purchased} from '../../config/purchase';

import { Video } from 'expo-av';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


// HomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
    marginRight:30
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 8,
  },
  cardImg: {borderRadius: 4},
  card: {
    marginLeft: 8,
    width: 104,
    height: 72,
    resizeMode: 'cover',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  productsList: {
    paddingBottom: 16,
    // spacing = paddingHorizontal + ActionProductCard margin = 12 + 4 = 16
    paddingHorizontal: 12,
  },
  popularProductsList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});

export default class TelaPrincipalAnuncio extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      anunciosEstab: [],
      anunciosAuto:[],
      isFetchedPublish: false,
      modalVisible: true,
      idMPState: '',
      accTK: ''
    };
  }



  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  async componentDidMount() {
    let e = this;
    let currentUserUID = firebase.auth().currentUser.uid;

    await firebase.firestore().collection(`usuarios/${currentUserUID}/anuncios`).where("type", "==", "Autonomo").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let anunciosAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        anunciosAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idAnuncio: doc.data().idAnuncio,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          title: doc.data().titleAuto,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          phone: doc.data().phoneNumberAuto,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({anunciosAuto: anunciosAutoDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    await firebase.firestore().collection(`usuarios/${currentUserUID}/anuncios`).where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let anunciosEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        anunciosEstabDidMount.push({
          idUser: doc.data().idUser,
          photo: doc.data().photoPublish,
          video: doc.data().videoPublish,
          idAnuncio: doc.data().idAnuncio,
          title: doc.data().titleEstab,
          description: doc.data().descriptionEstab,
          phone: doc.data().phoneNumberEstab,
          type: doc.data().type,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({anunciosEstab: anunciosEstabDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })


    //pegar o id mp do usuario
    await firebase.firestore().collection('usuarios').doc(currentUserUID).onSnapshot(documentSnapshot => {
      if(documentSnapshot.data().idMP) {
        this.setState({idMPState: documentSnapshot.data().idMP})
      } else {
        return null
      }

      if(documentSnapshot.data().accessTK) {
        this.setState({accTK: documentSnapshot.data().accessTK})
      } else {
        return null
      }
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

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };


  async verifyNumberOfPublises() {
    let currentUserUID = firebase.auth().currentUser.uid;
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto');

    firebase.firestore().collection(`usuarios/${currentUserUID}/anuncios`).where("verifiedPublish", "==", true).get().then(documentSnapshot => {
      let anunciosDidMount = []
      documentSnapshot.forEach(function(doc) {
        anunciosDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idAnuncio: doc.data().idAnuncio,
          photo: doc.data().photoPublish,
          title: doc.data().titleAuto,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          phone: doc.data().phoneNumberAuto,
          verified: doc.data().verifiedPublish
        })
      })
      

      if(this.state.idMPState == '') {
        alert('Você precisa vincular sua conta Mercado Pago para receber pagamentos')
        this.props.navigation.navigate('MLConfigAccount')
      }

      if(anunciosDidMount.length  < 3 && this.state.idMPState !== '') {
        this.props.navigation.navigate('Orders')
      }


      if(comprou == true) {
        if(anunciosDidMount.length <= 15 && this.state.idMPState !== '') {
          this.props.navigation.navigate('Orders')
        }
      } 

      if(comprou == false) {
        if(anunciosDidMount.length >= 3 && this.state.idMPState !== '') {
          alert('A conta Free permite até 3 anúncios, consulte a tela de PLANOS para mais informações')
        }

        if(anunciosDidMount.length  < 3 && this.state.idMPState !== '') {
          this.props.navigation.navigate('Orders')
        }
      }
      console.log('TAMANHO DA LISTA DE ANUNCIOS:> ' + anunciosDidMount)
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

  deletePublishOfMainRoute(itemToBeDeletedFunction){
    let userUID = firebase.auth().currentUser.uid;
    firebase.firestore().collection('usuarios').doc(userUID).collection('anuncios').where("idAnuncio", "==", itemToBeDeletedFunction).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })

    firebase.firestore().collection('anuncios').where("idAnuncio", "==", itemToBeDeletedFunction).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })
  }


  deletePublish(itemToBeDeleted) {
    let userUID = firebase.auth().currentUser.uid;
    Alert.alert(
      'Atenção!!!',
      'Você tem certeza que quer deletar este anúncio?',
      [
        {text: 'Não', onPress: () => {}},
        {text: 'Sim', onPress: () => this.deletePublishOfMainRoute(itemToBeDeleted)}
      ]
    )
  }


  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(15, Height);
  }


 
  render() {
    const {anunciosEstab, anunciosAuto, isFetchedPublish} = this.state;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <View style={styles.container}>

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
          
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                  <Heading style={styles.titleText}>Anúncios Ativos</Heading>
                </View>

                <PlusContainer onPress={() => this.verifyNumberOfPublises()}>
                    <PlusIcon  name="plus" size={19}/>
                </PlusContainer>

              </View>


            </View>

                {anunciosEstab.length == 0 && anunciosAuto.length == 0 &&
                    <View style={{flex:1, alignItems:'center', paddingTop: 75}}>
                        <View>
                          <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                          <Text style={{fontWeight:'bold'}}>Nenhum Anúncio Ativo Foi Encontrado</Text>
                        </View>
                    </View>
                }



                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                      <FlatList
                        keyExtractor={() => this.makeid(17)}
                        data={anunciosAuto}
                        renderItem={({item}) => 
                            <AnuncioContainer style={{ width: 336,
                              height: 170,
                              marginBottom:5,
                              marginTop: 10,
                              borderRadius: 30}} onPress={() => this.props.navigation.navigate('', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
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
                                    <Title style={{fontSize: this.responsibleFont(),  fontSize:17, marginTop:20, fontWeight: 'bold', marginLeft:20}}>{item.title}</Title>

                                    {this.cutDescription(item.description)}
                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row'}}>

                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarAnuncio', {idAnuncio: item.idAnuncio, type: item.type})} style={{marginTop: 24, marginLeft:100}}>
                                      <IconResponsive  name="pencil-alt" size={19}/>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idAnuncio)} style={{marginTop: 24,marginLeft:50}}>
                                      <IconResponsive  name="trash" size={19}/>
                                  </TouchableOpacity>

                                  <View style={{marginTop: 24, marginLeft:50}}>
                                      <IconResponsive  name="user-tie" size={19}/>
                                </View>
                              </View> 

                            </AnuncioContainer>
                        }
                      />
                    </View>
                </View>

                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                      <FlatList
                        keyExtractor={() => this.makeid(17)}
                        data={anunciosEstab}
                        renderItem={({item}) => 
                        <AnuncioContainer style={{ width: 336,
                          height: 170,
                          marginBottom:5,
                          marginTop: 10,
                          borderRadius: 30}} onPress={() => this.props.navigation.navigate('', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
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
                                <Title style={{fontSize: this.responsibleFont(),  fontSize:17, marginTop:20, fontWeight: 'bold', marginLeft:20}}>{item.title}</Title>

                                {this.cutDescription(item.description)}
                              </View>
                          </View>  

                            <View style={{flexDirection: 'row'}}>

                              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarAnuncio', {idAnuncio: item.idAnuncio, type: item.type})} style={{marginTop: 24, marginLeft:100}}>
                                  <IconResponsive  name="pencil-alt" size={19}/>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => this.deletePublish(item.idAnuncio)} style={{marginTop: 24,marginLeft:50}}>
                                  <IconResponsive  name="trash" size={19}/>
                              </TouchableOpacity>

                              <View style={{marginTop: 24, marginLeft:50}}>
                                  <IconResponsive  name="briefcase" size={19}/>
                            </View>
                          </View> 

                        </AnuncioContainer>
                        }
                      />
                    </View>
                  </View>
          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
