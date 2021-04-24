
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  Modal,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Color from 'color';

import firebase from '../../config/firebase';


//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

// import colors
import Colors from '../../theme/colors';

import { Modalize } from 'react-native-modalize';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

import { PulseIndicator } from 'react-native-indicators';

import { SafeBackground, Title, AnuncioContainer, PlusContainer, PlusIcon, Description, TouchableDetails, ValueField, TextDetails, IconResponsive, Heading } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

import { FontAwesome5 } from '@expo/vector-icons';

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

export default class TelaGeralCriarCartao extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      cartoesEstab: [],
      cartoesAuto: [],
      email:'',
      nome:'',
      dataNascimento:'',
      foto:'',
      text:'',
      premium: false,
      telefone:'',
      tipoDeConta:"",
      isFetchedPublish: false,
      modalVisible: true,
      modalizeRef: React.createRef(null),
      idMP: ''
    };
  }

  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }



  async componentDidMount() {
    let e = this;
    let currentUserUID = firebase.auth().currentUser.uid;

    await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Autonomo").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let cartoesAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesAutoDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
          photo: doc.data().photoPublish,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          categoria: doc.data().categoryAuto,
          phone: doc.data().phoneNumberAuto,
        })
      })
      e.setState({cartoesAuto: cartoesAutoDidMount})
      this.setModalVisible(false)

      this.sleep(1000).then(() => { 
        e.setState({isFetchedPublish: true})
      })
    })

    await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Estabelecimento").where("verifiedPublish", "==", true).onSnapshot(documentSnapshot => {
      let cartoesEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesEstabDidMount.push({
          idUser: doc.data().idUser,
          idCartao: doc.data().idCartao,
          video: doc.data().videoPublish,
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

    await firebase.firestore().collection('usuarios').doc(currentUserUID).onSnapshot(documentSnapshot => {
      e.setState({email: documentSnapshot.data().email})
      e.setState({nome: documentSnapshot.data().nome})
      e.setState({dataNascimento: documentSnapshot.data().dataNascimento})
      e.setState({foto: documentSnapshot.data().photoProfile})
      e.setState({premium: documentSnapshot.data().premium})
      e.setState({telefone: documentSnapshot.data().telefone})
      e.setState({text: documentSnapshot.data().textPortfolio})
      e.setState({tipoDeConta: documentSnapshot.data().tipoDeConta})
      e.setState({idMP: documentSnapshot.data().idMP})
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

 onChangeText(text) {
  this.setState({text: text})
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
      firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').where("idCartao", "==", itemToBeDeletedFunction).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
          doc.ref.delete();
      })
    })

    firebase.firestore().collection('cartoes').where("idCartao", "==", itemToBeDeletedFunction).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })
  }


  deletePublish(itemToBeDeleted) {
    let userUID = firebase.auth().currentUser.uid;
    Alert.alert(
      'Atenção!!!',
      'Você tem certeza que quer deletar este cartão?',
      [
        {text: 'Não', onPress: () => {}},
        {text: 'Sim', onPress: () => this.deletePublishOfMainRoute(itemToBeDeleted)}
      ]
    )
  }



  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  async closeDescription(){
    let e = this;
    let currentUserUID = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('usuarios').doc(currentUserUID).set({
      email: e.state.email,
      dataNascimento: e.state.dataNascimento,
      photoProfile: e.state.foto,
      premium: e.state.premium,
      telefone: e.state.telefone,
      nome: e.state.nome,
      textPortfolio: e.state.text,
      tipoDeConta: e.state.tipoDeConta,
      idMP: e.state.idMP
    })
    
    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.close()
  }


  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  async verifyNumberOfPublises() {
    let currentUserUID = firebase.auth().currentUser.uid;
    let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto');

    firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("verifiedPublish", "==", true).get().then(documentSnapshot => {
      let cartoesDidMount = []
      documentSnapshot.forEach(function(doc) {
        cartoesDidMount.push({
          idUser: doc.data().idUser,
          nome: doc.data().nome,
          idCartao: doc.data().idCartao,
          photo: doc.data().photoPublish,
          description: doc.data().descriptionAuto,
          type: doc.data().type,
          categoria: doc.data().categoryAuto,
          phone: doc.data().phoneNumberAuto,
        })
      })



      if(cartoesDidMount.length  < 7) {
        this.props.navigation.navigate('TelaCriarCartaoVisita')
      }


      if(comprou == true) {
        if(cartoesDidMount.length <= 100) {
          this.props.navigation.navigate('TelaCriarCartaoVisita')
        }
      } 

      if(comprou == false) {
        if(cartoesDidMount.length >= 7) {
          alert('A conta free permite até 7 Portfólios/Produtos, consulte a tela de PLANOS para mais informações')
        }

        if(cartoesDidMount.length  < 7) {
          this.props.navigation.navigate('TelaCriarCartaoVisita')
        }
      }

      console.log('TAMANHO DA LISTA DE CARTOES:> ' + cartoesDidMount)
    })

  }

  waitQueryToShowNotFoundGIF() {
    if(this.state.cartoesAuto.length == 0 && this.state.cartoesEstab.length == 0) {
        return( 
          <View style={{flex:1, alignItems:'center', paddingTop: 80}}>
            <View>
              <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
              <Text style={{fontWeight:'bold', color:'white'}}>Nenhum Cartão Ativo Foi Encontrado</Text>
            </View>
          </View>
        );
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  responsibleFont() {
    let Height = Dimensions.get('window').height
    return RFValue(15, Height);
  }
 

  render() {
    const {cartoesAuto, cartoesEstab, isFetchedPublish} = this.state;

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
                {this.state.tipoDeConta == 'Autonomo' &&
                  <Heading style={{marginLeft: 30, marginRight: 34}}>Portfólios Ativos</Heading>
                }

                {this.state.tipoDeConta == 'Estabelecimento' &&
                  <Heading style={{marginLeft: 30, marginRight: 34}}>Produtos Ativos</Heading>
                }

                <PlusContainer onPress={() => this.verifyNumberOfPublises()}>
                        <PlusIcon  name="plus" size={19}/>
                </PlusContainer>
                <PlusContainer onPress={() => this.openModalize()}>
                        <PlusIcon  name="bullhorn" size={19}/>
                </PlusContainer>

              </View>


            </View>

                {this.waitQueryToShowNotFoundGIF()}


                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                    <FlatList
                        keyExtractor={() => this.makeid(17)}
                        data={cartoesAuto}
                        renderItem={({item}) => 
                        <AnuncioContainer style={{ width: 336,
                          height: 170,
                          marginBottom:5,
                          marginTop: 10,
                          borderRadius: 30}} onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
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
                                <Title style={{fontSize: this.responsibleFont(),  fontSize:17, marginTop:20, fontWeight: 'bold', marginLeft:20}}>{item.nome}</Title>

                                {this.cutDescription(item.description)}
                              </View>
                          </View>  

                            <View style={{flexDirection: 'row'}}>

                              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarCartao', {idCartao: item.idCartao, type: item.type})} style={{marginTop: 24, marginLeft:100}}>
                                  <IconResponsive  name="pencil-alt" size={19}/>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24,marginLeft:50}}>
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
                        data={cartoesEstab}
                        renderItem={({item}) => 
                        <AnuncioContainer style={{ width: 336,
                          height: 170,
                          marginBottom:5,
                          marginTop: 10,
                          borderRadius: 30}} onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
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

                              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarCartao', {idCartao: item.idCartao, type: item.type})} style={{marginTop: 24, marginLeft:100}}>
                                  <IconResponsive  name="pencil-alt" size={19}/>
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24,marginLeft:50}}>
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

          {/*Modalize do resumo de portfólio*/}
          <Modalize
            ref={this.state.modalizeRef}
            snapPoint={700}
            onClose={() => this.closeDescription()}
          >
            <View>
                  <ScrollView>
                      <TextInput
                        autoFocus={true}
                        multiline={true}
                        value={this.state.text}
                        onChangeText={text => this.onChangeText(text)}
                        underlineColorAndroid="transparent"
                        style={{padding: 20}}
                        placeholder="Dê a melhor descrição sobre você"
                      />

                      <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                          onPress={() => this.closeDescription()}
                          style={{borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor:'#DAA520', height: 40, width: 40, marginBottom:40}}
                        >
                          <FontAwesome5 name="check-circle" size={24} color={'white'}/>
                        </TouchableOpacity>
                      </View>

                  </ScrollView>
                  
            </View>
          </Modalize>
          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
