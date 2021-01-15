
// import dependencies
import React, {Component} from 'react';
import {
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Color from 'color';


// import components
import {Heading6} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';

import firebase from '../../config/firebase'; 

import LottieView from 'lottie-react-native';

//import icons
import { FontAwesome5 } from '@expo/vector-icons';

import { SafeBackground, Title, AnuncioContainer, ValueField, TouchableDetails, TextDetails, IconResponsive, Heading } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


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
    color: 'white'
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

export default class TelaCartaoPendente extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      cartoesEstab: [],
      cartoesAuto:[],
      statusVerified: false
    };
  }






  async componentDidMount() {
    let e = this;
    let currentUserUID = firebase.auth().currentUser.uid;

    await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Autonomo").where("verifiedPublish", "==", false).onSnapshot(documentSnapshot => {
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
      })
  
      await firebase.firestore().collection(`usuarios/${currentUserUID}/cartoes`).where("type", "==", "Estabelecimento").where("verifiedPublish", "==", false).onSnapshot(documentSnapshot => {
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





  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };


  cutDescription(text) {
    if(text.length > 40) {
      let shortDescription = text.substr(0, 40)

      return(
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{textAlign:'center', fontSize:12, marginTop:20, marginRight:170, fontWeight: '500', marginLeft:25, color:'#888888'}}>{shortDescription} ...</Text>
        </View>
      );
    } else {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{textAlign:'center', fontSize:12, marginTop:20, marginRight:170, fontWeight: '500', marginLeft:25, color:'#888888'}}>{text}</Text>
        </View>
      );
    }
  }


  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };


  deletePublish(itemToBeDeleted) {
    let userUID = firebase.auth().currentUser.uid;
    Alert.alert(
      'Atenção!!!',
      'Você tem certeza que quer deletar este anúncio?',
      [
        {text: 'Não', onPress: () => {}},
          {text: 'Sim', onPress: () => firebase.firestore().collection('usuarios').doc(userUID).collection('cartoes').where("idCartao", "==", itemToBeDeleted).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc){
              doc.ref.delete();
            })
          })}
      ]
    )
  }



  render() {
    const {cartoesEstab, cartoesAuto} = this.state;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "white-content" : "dark-content"}
        />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <TouchableOpacity onPress={() => this.goBack()} style={{width:70, height:20}}>
                    <IconResponsive name="arrow-left" size={20}/>                
                </TouchableOpacity>
                <Heading>Cartões Pendentes</Heading>
              </View>
            </View>


                  {cartoesEstab.length == 0 && cartoesAuto.length == 0 &&
                    <View style={{flex:1, alignItems:'center', paddingTop:5}}>
                      <View>
                        <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                        <Text style={{fontWeight:'bold', color:'white'}}>Nenhum Cartão Pendente Foi Encontrado</Text>
                      </View>
                    </View>
                  }


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
                                    <Title>{item.nome}</Title>

                                    {this.cutDescription(item.description)}

                                    <View style={{flexDirection:'row', paddingHorizontal:15}}>
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
                                      <FontAwesome5  name="pencil-alt" size={19} color={"grey"} />
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24, marginRight: 10}}>
                                      <FontAwesome5  name="trash" size={19} color={"grey"} />
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
                                    <Title>{item.title}</Title>

                                    {this.cutDescription(item.description)}

                                    <View style={{flexDirection:'row', paddingHorizontal:45}}>
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
                                      <FontAwesome5  name="pencil-alt" size={19} color={"grey"} />
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idCartao)} style={{marginTop: 24, marginRight: 10}}>
                                      <FontAwesome5  name="trash" size={19} color={"grey"} />
                                  </TouchableOpacity>

                                  <View style={{marginTop: 24, marginRight: 30}}>
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
