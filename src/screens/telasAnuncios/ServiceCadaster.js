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

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
      boolean: false
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
        e.props.navigation.navigate('Home')
      })
    } else {
      this.AlertPro3.open();
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
            <Heading>Contratar Serviço</Heading>

            <TextDescription2 style={{paddingHorizontal:40, marginTop:30, textAlign:'center'}}>Olá {this.state.nome}, nessa tela você deve fornecer os dados necessários para que o contratado saiba onde, como e quando te encontrar!</TextDescription2>
            <TextDescription2 style={{paddingHorizontal:40, marginTop:30, textAlign:'center'}}>Após o envio espere uma notificação de retorno do contratado</TextDescription2>

            <Image source={{uri: this.state.foto}} style={{width:50, height:50, borderRadius:50, marginTop: 20}}/>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Seu Nome</Subtitle2EditProfile>
                <InputForm
                    value={this.state.nome}
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
                    value={this.state.servico}
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
                    value={this.state.telefone}
                    style={{marginBottom: 10}}
                    editable={false}
                    onChangeText={() => {}}
                    autoCapitalize={'words'}
                    maxLength={32}
                    placeholder="Seu número de telefone                                                                       "
                />
            </View>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Valor do Serviço</Subtitle2EditProfile>
                <InputFormMask
                  type={'money'}
                  style={{marginBottom: 10}}
                  value={this.state.valor}
                  onChangeText={text => this.onChangePreco(text)}
                  keyboardType={"number-pad"}
                  placeholder="Dê sua oferta de valor                                                          "
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

            <TouchableOpacity onPress={() => this.updateToFirebase()} style={{marginTop:30, paddingHorizontal:20}}>
                <IconResponsiveNOBACK name="telegram-plane" size={35}/>
            </TouchableOpacity>

            {this.state.showDate == true &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={true}
                    onChange={this.onChange}
                    
                    display="default"
                    style={{width: 320, backgroundColor: "white"}}
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
                    style={{width: 320, backgroundColor: "white"}}
                />
            }


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
                </View>
            </View>
                 

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
