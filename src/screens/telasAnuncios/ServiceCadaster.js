/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  View,
} from 'react-native';




//import firebase
import firebase from '../../config/firebase';

import { SafeAnuncioView, Heading, TextDescription2, IconResponsive, InputForm, InputFormMask, Subtitle2EditProfile, ButtonCustomized, IconResponsiveNOBACK} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

import { Modalize } from 'react-native-modalize';

// import components
import { FontAwesome5 } from '@expo/vector-icons';

import LottieView from 'lottie-react-native';

//import datepicker
import DateTimePicker from '@react-native-community/datetimepicker';

import AlertPro from "react-native-alert-pro";

//locationSERVICES
import * as Location from 'expo-location';

import loading from '../../../assets/loading.json';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default class ServiceCadaster extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      states: '',
      id: '',
      idContratante:'',
      nome: '',
      foto:'',
      servico:'',
      telefone:'',
      valor:'',
      photoUser: '',
      title: '',
      date: new Date(),
      hour: new Date(),
      showHour: false,
      horario:'',
      mode:'date',
      type:'',
      showDate: false,
      cep: null,
      idAnuncio: '',
      locationServiceEnabled: false,
      modalVisible: false,
      modalizeLocation: React.createRef(null),
      boolean: false,
      nomeEnd: '',
      cepEnd: '',
      endereco: '',
      numeroEnd: '',
      complementoEnd: '',
      bairroEnd: '',
      cidadeEnd: '',
      estadoEnd: ''
    };
  }


  async CheckIfLocationEnabled() {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      this.AlertPro.open();
    } else {
      this.setState({locationServiceEnabled: enabled});
    }
  };



  async GetCurrentLocation(){
    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      this.AlertPro2.open();
    }
  
    let { coords } = await Location.getCurrentPositionAsync();
  
    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
  
      for (let item of response) {
        let address = `${item.region}, ${item.subregion}, ${item.district}, ${item.street} (${item.postalCode})`;
        this.setState({cep: address})

      }
    }
  };


  componentDidMount() {
    this.setState({id: this.props.route.params.idDoContratado})
    this.setState({idContratante: this.props.route.params.idDoContratante})
    this.setState({nome: this.props.route.params.nome})
    this.setState({foto: this.props.route.params.foto})
    this.setState({servico: this.props.route.params.servico})
    this.setState({telefone: this.props.route.params.telefone})
    this.setState({valor: this.props.route.params.valor})
    this.setState({photoUser: this.props.route.params.photoUser})
    this.setState({title: this.props.route.params.titlePublish})
    this.setState({idAnuncio: this.props.route.params.idAnuncio})
    this.setState({type: this.props.route.params.type})

    //pede ao usuario para habilitar os serviços de localização
    this.CheckIfLocationEnabled();

  }

  //envia a notificação para os servidores expo e o expo encaminha para o FCM e Apple Cloud Messaging. A NOTIFICAÇÃO É ENVIADA PARA O USUARIO CONTRATADO
  async sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Dinheiro chegando',
      body: 'Algum usuário quer lhe contratar! Acesse o WeWo',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  onChange = (event, selectedDate) => {
    this.setState({showDate: false})
    const currentDate = selectedDate || this.state.date;
    this.setState({date: currentDate});
    this.setState({showHour: true})
    this.setState({boolean: true})
    console.log('data selecionada: ' + currentDate)
  };

  onChangeHour = (event, selectedHour) => {
    this.setState({showHour: false})
    this.setState({boolean: true})

    let hourComplete = selectedHour.getHours();
    let minutesComplete = selectedHour.getMinutes();
    let completeTime = hourComplete + ':' + minutesComplete;
    
    this.setState({horario: completeTime})
    console.log('hora selecionada: ' + completeTime)
    
  };


  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  onChangePreco(text) {
    this.setState({valor: text})
    console.log('preco estab'  + this.state.valor)
  }


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  convertDate() {
    let day = this.state.date.getDate();
    let month = this.state.date.getMonth() + 1;
    let year = this.state.date.getFullYear();

    let fullDate = day + '/' + month + '/' + year;

    console.log('data escolhida: ' +  fullDate)
    return fullDate;
  }

  //sleep function
  sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
  }


  openModalizeLocation() {
    this.GetCurrentLocation();
    const modalizeLocation = this.state.modalizeLocation;

    modalizeLocation.current?.open()
  }

  updateToFirebase() {
    let e = this;
    let dataAtual = this.convertDate();
    let userUID = firebase.auth().currentUser.uid;
    let idRandom = this.makeid(25);
    
    if(this.state.boolean !== false) {
      e.setModalVisible(true)
      this.sleep(2000).then(() => { 
        firebase.firestore().collection('notifications').doc(idRandom).set({
          idContratante: e.state.idContratante,
          idNot: idRandom,
          idContratado: e.state.id,
          idAnuncio: e.state.idAnuncio,
          type: e.state.type,
          photoProfile: e.state.foto,
          nome: e.state.nome,
          telefone: e.state.telefone,
          service: e.state.servico,
          valor: e.state.valor,
          cep: e.state.cep,
          horario: e.state.horario,
          dataServico: dataAtual,
          photoUser: e.state.photoUser,
          titlePublish: e.state.title,
          confirmed: false
        })
        
        e.setModalVisible(false)
        alert('Parabens! O anunciante foi notificado e em breve ira contacta-lo em breve pelo app. Fique atento a aba de serviços enviados')
        e.props.navigation.navigate('Home')
      })
    } else {
      this.AlertPro3.open();
    }
  }


  onChangeNomeEnd(text) {
    this.setState({nomeEnd: text})
  }

  onChangeCEPEnd(text) {
    this.setState({cepEnd: text})
  }

  onChangeEnderecoEnd(text) {
    this.setState({endereco: text})
  }

  onChangeNumeroEnd(text) {
    this.setState({numeroEnd: text})
  }

  onChangeComplementoEnd(text) {
    this.setState({complementoEnd: text})
  }

  onChangeBairroEnd(text) {
    this.setState({bairroEnd: text})
  }

  onChangeCidadeEnd(text) {
    this.setState({cidadeEnd: text})
  }

  onChangeEstadoEnd(text) {
    this.setState({estadoEnd: text})
  }


  saveAdress() {
    const {nomeEnd, cepEnd, endereco, numeroEnd, complementoEnd, bairroEnd, cidadeEnd, estadoEnd} = this.state; 

    if(nomeEnd !== '' && cepEnd !== '' && endereco !== '' && numeroEnd !== '' && complementoEnd !== '' && bairroEnd !== '' && cidadeEnd !== '' && estadoEnd !== '') {
      let address = `${nomeEnd}, ${endereco}, ${bairroEnd}, ${cidadeEnd}, ${estadoEnd} (${cepEnd})`
      this.setState({cep: address})
    } else {
      alert('Por favor preencha todos os campos do seu endereço')
    }
  }

  render() {
    return (
      <SafeAnuncioView>
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
          title="O serviço de localização não está ativado"
          message="Por favor ative o serviço de localização para continuar"
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
          title="Permissão negada pelo usuário"
          message="Permita o app usar o serviço de localização"
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
          title="Erro!"
          message="Por favor, selecione a data e horário do serviço!"
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

        
        <ScrollView style={{marginBottom:50}}>
          <View style={{alignItems:'center', marginTop:15}}>
            <View style={{flexDirection:'row', marginRight: 74}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <IconResponsiveNOBACK style={{marginRight: 64, marginTop:5}} name="arrow-left" size={20}/>
              </TouchableOpacity>
              <Heading>Contratar Serviço</Heading>
            </View>

            <TextDescription2 style={{paddingHorizontal:40, marginTop:30, textAlign:'center'}}>Olá {this.state.nome}, nessa tela você deve fornecer os dados necessários para que o contratado saiba onde, como e quando te encontrar!</TextDescription2>
            <TextDescription2 style={{paddingHorizontal:40, marginTop:30, textAlign:'center'}}>Após o envio espere uma notificação de retorno do contratado</TextDescription2>

            <Image source={{uri: this.state.foto}} style={{width:50, height:50, borderRadius:50, marginTop: 20}}/>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Seu Nome</Subtitle2EditProfile>
                <InputForm
                    value={`${this.state.nome}                                                                                         `}
                    style={{marginBottom: 10}}
                    editable={false}
                    onChangeText={() => {}}
                    autoCapitalize={'words'}
                    maxLength={32}
                    placeholder="Seu Nome                                                                       "
                />
                
            </View>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Serviço a ser Contratado</Subtitle2EditProfile>
                <InputForm
                    value={`${this.state.servico}                                                                                          `}
                    style={{marginBottom: 10}}
                    editable={false}
                    onChangeText={() => {}}
                    autoCapitalize={'words'}
                    maxLength={32}
                    placeholder="Serviço a ser Contratado                                                                       "
                />
            </View>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Seu Telefone</Subtitle2EditProfile>
                <InputForm
                    value={`${this.state.telefone}                                                                                            `}
                    style={{marginBottom: 10}}
                    editable={false}
                    onChangeText={() => {}}
                    autoCapitalize={'words'}
                    maxLength={32}
                    placeholder="Seu número de telefone                                                                       "
                />
            </View>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile style={{textAlign: 'justify'}}>Digite aqui o valor do serviço que deseja pagar, o anunciante podera enviar uma contra-proposta pelo chat, caso aceito este sera o valor definitivo</Subtitle2EditProfile>
                <InputFormMask
                  type={'money'}
                  style={{marginBottom: 10, marginTop: 10}}
                  value={`${this.state.valor}                                                                                                    `}
                  onChangeText={text => this.onChangePreco(text)}
                  keyboardType={"number-pad"}
                  placeholder="Dê sua oferta de valor                                                                            "
                />
            </View>

            <TouchableOpacity onPress={() => this.openModalizeLocation()} style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile style={{textAlign:'center'}}>Clique aqui para adicionar o endereço (se o campo ficar vazio será considerado remoto)</Subtitle2EditProfile>
            </TouchableOpacity>
            
            <View style={{marginTop:30, paddingHorizontal:20}}>
                <TouchableOpacity onPress={() => this.setState({showDate: true})}>
                    <Text style={{color: '#DAA520', fontWeight: 'bold', fontSize:12}}>
                        Clique aqui e defina a data do serviço: {this.convertDate()}
                    </Text>
                </TouchableOpacity>
            </View>

            {this.state.showDate == true &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={true}
                    onChange={this.onChange}
                    
                    display="default"
                    style={{width: 320, marginLeft: windowWidth/2, marginTop: 20, backgroundColor: "white"}}
                />
            }

            {this.state.showHour == true &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.hour}
                    mode='time'
                    is24Hour={true}
                    display="default"
                    onChange={this.onChangeHour}
                    style={{width: 320, marginLeft: windowWidth/1.5, marginTop: 20, backgroundColor: "white"}}
                />
            }

            <TouchableOpacity onPress={() => this.updateToFirebase()} style={{marginTop:30, paddingHorizontal:20}}>
                <IconResponsiveNOBACK name="telegram-plane" size={35}/>
            </TouchableOpacity>



          {/*Modalize do CEP*/}
          <Modalize
            ref={this.state.modalizeLocation}
            snapPoint={400}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
            >
            <View style={{flex:1,alignItems:'center', flexDirection:'column'}}>
                <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, color:'#fff'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000'}}>Localização</Text>
                
                {this.state.cep == null ?
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>Nenhum endereço encontrado</Text>
                :
                  <Text style={this.context.dark ? {fontWeight: 'bold', padding:15,color:'#fff', textAlign:'center'} : {fontWeight: 'bold', padding:15,color:'#000',textAlign:'center'}}>{this.state.cep}</Text>  
                }
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this.GetCurrentLocation()} style={{alignItems:'center', justifyContent:'center', marginTop:10, marginRight:15, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="search-location" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({cep: null})} style={{alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="times-circle" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({cep: 'Digite seu Endereço'})} style={{marginLeft: 15, alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#E3E3E3', width:40, height:40, borderRadius:30}}>
                    <FontAwesome5 name="pencil-alt" size={24} color={'#9A9A9A'}/>
                  </TouchableOpacity>
                </View>
            </View>

            {this.state.cep == 'Digite seu Endereço' && 
                <View style={{flexDirection:"column", marginTop:10, paddingHorizontal: 50}}>
                  <InputForm
                    value={this.state.nomeEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeNomeEnd(text)}
                    maxLength={20}
                    placeholder="Nome para o endereço"
                  />

                  <InputFormMask
                    type={'zip-code'}
                    value={this.state.cepEnd}
                    onChangeText={text => this.onChangeCEPEnd(text)}
                    keyboardType={"number-pad"}
                    placeholder="Digite o CEP"
                  />

                  <InputForm
                    value={this.state.endereco}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeEnderecoEnd(text)}
                    maxLength={20}
                    placeholder="Endereço. ex: Rua das Flores"
                  />

                  <InputForm
                    value={this.state.numeroEnd}
                    keyboardType={"number-pad"}
                    onChangeText={text => this.onChangeNumeroEnd(text)}
                    maxLength={20}
                    placeholder="Número do Endereço"
                  />

                  <InputForm
                    value={this.state.complementoEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeComplementoEnd(text)}
                    maxLength={20}
                    placeholder="Complemento"
                  />

                  <InputForm
                    value={this.state.bairroEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeBairroEnd(text)}
                    maxLength={20}
                    placeholder="Bairro"
                  />

                  <InputForm
                    value={this.state.cidadeEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeCidadeEnd(text)}
                    maxLength={20}
                    placeholder="Cidade"
                  />

                  <InputForm
                    value={this.state.estadoEnd}
                    autoCapitalize={"words"}
                    onChangeText={text => this.onChangeEstadoEnd(text)}
                    maxLength={20}
                    placeholder="Estado"
                  />


                  <TouchableOpacity onPress={() => this.saveAdress()} style={{paddingHorizontal: 23, height:50, borderRadius:20,  flexDirection:'row', alignItems: 'center', backgroundColor:'#d98b0d', marginTop:30}}>
                    <IconResponsive name="check" size={30}/>
                    <Text style={{color: this.context.dark ? 'white' : '#121212', fontSize:15, marginLeft: 15, fontWeight:'bold'}}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
                


              }
                 

            <View>
              <Text style={this.context.dark ? {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#fff', textAlign:'center'}: {fontWeight: 'bold', padding:15, fontSize:20, marginTop:50, color:'#000', textAlign:'center'}}>Por favor, verifique se as informações conferem, caso não, pesquise o endereço novamente</Text>
            </View>
          </Modalize>

          </View>
        </ScrollView>
      </SafeAnuncioView>
    );
  }
}
