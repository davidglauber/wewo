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
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";
import remove from "lodash/remove";

//CSS responsivo
import { SafeBackground, IconResponsive, AnuncioContainer, IconResponsiveNOBACK, Heading, Title} from '../home/styles';

// import components
import { Modalize } from 'react-native-modalize';

import LottieView from 'lottie-react-native';

import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import bell from '../../../assets/notification.json';

// NotificationsA Config
const EMPTY_STATE_ICON = "bell-ring-outline";


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  paddingTitle: {
    padding: 30
  },
  title: {
    marginLeft: windowWidth/6, 
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
export default class NotificationsB extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      modalizeRef: React.createRef(null),
      notificationsActivies: [],
      itemData: '',
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
      await firebase.firestore().collection('notifications').where("idContratante", "==", user.uid).onSnapshot(documentSnapshot => {
        let notifications = [];
        documentSnapshot.forEach(function(doc) {
          notifications.push({
            idContratante: doc.data().idContratante,
            idContratado: doc.data().idContratado,
            photoProfile: doc.data().photoProfile,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
            service: doc.data().service,
            valor: doc.data().valor,
            cep: doc.data().cep,
            dataServico: doc.data().dataServico,
            horario: doc.data().horario,
            idNot: doc.data().idNot
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
    this.setState({itemData: userData.idNot})

    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }


  uploadedNotifications(){
    this.props.navigation.navigate('HomeNavigator')
  }

  comfirmedServices() {
    this.props.navigation.navigate('ConfirmedServices')
  }

  confirmButton() {
    alert('Serviço confirmado! Lembre-se de comparecer no local e ativar o modo pagamento no final do serviço!')
  }

  deniedButton() {
    alert('Serviço cancelado! O usuário contratante será informado sobre o cancelamento')
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



  deleteNotificationService(itemToBeDeletedFunction){
    firebase.firestore().collection('notifications').where('idNot', '==', itemToBeDeletedFunction).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
        doc.ref.delete();
      })
    })

  }




  deleteService(serviceId) {
    Alert.alert(
      'Cancelar',
      'Tem certeza que quer cancelar o serviço?',
      [
        {text: 'Abortar', onPress: () => {}, style: 'cancel'},
        {text: 'Sim, quero cancelar', onPress: () => this.deleteNotificationService(serviceId)}
      ],
      {cancelable: false},
    );
  };

  render() {
    const {nameUser,fotoUser,cepUser,serviceUser,valueUser,telefoneUser,dataUser, horarioUser, itemData} = this.state;
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        {this.state.notificationsActivies.length == 0 ?
          <View>
            <Heading style={styles.paddingTitle}>Notificações Enviadas</Heading>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={() => this.uploadedNotifications()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="arrow-circle-down" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.comfirmedServices()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="check-double" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity>
                <IconResponsiveNOBACK name="arrow-circle-up" size={24}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems:'center', marginTop:100}}>
              <LottieView source={bell} style={{width:100, height:100}} autoPlay loop />  
              <Text style={{color: this.context.dark ? 'white' : 'black'}}>Nenhuma Notificação Encontrada</Text>
            </View>
          </View>
          :
          <View>
            <Heading style={styles.paddingTitle}>Notificações Enviadas</Heading>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity onPress={() => this.uploadedNotifications()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="arrow-circle-down" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.comfirmedServices()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="check-double" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity>
                <IconResponsiveNOBACK name="arrow-circle-up" size={24}/>
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={() => this.makeid(17)}
              data={this.state.notificationsActivies}
              renderItem={({item}) => 
              <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
                <Image source={{uri: item.photoProfile}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
                <Text  style={styles.titleMain}>{item.nome}</Text>
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
                <TouchableOpacity onPress={() => this.deleteService(itemData)} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="times-circle" size={24}/>
                </TouchableOpacity>
            </View>

            <View style={{width: windowWidth/1.06, height:500, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10}}>
              <View style={{marginTop:20}}>
                <Title style={{marginLeft: 30, fontSize: 27, color: this.context.dark ? 'white' : 'white'}}>CEP: {cepUser}</Title>
                
                <View style={{marginLeft: 30, marginTop:30, flexDirection:'row'}}>
                  <IconResponsive name="tools" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{serviceUser}</Title>
                </View>

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="dollar-sign" size={24}/>
                  <Title style={{marginLeft: 27, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{valueUser}</Title>
                </View>

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="mobile" size={24}/>
                  <Title style={{marginLeft: 24, fontSize: 15, color: this.context.dark ? 'white' : 'white'}}>{telefoneUser}</Title>
                </View>
                

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="calendar-week" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{dataUser}</Title>
                </View>

                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <IconResponsive name="clock" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>{horarioUser}</Title>
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
