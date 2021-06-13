/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from "react";
import {
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";
import remove from "lodash/remove";

//CSS responsivo
import { SafeBackground, IconResponsive, TextDescription2, IconResponsiveNOBACK, Heading, Title} from '../home/styles';

// import components
import { Modalize } from 'react-native-modalize';

import LottieView from 'lottie-react-native';

import bell from '../../../assets/notification.json';

import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import AlertPro from "react-native-alert-pro";

// NotificationsA Config
const EMPTY_STATE_ICON = "bell-ring-outline";


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  paddingTitle: {
    padding: 30,
    marginRight:10
  },
  title: {
    marginLeft: windowWidth/10, 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: 'white'
  }
  ,
  titleMain: {
    marginLeft: 10, 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: 'white'
  }
})

// NotificationsA
export default class ServicesAsClient extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      modalizeRef: React.createRef(null),
      notificationsActivies: [],
      nameUser:'',
      fotoUser:'',
      cepUser:'',
      serviceUser:'',
      valueUser:'',
      telefoneUser:'',
      dataUser:'',
      horarioUser:'',
      idNotification: '',
      idContratado: '',
      idAnuncio: '',
      type:''
    };
  }

  async componentDidMount() {
    let user = await firebase.auth().currentUser;
    let e = this;

    if(user == null) {
      this.AlertPro.open();
    } else {
      await firebase.firestore().collection('notifications').where("idContratante", "==", user.uid).where("confirmed", "==", true).onSnapshot(documentSnapshot => {
        let notifications = [];
        documentSnapshot.forEach(function(doc) {
          notifications.push({
            idContratante: doc.data().idContratante,
            idContratado: doc.data().idContratado,
            idAnuncio: doc.data().idAnuncio,
            photoProfile: doc.data().photoProfile,
            photoUser: doc.data().photoUser,
            title: doc.data().titlePublish,
            idNot: doc.data().idNot,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
            service: doc.data().service,
            valor: doc.data().valor,
            cep: doc.data().cep,
            dataServico: doc.data().dataServico,
            horario: doc.data().horario,
            type: doc.data().type
          })
        })

        e.setState({notificationsActivies: notifications})
      })
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  navigateTo = screen => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };


  openModalize(userData) {
    this.setState({nameUser: userData.title})
    this.setState({fotoUser: userData.photoUser})
    this.setState({cepUser: userData.cep})
    this.setState({serviceUser: userData.service})
    this.setState({valueUser: userData.valor})
    this.setState({idContratado: userData.idContratado})
    this.setState({idAnuncio: userData.idAnuncio})
    this.setState({telefoneUser: userData.telefone})
    this.setState({dataUser: userData.dataServico})
    this.setState({horarioUser: userData.horario})
    this.setState({idNotification: userData.idNot})
    this.setState({type: userData.type})

    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
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

  render() {
    const {nameUser,fotoUser,cepUser,serviceUser,valueUser,telefoneUser,dataUser, horarioUser, idContratado} = this.state;
    const user = firebase.auth().currentUser;
    return (
      <SafeBackground>


          <AlertPro
            ref={ref => {
              this.AlertPro = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro.close()}
            title="Desculpe, mas..."
            message="Usuários não logados não tem notificações ativas"
            textConfirm="OK"
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


        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />


      {this.state.notificationsActivies.length == 0 ?
      <View>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeNavigator')}>
                <IconResponsiveNOBACK style={{marginTop: windowHeight/23, marginLeft: windowWidth/16, marginRight: windowWidth/22}} name="arrow-left" size={20}/>
            </TouchableOpacity>
            <Heading style={styles.paddingTitle}>Serviços que Contratei</Heading>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Nessa tela você consegue ver todos os serviços contratados por você (lembre-se de pagar com PayWo)</TextDescription2>

          <View style={{alignItems:'center', marginTop:100}}>
            <LottieView source={bell} style={{width:200, height:200}} autoPlay loop />  
            <Text style={{color: this.context.dark ? 'white' : 'black'}}>Nenhuma Notificação Encontrada</Text>
          </View>
        </View>
        :

        <ScrollView>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('HomeNavigator')}>
                <IconResponsiveNOBACK style={{marginTop: windowHeight/23, marginLeft: windowWidth/16, marginRight: windowWidth/22}} name="arrow-left" size={20}/>
            </TouchableOpacity>
            <Heading style={styles.paddingTitle}>Serviços que Contratei</Heading>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Nessa tela você consegue ver todos os serviços contratados por você (lembre-se de pagar com PayWo)</TextDescription2>

          <FlatList
            keyExtractor={() => this.makeid(17)}
            data={this.state.notificationsActivies}
            renderItem={({item}) => 
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: item.photoUser}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Text  style={styles.titleMain}>{item.title}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatReceive', {idLoggedUser: user.uid, idDonoDoAnuncio: item.idContratante, idNotification: item.idNot, valuePayment: item.valor, type: 'normalNotif', idDoAnuncio: item.idAnuncio})} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/5, justifyContent:'center', alignItems:'center'}}>
                  <IconResponsive name="comment-alt" size={24}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openModalize(item)} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="at" size={24}/>
                </TouchableOpacity>
            </View>
          }
          ></FlatList>
        </ScrollView>

      }


        {/*Modalize dos comentários*/}
        <Modalize
            ref={this.state.modalizeRef}
            snapPoint={900}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >

         
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: fotoUser}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Text  style={styles.title}>{nameUser}</Text>
              {this.state.type == "Autonomo" &&
                <View style={{width:40, height:40, borderRadius: 20, position:'absolute', right: windowWidth/10, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="user-tie" size={24}/>
                </View>
              }

              {this.state.type == "Estabelecimento" &&
                <View style={{width:40, height:40, borderRadius: 20, position:'absolute', right: windowWidth/10, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="briefcase" size={24}/>
                </View>
              }
            </View>

            <View style={{width: windowWidth/1.06, height:650, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10}}>
              <View style={{marginTop:20}}>
                
                {cepUser == null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', marginLeft: windowWidth/3.2}}>
                    <IconResponsive name="laptop-house" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>Remoto</Title>
                  </View>
                }

                {cepUser !== null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', maxWidth:260}}>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{cepUser}</Title>
                  </View>
                }






              <View style={{marginTop:30, flexDirection:'column', paddingHorizontal:30, justifyContent:"space-between"}}>
                  <View style={{backgroundColor:'#3f3f3f', maxWidth: windowWidth/1.06, flexDirection:'row', padding:15, borderRadius:20}}>
                    <IconResponsive style={{marginLeft:10}} name="tools" size={20}/>
                    <Title style={{marginLeft: 20, marginRight:20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{serviceUser}</Title>
                  </View>
                  
                  <View style={{backgroundColor:'#3f3f3f', maxWidth: windowWidth/1.06, marginTop: 15, flexDirection:'row', padding:15, borderRadius:20}}>
                    <IconResponsive style={{marginLeft:10}} name="dollar-sign" size={20}/>
                    <Title style={{marginLeft: 10, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{valueUser}</Title>
                  </View>
                </View>





                <View style={{marginTop:10, flexDirection:'column', paddingHorizontal:30, justifyContent:"space-between"}}>
                  <View style={{backgroundColor:'#3f3f3f', maxWidth: windowWidth/1.06, flexDirection:'row', padding:15, borderRadius:20}}>
                    <IconResponsive style={{marginLeft:10}} name="calendar-week" size={20}/>
                    <Title style={{marginLeft: 20, marginRight:45, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{dataUser}</Title>
                  </View>
                  
                  <View style={{backgroundColor:'#3f3f3f', maxWidth: windowWidth/1.06, marginTop: 15, flexDirection:'row', padding:15, borderRadius:20}}>
                    <IconResponsive style={{marginLeft:10}} name="clock" size={20}/>
                    <Title style={{marginLeft: 10, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{horarioUser}</Title>
                  </View>
                </View>




                <View style={{marginTop:10, flexDirection:'column', paddingHorizontal:30, justifyContent:"space-between"}}>
                  <View style={{backgroundColor:'#3f3f3f', maxWidth: windowWidth/1.06, flexDirection:'row', padding:15, borderRadius:20}}>
                    <IconResponsive style={{marginLeft:10}} name="mobile" size={20}/>
                    <Title style={{marginLeft: 24, fontSize: 15, color: this.context.dark ? 'white' : 'white'}}>{telefoneUser}</Title>
                  </View>
                </View>





                <TouchableOpacity onPress={() => this.props.navigation.navigate('PaymentServices', {valuePayment: valueUser, idNotification: this.state.idNotification, idContratado: idContratado, idDoAnuncio: this.state.idAnuncio})} style={{marginHorizontal:130, marginTop:60, flexDirection:'row', padding:10, backgroundColor: 'white', borderRadius:50}}>
                  <IconResponsiveNOBACK name="check" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:2, color:'black'}}>Pagar</Title>
                </TouchableOpacity>

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <Title style={{marginRight: 20, textAlign:'center', fontSize: 15, marginTop:25, color: this.context.dark ? 'white' : 'white'}}>Este é um resumo do que você enviou ao contratado(a)</Title>
                </View>



            </View>
          </View>
        </Modalize>
      </SafeBackground>
    );
  }
}
