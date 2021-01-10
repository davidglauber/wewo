
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


//import icons
import { FontAwesome5 } from '@expo/vector-icons';

import { SafeBackground, Title, AnuncioContainer, PlusContainer, PlusIcon, TouchableDetails, TextDetails, IconResponsive, Heading } from '../home/styles';

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

export default class TelaAnunciosPendentes extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);

    this.state = {
      anunciosEstab: [],
      anunciosAuto:[],
      statusVerified: false
    };
  }






  async componentDidMount() {
    let e = this;
    let currentUserUID = firebase.auth().currentUser.uid;

    await firebase.firestore().collection(`usuarios/${currentUserUID}/anuncios`).where("type", "==", "Autonomo").where("verifiedPublish", "==", false).onSnapshot(documentSnapshot => {
      let anunciosAutoDidMount = []
      documentSnapshot.forEach(function(doc) {
        anunciosAutoDidMount.push({
          idUser: doc.data().idUser,
          photo: doc.data().photoPublish,
          title: doc.data().titleAuto,
          description: doc.data().descriptionAuto,
          idAnuncio: doc.data().idAnuncio,
          phone: doc.data().phoneNumberAuto,
          type: doc.data().type,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({anunciosAuto: anunciosAutoDidMount})
    })

    await firebase.firestore().collection(`usuarios/${currentUserUID}/anuncios`).where("type", "==", "Estabelecimento").where("verifiedPublish", "==", false).onSnapshot(documentSnapshot => {
      let anunciosEstabDidMount = []
      documentSnapshot.forEach(function(doc) {
        anunciosEstabDidMount.push({
          idUser: doc.data().idUser,
          photo: doc.data().photoPublish,
          title: doc.data().titleEstab,
          idAnuncio: doc.data().idAnuncio,
          phone: doc.data().phoneNumberEstab,
          description: doc.data().descriptionEstab,
          type: doc.data().type,
          verified: doc.data().verifiedPublish
        })
      })
      e.setState({anunciosEstab: anunciosEstabDidMount})
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
    Alert.alert(
      'Atenção!!!',
      'Você tem certeza que quer deletar este anúncio?',
      [
        {text: 'Não', onPress: () => {}},
          {text: 'Sim', onPress: () => this.deletePublishOfMainRoute(itemToBeDeleted)}
      ]
    )
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };



  render() {
    const {anunciosEstab, anunciosAuto} = this.state;

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
                <IconResponsive onPress={() => this.goBack()} name="arrow-left" size={20}/>
                  <Heading>Anúncios Pendentes</Heading>
              </View>
            </View>


                  {anunciosEstab.length == 0 && anunciosAuto.length == 0 &&
                    <View style={{flex:1, alignItems:'center', paddingTop:75}}>
                      <View>
                        <Image style={{width:200, height:200, marginLeft:30}} source={require("../../assets/img/notfoundnoback.gif")} />
                        <Text style={{fontWeight:'bold'}}>Nenhum Anúncio Pendente Foi Encontrado</Text>
                      </View>
                    </View>
                  }


                <View style={{flex:1, alignItems: 'center'}}>
                    <View>
                      <FlatList
                        keyExtractor={() => this.makeid(17)}
                        data={anunciosAuto}
                        renderItem={({item}) => 
                            <AnuncioContainer>
                              <View style={{flexDirection:'row'}}>
                                  <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                  
                                  <View style={{flexDirection:'column'}}>
                                    <Title>{item.title}</Title>

                                    {this.cutDescription(item.description)}
                                  </View>
                              </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                  <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                      <TextDetails>Ver Detalhes</TextDetails>
                                  </TouchableDetails>

                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarAnuncio', {idAnuncio: item.idAnuncio, type: item.type})} style={{marginTop: 24, marginRight: 10}}>
                                      <FontAwesome5  name="pencil-alt" size={19} color={"grey"} />
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.deletePublish(item.idAnuncio)} style={{marginTop: 24, marginRight: 10}}>
                                      <FontAwesome5  name="trash" size={19} color={"grey"} />
                                  </TouchableOpacity>

                                  <View style={{marginTop: 24, marginRight: 30}}>
                                      <IconResponsive  name="user-tie" size={19} />
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
                            <AnuncioContainer>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={{uri: item.photo}} style={{width:125, height:88, borderRadius: 10, marginLeft: 20, marginTop: 20}}></Image>
                                    
                                    <View style={{flexDirection:'column'}}>
                                        <Title>{item.title}</Title>
                                      
                                        {this.cutDescription(item.description)}
                                    </View>
                                </View>  

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableDetails onPress={() => this.props.navigation.navigate('TelaAnuncio', {idDoAnuncio: item.idAnuncio, phoneNumberNavigator: item.phone, idUserCartao: item.idUser})}>
                                        <TextDetails>Ver Detalhes</TextDetails>
                                    </TouchableDetails>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditarAnuncio', {idAnuncio: item.idAnuncio, type: item.type})} style={{marginTop: 24, marginRight: 10}}>
                                        <FontAwesome5  name="pencil-alt" size={19} color={"grey"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.deletePublish(item.idAnuncio)} style={{marginTop: 24, marginRight: 10}}>
                                        <FontAwesome5  name="trash" size={19} color={"grey"} />
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
