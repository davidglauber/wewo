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
  moneyCard: {
    position:'absolute',
    right:windowWidth/8
  },
  title: {
    marginLeft: 20, 
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
export default class ConfirmedServices extends Component {
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
      horarioUser:''
    };
  }

  async componentDidMount() {
    let user = await firebase.auth().currentUser;
    let e = this;

    if(user == null) {
      alert('Usuários não logados não tem notificações ativas')
    } else {
      await firebase.firestore().collection('notifications').where("idContratado", "==", user.uid).where("confirmed", "==", true).onSnapshot(documentSnapshot => {
        let notifications = [];
        documentSnapshot.forEach(function(doc) {
          notifications.push({
            idContratante: doc.data().idContratante,
            idContratado: doc.data().idContratado,
            idNot: doc.data().idNot,
            photoProfile: doc.data().photoProfile,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
            service: doc.data().service,
            valor: doc.data().valor,
            cep: doc.data().cep,
            dataServico: doc.data().dataServico,
            confirmed: doc.data().confirmed,
            horario: doc.data().horario
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
    this.setState({nameUser: userData.nome})
    this.setState({fotoUser: userData.photoProfile})
    this.setState({cepUser: userData.cep})
    this.setState({serviceUser: userData.service})
    this.setState({valueUser: userData.valor})
    this.setState({telefoneUser: userData.telefone})
    this.setState({dataUser: userData.dataServico})
    this.setState({horarioUser: userData.horario})

    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }


  uploadedNotifications(){
    this.props.navigation.navigate('ServicesAsClient')
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
    const {nameUser,fotoUser,cepUser,serviceUser,valueUser,telefoneUser,dataUser, horarioUser} = this.state;
    const user = firebase.auth().currentUser;
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

      {this.state.notificationsActivies.length == 0 ?

        <View>
          <View style={{flexDirection:'row'}}>
            <Heading style={styles.paddingTitle}>Meus Serviços</Heading>
            <TouchableOpacity onPress={() => this.uploadedNotifications()}>
              <IconResponsiveNOBACK style={{marginLeft:90, marginTop:30}} name="handshake" size={24}/>
            </TouchableOpacity>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Para sua segurança, deve-se utilizar o Modo PagWeWo para efetuar o pagamento entre o Contratado e Contratante (não nos responsabilizamos por qualquer problema de pagamento fora da plataforma)</TextDescription2>

          <View style={{alignItems:'center', marginTop:100}}>
            <LottieView source={bell} style={{width:100, height:100}} autoPlay loop />  
            <Text style={{color: this.context.dark ? 'white' : 'black'}}>Nenhuma Notificação Encontrada</Text>
          </View>
        </View>
        :
        <View>
          <View style={{flexDirection:'row'}}>
          <Heading style={styles.paddingTitle}>Meus Serviços</Heading>
            <TouchableOpacity onPress={() => this.uploadedNotifications()}>
              <IconResponsiveNOBACK style={{marginLeft:90, marginTop:30}} name="handshake" size={24}/>
            </TouchableOpacity>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Para sua segurança, deve-se utilizar o Modo PagWeWo para efetuar o pagamento entre o Contratado e Contratante (não nos responsabilizamos por qualquer problema de pagamento fora da plataforma)</TextDescription2>

          <FlatList
            keyExtractor={() => this.makeid(17)}
            data={this.state.notificationsActivies}
            renderItem={({item}) => 
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: item.photoProfile}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Text  style={styles.titleMain}>{item.nome}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', {idLoggedUser: user.uid, idDonoDoAnuncio: item.idContratante, idNotification: item.idNot})} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/5, justifyContent:'center', alignItems:'center'}}>
                  <IconResponsive name="comment" size={24}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openModalize(item)} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="at" size={24}/>
                </TouchableOpacity>
            </View>
          }
          ></FlatList>

        </View>

        }


        {/*Modalize dos comentários*/}
        <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >

         
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: fotoUser}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
                <Text  style={styles.title}>{nameUser}</Text>
                <TouchableOpacity style={styles.moneyCard} onPress={() => this.props.navigation.navigate('PaymentServices')}>
                  <IconResponsive name="money-check-alt" size={24}/>
                </TouchableOpacity>
            </View>

            <View style={{width: windowWidth/1.06, height:500, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10}}>
              <View style={{marginTop:20}}>
                
                {cepUser == null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row'}}>
                    <IconResponsive name="laptop-house" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>Remoto</Title>
                  </View>
                }

                {cepUser !== null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', maxWidth:250}}>
                    <IconResponsive name="map-marker" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, textAlign:'center', color: this.context.dark ? 'white' : 'white'}}>{cepUser}</Title>
                  </View>
                }

                <View style={{marginLeft: 30, marginTop:30, flexDirection:'row'}}>
                  <IconResponsive name="tools" size={24}/>
                  <Title style={{marginLeft: 20, marginRight:20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{serviceUser}</Title>
                  
                  <IconResponsive name="dollar-sign" size={24}/>
                  <Title style={{marginLeft: 10, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{valueUser}</Title>
                </View>

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="calendar-week" size={24}/>
                  <Title style={{marginLeft: 20, marginRight:45, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{dataUser}</Title>
                  
                  <IconResponsive name="clock" size={24}/>
                  <Title style={{marginLeft: 10, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{horarioUser}</Title>
                </View>


                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="mobile" size={24}/>
                  <Title style={{marginLeft: 24, fontSize: 15, color: this.context.dark ? 'white' : 'white'}}>{telefoneUser}</Title>
                </View>
                


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
