
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

// import components
import {SmallText} from '../../components/text/CustomText';

import { SafeBackground, SwipeLeft, Description, Heading, TextDescription2, IconResponsiveNOBACK, IconResponsive, TextTheme, Favorite } from '../home/styles';

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

//RESPONSIVE FONT 
import { RFValue } from 'react-native-responsive-fontsize';

import { ThemeContext } from '../../../ThemeContext';

import AlertPro from "react-native-alert-pro";

//import GestureHandler
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700'
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

export default class BuyedProducts extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      products:[],
      productsFinished: [],
      idDono: '',
      idCartao: '',
      idProduct: '',
      booleanFinished: false
    };
  }



  //sleep function
  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  async componentDidMount() {
    let e = this;
    let currentUser = firebase.auth().currentUser;

    if(currentUser !== null) {
      await firebase.firestore().collection('products').where('idComprador', '==', currentUser.uid).where('status', "==", 'sold').onSnapshot(documentSnapshot => {
        let productsArray = []
        documentSnapshot.forEach(function(doc) {
          productsArray.push({
            idDonoDoProduto: doc.data().idDonoDoProduto,
            idComprador: doc.data().idComprador,
            idProduct: doc.data().idProduct,
            fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
            fotoUsuarioComprador: doc.data().fotoUsuarioComprador,
            fotoProduto: doc.data().fotoProduto,
            quantidade: doc.data().quantidade,
            valorProduto: doc.data().valorProduto,
            tituloProduto: doc.data().tituloProduto,
            nomeUsuario: doc.data().nomeUsuario,
            nomeUsuarioComprador: doc.data().nomeUsuarioComprador
          })
          e.setState({idDono: doc.data().idDonoDoProduto})
          e.setState({idCartao: doc.data().idCartao})
          e.setState({idProduct: doc.data().idProduct})
        })
        e.setState({products: productsArray})
        e.setModalVisible(false)
      })

      await firebase.firestore().collection('products').where('idComprador', '==', currentUser.uid).where('status', "==", 'finished').onSnapshot(documentSnapshot => {
        let productsArray2 = []
        documentSnapshot.forEach(function(doc) {
          productsArray2.push({
            idDonoDoProduto: doc.data().idDonoDoProduto,
            idComprador: doc.data().idComprador,
            idProduct: doc.data().idProduct,
            fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
            fotoUsuarioComprador: doc.data().fotoUsuarioComprador,
            fotoProduto: doc.data().fotoProduto,
            quantidade: doc.data().quantidade,
            valorProduto: doc.data().valorProduto,
            tituloProduto: doc.data().tituloProduto,
            nomeUsuario: doc.data().nomeUsuario,
            nomeUsuarioComprador: doc.data().nomeUsuarioComprador
          })
          e.setState({idDono: doc.data().idDonoDoProduto})
          e.setState({idCartao: doc.data().idCartao})
          e.setState({idProduct: doc.data().idProduct})
        })
        e.setState({productsFinished: productsArray2})
        e.setModalVisible(false)
      })
    } else {
      this.AlertPro.open();
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

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };


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


  responsibleFont() {
    let Height = Dimensions.get('window').height

    return RFValue(15, Height);
  }


  async loadProductsFinished() {
    let currentUser = firebase.auth().currentUser;

    await firebase.firestore().collection('products').where('idComprador', '==', currentUser.uid).where('status', "==", 'finished').onSnapshot(documentSnapshot => {
      let productsArray = []
      documentSnapshot.forEach(function(doc) {
        productsArray.push({
          idDonoDoProduto: doc.data().idDonoDoProduto,
          idComprador: doc.data().idComprador,
          idProduct: doc.data().idProduct,
          fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
          fotoUsuarioComprador: doc.data().fotoUsuarioComprador,
          fotoProduto: doc.data().fotoProduto,
          quantidade: doc.data().quantidade,
          valorProduto: doc.data().valorProduto,
          tituloProduto: doc.data().tituloProduto,
          nomeUsuario: doc.data().nomeUsuario,
          nomeUsuarioComprador: doc.data().nomeUsuarioComprador
        })
        e.setState({idDono: doc.data().idDonoDoProduto})
        e.setState({idCartao: doc.data().idCartao})
        e.setState({idProduct: doc.data().idProduct})
      })
      e.setState({productsFinished: productsArray})
      e.setModalVisible(false)
    })
    
  }


  async finishBuyProcess() {
    this.AlertPro2.close();
    await firebase.firestore().collection('products').doc(this.state.idProduct).update({
      status: 'finished'
    }).then(() => {
      this.props.navigation.navigate('MostrarCartao', {idDoCartao: this.state.idCartao, idUserCartao: this.state.idDono})
    }).catch((err) => {
      alert('Ocorreu um erro ao finalizar o processo de confirmação: ' + err)
    })
  }


  render() {
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
        
          <AlertPro
            ref={ref => {
              this.AlertPro = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro.close()}
            title="Ops, ocorreu um erro"
            message="Você precisa estar logado para adicionar produtos no carrinho"
            textConfirm="Entendi"
            customStyles={{
              mask: {
                backgroundColor: "black",
                opacity: 0.9
              },
              container: {
                borderWidth: 1,
                borderColor: "#d98b0d",
                shadowColor: "#000000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                borderRadius:30
              },
              buttonCancel: {
                backgroundColor: "#3f3f3f"
              },
              buttonConfirm: {
                backgroundColor: "#ffa31a"
              }
            }}
          />


          <AlertPro
            ref={ref => {
              this.AlertPro2 = ref;
            }}
            onCancel={() => this.AlertPro2.close()}
            onConfirm={() => this.finishBuyProcess()}
            title="ATENÇÃO"
            message="Ao confirmar que recebeu o produto o processo de compra será finalizado e você deverá avaliar o produto."
            textConfirm="Continuar"
            textCancel="Cancelar"
            customStyles={{
              mask: {
                backgroundColor: "black",
                opacity: 0.9
              },
              container: {
                borderWidth: 1,
                borderColor: "#d98b0d",
                shadowColor: "#000000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                borderRadius:30
              },
              buttonCancel: {
                backgroundColor: "#3f3f3f"
              },
              buttonConfirm: {
                backgroundColor: "#ffa31a"
              }
            }}
          />


          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeNavigator')}>
                    <IconResponsiveNOBACK style={{marginTop: windowHeight/85, marginLeft: windowWidth/40, marginRight: windowWidth/10}} name="arrow-left" size={20}/>
                  </TouchableOpacity>
                  <Heading style={styles.titleText}>Produtos Comprados</Heading>
                </View>
              </View>
              <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Lembre-se de confirmar quando o produto for entregue, se recebeu o produto e negou-se a confirmar você será penalizado!</TextDescription2>
            </View>


            {this.state.booleanFinished == false ?
              //diz que não foi finalizado, só comprado
              <View>
                <View style={{flexDirection:'row', marginTop:30, marginBottom:50}}>
                  <TextDescription2 style={{marginLeft: windowWidth/6, fontSize:20, fontWeight:'bold'}}>Comprado</TextDescription2>

                  <TouchableOpacity onPress={() => this.setState({booleanFinished: true})}>
                    <TextDescription2 style={{marginLeft:50, fontSize:20, fontWeight:'bold', color:"#3f3f3f"}}>Finalizado</TextDescription2>
                  </TouchableOpacity>
                </View>


                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.products}
                  renderItem={({item}) => 
                    <View style={{paddingHorizontal:30, flexDirection:'column', maxWidth: windowWidth/1.5}}>
                      <View style={{flexDirection:"row"}}>
                        <Image style={{width:30, height:30, borderRadius:40}} source={{uri: item.fotoUsuarioComprador}}/>
                        <Text style={{marginLeft: 5, marginTop:5, fontWeight:'bold', color:'#d98b0d', marginBottom:30}}>{item.nomeUsuarioComprador}</Text>
                        <Text style={{marginLeft: 40, marginBottom:20, fontSize:18, fontWeight:"bold", color: this.context.dark ? '#fff' : '#000'}}>{item.tituloProduto}</Text>
                      </View>

                      <Image style={{width: windowWidth/1.2, height:140, borderBottomLeftRadius:0, borderBottomRightRadius: 0, borderTopRightRadius:20, borderTopLeftRadius:20}} source={{uri: item.fotoProduto}}/>
                      <View style={{flexDirection:"column", width: windowWidth/1.2, borderBottomLeftRadius:20, borderBottomRightRadius: 20, elevation:10, marginBottom:20, backgroundColor: this.context.dark ? '#3f3f3f' : '#fff'}}>
                        <Text style={{marginLeft: 20, fontWeight:'bold', marginTop:10, fontSize:20, color: this.context.dark? '#fff' : '#000'}}>Valor: {item.valorProduto}</Text>
                        <Text style={{marginLeft: windowWidth/2, position:'absolute', top:15, fontWeight:'bold', fontSize:14, color: this.context.dark? '#fff' : '#000'}}>Quantidade: {item.quantidade}</Text>

                        <TouchableOpacity onPress={() => this.AlertPro2.open()} style={{justifyContent:"center", height:50, borderRadius:40, marginBottom:20, marginTop:20, elevation:5, marginLeft:windowWidth/6, maxWidth: windowWidth/2, flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d'}}>
                          <Text style={{color: this.context.dark ? 'black' : 'white', fontSize:15, fontWeight:'bold'}}>Confirmar Recebimento</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                }
                />


              {this.state.products.length == 0 &&
                  <View style={{flex:1, alignItems:'center', paddingTop: 75}}>
                      <View>
                        <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                      </View>
                  </View>
              }
              </View>
              :
              //diz que FOI finalizado
              <View>
                <View style={{flexDirection:'row', marginTop:30, marginBottom:50}}>
                  <TouchableOpacity onPress={() => this.setState({booleanFinished: false})}>
                    <TextDescription2 style={{marginLeft: windowWidth/6, fontSize:20, fontWeight:'bold', color:"#3f3f3f"}}>Comprado</TextDescription2>
                  </TouchableOpacity>

                  <TextDescription2 style={{marginLeft:50, fontSize:20, fontWeight:'bold'}}>Finalizado</TextDescription2>
                </View>



                {this.state.productsFinished.length == 0 &&
                  <View style={{flex:1, alignItems:'center', paddingTop: 75}}>
                      <View>
                        <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                      </View>
                  </View>
                }


                <FlatList
                  keyExtractor={() => this.makeid(17)}
                  data={this.state.productsFinished}
                  renderItem={({item}) => 
                    <View style={{paddingHorizontal:30, flexDirection:'column', maxWidth: windowWidth/1.5}}>
                      <View style={{flexDirection:"row"}}>
                        <Image style={{width:30, height:30, borderRadius:40}} source={{uri: item.fotoUsuarioComprador}}/>
                        <Text style={{marginLeft: 5, marginTop:5, fontWeight:'bold', color:'#d98b0d', marginBottom:30}}>{item.nomeUsuarioComprador}</Text>
                        <Text style={{marginLeft: 40, marginBottom:20, fontSize:18, fontWeight:"bold", color: this.context.dark ? '#fff' : '#000'}}>{item.tituloProduto}</Text>
                      </View>

                      <Image style={{width: windowWidth/1.2, height:140, borderBottomLeftRadius:0, borderBottomRightRadius: 0, borderTopRightRadius:20, borderTopLeftRadius:20}} source={{uri: item.fotoProduto}}/>
                      <View style={{flexDirection:"column", width: windowWidth/1.2, borderBottomLeftRadius:20, borderBottomRightRadius: 20, elevation:10, marginBottom:20, backgroundColor: this.context.dark ? '#3f3f3f' : '#fff'}}>
                        <Text style={{marginLeft: 20, fontWeight:'bold', marginTop:10, fontSize:20, color: this.context.dark? '#fff' : '#000'}}>Valor: {item.valorProduto}</Text>
                        <Text style={{marginLeft: windowWidth/2, position:'absolute', top:15, fontWeight:'bold', fontSize:14, color: this.context.dark? '#fff' : '#000'}}>Quantidade: {item.quantidade}</Text>

                        <View style={{justifyContent:"center", height:50, borderRadius:40, marginBottom:20, marginTop:20, elevation:5, marginLeft:windowWidth/6, maxWidth: windowWidth/2, flexDirection:'row', alignItems: 'center', backgroundColor:'#4f4f4f'}}>
                          <Text style={{color: this.context.dark ? 'black' : 'white', fontSize:15, fontWeight:'bold'}}>Compra Finalizada</Text>
                        </View>
                      </View>
                    </View>
                }
                />
              </View>
            }
            


          </ScrollView>
          
        </View>
      </SafeBackground>
    );
  }
}
