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

import AlertPro from "react-native-alert-pro";

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
      horarioUser:'', 
      idNotUser:''
    };
  }

  async componentDidMount() {
    let user = await firebase.auth().currentUser;
    let e = this;

    if(user == null) {
      this.AlertPro.open();
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
    this.setState({idNotUser: userData.idNot})

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
    const {nameUser,fotoUser,cepUser,serviceUser,valueUser,telefoneUser,dataUser, horarioUser, idNotUser} = this.state;
    const user = firebase.auth().currentUser;
    return (
      <SafeBackground>



          <AlertPro
            ref={ref => {
              this.AlertPro = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro.close()}
            title="Desculpe, mass..."
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
            <Heading style={styles.paddingTitle}>Meus Serviços</Heading>
            <TouchableOpacity style={{position:'absolute', left:windowWidth/1.2, marginTop:30}} onPress={() => this.uploadedNotifications()}>
              <IconResponsiveNOBACK name="handshake" size={24}/>
            </TouchableOpacity>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Para sua segurança, deve-se utilizar o Modo PayWo para efetuar o pagamento entre o Contratado e Contratante (não nos responsabilizamos por qualquer problema de pagamento fora da plataforma)</TextDescription2>

          <View style={{alignItems:'center', marginTop:100}}>
            <LottieView source={bell} style={{width:200, height:200}} autoPlay loop />  
            <Text style={{color: this.context.dark ? 'white' : 'black'}}>Nenhuma Notificação Encontrada</Text>
          </View>
        </View>
        :
        <View>
          <View style={{flexDirection:'row'}}>
          <Heading style={styles.paddingTitle}>Meus Serviços</Heading>
            <TouchableOpacity style={{position:'absolute', left:windowWidth/1.2, marginTop:30}} onPress={() => this.uploadedNotifications()}>
              <IconResponsiveNOBACK name="handshake" size={24}/>
            </TouchableOpacity>
          </View>
          
          <TextDescription2 style={{paddingHorizontal:40, textAlign:'justify'}}>Para sua segurança, deve-se utilizar o Modo PayWo para efetuar o pagamento entre o Contratado e Contratante (não nos responsabilizamos por qualquer problema de pagamento fora da plataforma)</TextDescription2>

          <FlatList
            keyExtractor={() => this.makeid(17)}
            data={this.state.notificationsActivies}
            renderItem={({item}) => 
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: item.photoProfile}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Text  style={styles.titleMain}>{item.nome}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatReceive', {idLoggedUser: user.uid, idDonoDoAnuncio: item.idContratante, idNotification: item.idNot, valuePayment: item.valor, type: 'confirmedNotif'})} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/5, justifyContent:'center', alignItems:'center'}}>
                  <IconResponsive name="comment-alt" size={24}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openModalize(item)} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="at" size={24}/>
                </TouchableOpacity>
            </View>
          }
          ></FlatList>

        </View>

        }
        
        <View style={{position:'absolute', top:windowHeight/1.2, paddingHorizontal:30, marginRight:20}}>
          <View style={{flexDirection:'row'}}>
            <IconResponsiveNOBACK style={{marginRight:20}} name="comment-alt" size={24}/>
            <TextDescription2 style={{textAlign:'justify', fontWeight:'bold'}}>Negocie o valor com seu cliente</TextDescription2>
          </View>
          
          <View style={{flexDirection:'row', marginTop:20}}>
            <IconResponsiveNOBACK style={{marginRight:17}} name="at" size={24}/>
            <TextDescription2 style={{textAlign:'justify', fontWeight:'bold'}}>O valor será o mesmo do anúncio</TextDescription2>
          </View>

          <View style={{flexDirection:'row', marginTop:20}}>
            <IconResponsiveNOBACK style={{marginRight:17}} name="handshake" size={24}/>
            <TextDescription2 style={{textAlign:'justify', fontWeight:'bold'}}>Aba de Serviços Contratados</TextDescription2>
          </View>
        </View>


        {/*Modalize dos comentários*/}
        <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >

         
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#0f0f0f' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: fotoUser}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
                <Text  style={styles.title}>{nameUser}</Text>
                <TouchableOpacity style={styles.moneyCard} onPress={() => this.props.navigation.navigate('AwaitPayment', {
                  idNotification: idNotUser
                })}>
                  <IconResponsive name="money-bill-wave" size={24}/>
                </TouchableOpacity>
            </View>

            <View style={{width: windowWidth/1.06, height:550, backgroundColor: this.context.dark ? '#0f0f0f' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10}}>
              <View style={{marginTop:20}}>
                
                {cepUser == null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row'}}>
                    <IconResponsive name="laptop-house" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>Remoto</Title>
                  </View>
                }

                {cepUser !== null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', maxWidth:260}}>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, textAlign:'center', color: this.context.dark ? 'white' : 'white'}}>{cepUser}</Title>
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
                


                <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                  <Title style={{marginRight: 20, textAlign:'center', fontSize: 15, marginTop:25, color: this.context.dark ? 'white' : 'white'}}>Este é um resumo do que o contratante lhe enviou</Title>
                </View>

            </View>
          </View>
        </Modalize>
      </SafeBackground>
    );
  }
}
