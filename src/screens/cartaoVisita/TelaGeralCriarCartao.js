
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  Modal,
  Dimensions,
  Alert,
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


import { PulseIndicator } from 'react-native-indicators';


import { SafeBackground, Title, AnuncioContainer, PlusContainer, PlusIcon, Description, TouchableDetails, ValueField, TextDetails, IconResponsive, Heading } from '../home/styles';


import { ThemeContext } from '../../../ThemeContext';

//MODULE IAP
import {purchased} from '../../config/purchase';


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
      isFetchedPublish: false,
      modalVisible: true
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
      'Você tem certeza que quer deletar este anúncio?',
      [
        {text: 'Não', onPress: () => {}},
        {text: 'Sim', onPress: () => this.deletePublishOfMainRoute(itemToBeDeleted)}
      ]
    )
  }


  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  async verifyNumberOfPublises() {
    let currentUserUID = firebase.auth().currentUser.uid;
    let comprou = await purchased('wewo.gold.mensal');

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



      if(cartoesDidMount.length  <= 1) {
        this.props.navigation.navigate('TelaCriarCartaoVisita')
      }


      if(comprou == true) {
        if(anunciosDidMount.length <= 5) {
          this.props.navigation.navigate('TelaCriarCartaoVisita')
        }
      } 

      if(comprou == false) {
        if(cartoesDidMount.length >= 2) {
          alert('A conta Free permite até 2 cartões, consulte a tela de PLANOS para mais informações')
        }

        if(cartoesDidMount.length  <= 1) {
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
              <Image style={{width:200, height:200, marginLeft:20}} source={require("../../assets/img/notfoundnoback.gif")} />
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
          barStyle={this.context.dark ? "white-content" : "dark-content"}
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
              <View style={{alignItems:'center', borderWidth:2, borderColor:'black', backgroundColor:'white', height:100, width: 200, backgroundColor:'white', borderRadius:15}}>
                <Text style={{fontWeight:'bold', marginTop:10, color:'#9A9A9A'}}>Carregando...</Text>
                <PulseIndicator color='#DAA520'/>
              </View>
            </View>
          </Modal>

          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                    <Heading style={{marginLeft: 30, marginRight: 34}}>Cartões Ativos</Heading>

                <PlusContainer onPress={() => this.verifyNumberOfPublises()}>
                        <PlusIcon  name="plus" size={19}/>
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
                            <AnuncioContainer style={{height: 190}}>
                              <View style={{flexDirection:'row'}}>
                                  <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                  
                                  <View style={{flexDirection:'column'}}>
                                    <Title style={{fontSize: this.responsibleFont()}}>{item.nome}</Title>

                                    {this.cutDescription(item.description)}

                                    <View style={{flexDirection:'row', paddingHorizontal:40}}>
                                      <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                      <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19} />
                                    </View>
                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser, nomeToZap: item.nome})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarCartao', {idCartao: item.idCartao, type: item.type})} style={{marginTop: 24, marginRight: 10}}>
                                      <IconResponsive  name="pencil-alt" size={19}/>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24, marginRight: 10}}>
                                      <IconResponsive  name="trash" size={19}/>
                                  </TouchableOpacity>

                                  <View style={{marginTop: 24, marginRight: 30}}>
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
                            <AnuncioContainer style={{height: 190}}>
                              <View style={{flexDirection:'row'}}>
                                  <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                  
                                  <View style={{flexDirection:'column', }}>
                                    <Title style={{fontSize: this.responsibleFont()}}>{item.title}</Title>

                                    {this.cutDescription(item.description)}

                                    <View style={{flexDirection:'row', paddingHorizontal:65}}>
                                      <ValueField style={{paddingTop:10, fontSize:12}}>{item.categoria}</ValueField>
                                      <IconResponsive style={{marginLeft:15, marginTop:10}} name="clone" size={19}/>
                                    </View>
                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('MostrarCartao', {idDoCartao: item.idCartao, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarCartao', {idCartao: item.idCartao, type: item.type})} style={{marginTop: 24, marginRight: 10}}>
                                      <IconResponsive  name="pencil-alt" size={19}/>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24, marginRight: 10}}>
                                      <IconResponsive  name="trash" size={19}/>
                                  </TouchableOpacity>

                                  <View style={{marginTop: 24, marginRight: 30}}>
                                      <IconResponsive  name="briefcase" size={19} />
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
