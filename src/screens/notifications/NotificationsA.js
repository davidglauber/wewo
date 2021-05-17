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
import { SafeBackground, IconResponsive, AnuncioContainer, IconResponsiveNOBACK, Heading, Title} from '../home/styles';

// import components
import { Modalize } from 'react-native-modalize';

import LottieView from 'lottie-react-native';

import firebase from '../../config/firebase';

import { ThemeContext } from '../../../ThemeContext';

import bell from '../../../assets/notification.json';

import AlertPro from "react-native-alert-pro";


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
export default class NotificationsA extends Component {
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
      idNotification:'',
      horarioUser:'',
      itemData: ''
    };
  }

  async componentDidMount() {
    let user = await firebase.auth().currentUser;
    let e = this;

    if(user == null) {
      this.AlertPro.open();
    } else {
      await firebase.firestore().collection('notifications').where("idContratado", "==", user.uid).where("confirmed", "==", false).onSnapshot(documentSnapshot => {
        let notifications = [];
        documentSnapshot.forEach(function(doc) {
          notifications.push({
            idContratante: doc.data().idContratante,
            idNot: doc.data().idNot,
            idContratado: doc.data().idContratado,
            photoProfile: doc.data().photoProfile,
            nome: doc.data().nome,
            telefone: doc.data().telefone,
            service: doc.data().service,
            valor: doc.data().valor,
            cep: doc.data().cep,
            dataServico: doc.data().dataServico,
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
    this.setState({idNotification: userData.idNot})
    this.setState({horarioUser: userData.horario})
    this.setState({itemData: userData.idNot})

    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }


  uploadedNotifications(){
    if(firebase.auth().currentUser == null){
      this.AlertPro2.open();
    } else {
      this.props.navigation.navigate('NotificationsB')
    }
  }

  comfirmedServices() {
    if(firebase.auth().currentUser == null){
      this.AlertPro2.open();
    } else {
      this.props.navigation.navigate('ConfirmedServices')
    }
  }

  async confirmButton(idNot) {
    const modalizeRef = this.state.modalizeRef;
    
    await firebase.firestore().collection('notifications').doc(idNot).update({
      confirmed: true
    })

    modalizeRef.current?.close();
    this.props.navigation.navigate('ConfirmedServices')
    this.AlertPro3.open();
  }

  async deniedButton(idNot) {
    const modalizeRef = this.state.modalizeRef;

    await firebase.firestore().collection('notifications').doc(idNot).delete()
    modalizeRef.current?.close();
    this.AlertPro4.open();
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


          <AlertPro
            ref={ref => {
              this.AlertPro2 = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro2.close()}
            title="Desculpe, mas..."
            message="Você não pode acessar essa área sem estar logado!"
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


          <AlertPro
            ref={ref => {
              this.AlertPro3 = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro3.close()}
            title="Tudo certo ;)"
            message="Serviço confirmado! Lembre-se de comparecer no local e ativar o modo pagamento no final do serviço!"
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


          <AlertPro
            ref={ref => {
              this.AlertPro4 = ref;
            }}
            showCancel={false}
            onConfirm={() => this.AlertPro4.close()}
            title="Cancelado com sucesso"
            message="Serviço cancelado!"
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
          backgroundColor={this.context.dark ? '#3E3C3F' : '#E98D0A'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        {this.state.notificationsActivies.length == 0 ?
          <View>
            <Heading style={styles.paddingTitle}>Notificações Recebidas</Heading>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity>
                <IconResponsiveNOBACK style={{marginRight:20}} name="arrow-circle-down" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.comfirmedServices()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="check-double" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.uploadedNotifications()}>
                <IconResponsiveNOBACK name="arrow-circle-up" size={24}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems:'center', marginTop:100}}>
              <LottieView source={bell} style={{width:200, height:200}} autoPlay loop />  
              <Text style={{color: this.context.dark ? 'white' : 'black'}}>Nenhuma Notificação Encontrada</Text>
            </View>
          </View>
          :
          <View>
            <Heading style={styles.paddingTitle}>Notificações Recebidas</Heading>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableOpacity>
                <IconResponsiveNOBACK style={{marginRight:20}} name="arrow-circle-down" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.comfirmedServices()}>
                <IconResponsiveNOBACK style={{marginRight:20}} name="check-double" size={24}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.uploadedNotifications()}>
                <IconResponsiveNOBACK name="arrow-circle-up" size={24}/>
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={() => this.makeid(17)}
              data={this.state.notificationsActivies}
              renderItem={({item}) => 
              <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
                <Image source={{uri: item.photoProfile}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
                <Text  style={styles.titleMain}>{item.nome}</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', {idLoggedUser: user.uid, idDonoDoAnuncio: item.idContratante, idNotification: item.idNot, valuePayment: item.valor, type: 'normalNotif'})} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/5, justifyContent:'center', alignItems:'center'}}>
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




        {/*Modalize dos comentários*/}
        <Modalize
            ref={this.state.modalizeRef}
            snapPoint={900}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >

         
            <View style={{width: windowWidth/1.06, height:100, backgroundColor: '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
              <Image source={{uri: fotoUser}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
                <Text  style={styles.title}>{nameUser}</Text>
                <TouchableOpacity onPress={() => this.deleteService(itemData)} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                  <IconResponsiveNOBACK name="times-circle" size={24}/>
                </TouchableOpacity>
            </View>

          <View style={{width: windowWidth/1.06, height:550, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:60, marginTop:20, marginLeft:10, marginRight:10}}>
              <View style={{marginTop:20, maxWidth: windowWidth/1.05}}>
                
                {cepUser == null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', marginLeft: windowWidth/3.2}}>
                    <IconResponsive name="laptop-house" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>Remoto</Title>
                  </View>
                }

                {cepUser !== null &&
                  <View style={{marginLeft: 30, marginTop:30, flexDirection:'row', maxWidth:260}}>
                    <Title style={{marginLeft: 10, fontSize: 15, marginTop:5, textAlign:'center', color: this.context.dark ? 'white' : 'white'}}>{cepUser}</Title>
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
                

                <View style={{flexDirection:'row', marginLeft:15}}>
                  <TouchableOpacity onPress={() => this.confirmButton(this.state.idNotification)} style={{marginLeft: 30, marginTop:30, flexDirection:'row', padding:10, backgroundColor: 'white', marginRight:20, borderRadius:50}}>
                    <IconResponsiveNOBACK name="check" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:2, color:'black'}}>Confirmar</Title>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.deniedButton(this.state.idNotification)} style={{marginLeft: 20, marginTop:30, flexDirection:'row', padding:10, backgroundColor: 'white', marginRight:120, borderRadius:50}}>
                    <IconResponsiveNOBACK name="times" size={24}/>
                    <Title style={{marginLeft: 20, fontSize: 15, marginTop:2, color:'black'}}>Negar     </Title>
                  </TouchableOpacity>
                </View>

            </View>
          </View>
        </Modalize>
      </SafeBackground>
    );
  }
}
