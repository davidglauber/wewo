
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

export default class CheckoutA extends Component {
  static contextType = ThemeContext


  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      products:[]
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
      await firebase.firestore().collection('products').where('idComprador', '==', currentUser.uid).get().then(function(querySnapshot){
        let productsArray = []
        querySnapshot.forEach(function(doc) {
          productsArray.push({
            idDonoDoProduto: doc.data().idDonoDoProduto,
            idComprador: doc.data().idComprador,
            fotoUsuarioLogado: doc.data().fotoUsuarioLogado,
            fotoProduto: doc.data().fotoProduto,
            quantidade: doc.data().quantidade,
            valorProduto: doc.data().valorProduto,
            tituloProduto: doc.data().tituloProduto,
            nomeUsuario: doc.data().nomeUsuario
          })
        })
        e.setState({products: productsArray})
        e.setModalVisible(false)
      })
    } else {
      alert('Você precisa estar logado para adicionar produtos no carrinho')
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
          
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.titleContainer}>
                  <Heading style={styles.titleText}>Produtos no Carrinho</Heading>
                </View>
              </View>
            </View>

            {this.state.products.length == 0 &&
                <View style={{flex:1, alignItems:'center', paddingTop: 75}}>
                    <View>
                      <LottieView source={require('../../../assets/notfound.json')} style={{width:200, height:200}} autoPlay loop />
                    </View>
                </View>
            }


            <FlatList
              keyExtractor={() => this.makeid(17)}
              data={this.state.products}
              renderItem={({item}) => 
                <View style={{paddingHorizontal:30, flexDirection:'row', maxWidth: windowWidth/1.5}}>
                  <Image style={{width:160, height:140, borderRadius:20}} source={{uri: item.fotoProduto}}/>
                  <View style={{flexDirection:"column"}}>
                    <View style={{flexDirection:'row'}}>
                      <Image style={{width:30, height:30, borderRadius:40, marginLeft:20}} source={{uri: item.fotoUsuarioLogado}}/>
                      <Text style={{marginLeft: 5, marginTop:5, fontWeight:'bold', color:'#d98b0d', marginBottom:30}}>{item.nomeUsuario}</Text>
                    </View>
                    
                    <Text style={{marginLeft: 40, marginBottom:20, color: this.context.dark ? '#fff' : '#000'}}>{item.tituloProduto}</Text>
                    <Text style={{marginLeft: 40, fontWeight:'bold', color:'#d98b0d', marginBottom:30, fontSize:20}}>{item.valorProduto}</Text>

                  </View>
                </View>
              }
            />


          </ScrollView>
        </View>
      </SafeBackground>
    );
  }
}
