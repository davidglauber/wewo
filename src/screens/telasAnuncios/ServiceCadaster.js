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

import { SafeAnuncioView, Heading, TextDescription2, IconResponsive, InputForm, Subtitle2EditProfile, ButtonCustomized, IconResponsiveNOBACK} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


import LottieView from 'lottie-react-native';

//import datepicker
import DateTimePicker from '@react-native-community/datetimepicker';


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
      date: new Date(),
      mode:'date',
      showDate: false,
      cep: '',
      cepBOOLEAN: false,
      modalVisible: false,
    };
  }


  
  componentDidMount() {
    this.setState({id: this.props.route.params.idDoContratado})
    this.setState({idContratante: this.props.route.params.idDoContratante})
    this.setState({nome: this.props.route.params.nome})
    this.setState({foto: this.props.route.params.foto})
    this.setState({servico: this.props.route.params.servico})
    this.setState({telefone: this.props.route.params.telefone})
    this.setState({valor: this.props.route.params.valor})
  }


  onChange = (event, selectedDate) => {
    this.setState({showDate: false})
    const currentDate = selectedDate || this.state.date;
    this.setState({date: currentDate});
    console.log('data selecionada: ' + currentDate)
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

  cepText = (text) => {
    this.setState({
      cep: text,
    });
  };

    //sleep function
    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

  searchCEP() {
    fetch(`https://viacep.com.br/ws/${this.state.cep}/json`).then(resposta => resposta.json()).then(obj =>  this.setState({cepBOOLEAN: true})).catch(err => this.setState({cepBOOLEAN: false}))
  }




  updateToFirebase() {
    this.searchCEP();

    let e = this;
    let dataAtual = this.convertDate();
    let userUID = firebase.auth().currentUser.uid;
    let idRandom = this.makeid(25);
    e.setModalVisible(true)



    
    
    
    this.sleep(1000).then(() => { 
        if(this.state.cepBOOLEAN == true){
            firebase.firestore().collection('notifications').doc(idRandom).set({
                idContratante: e.state.idContratante,
                idNot: idRandom,
                idContratado: e.state.id,
                photoProfile: e.state.foto,
                nome: e.state.nome,
                telefone: e.state.telefone,
                service: e.state.servico,
                valor: e.state.valor,
                cep: e.state.cep,
                dataServico: dataAtual,
                confirmed: false
            })

            e.setModalVisible(false)
            e.props.navigation.navigate('Home')
        } else {
            alert('Erro no CEP, confire-o novamente') 
            e.props.navigation.navigate('Home')
        }
    })
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
                <Subtitle2EditProfile>Seu telefone</Subtitle2EditProfile>
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
                <InputForm
                    value={this.state.valor}
                    style={{marginBottom: 10}}
                    editable={false}
                    onChangeText={() => {}}
                    autoCapitalize={'words'}
                    maxLength={32}
                    placeholder="Valor do serviço                                                                       "
                />
            </View>

            <View style={{marginTop:30, paddingHorizontal:20}}>
                <Subtitle2EditProfile>Seu CEP (o contratado usará para chegar até você)</Subtitle2EditProfile>
                <InputForm
                    value={this.state.cep}
                    style={{marginBottom: 10}}
                    editable={true}
                    onChangeText={text => this.cepText(text) }
                    autoCapitalize={'words'}
                    maxLength={8}
                    minLength={8}
                    keyboardType={"numeric"}
                    placeholder="Digite seu CEP (só números)                                                                       "
                />
            </View>
            
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

          </View>
        </ScrollView>
      </SafeAnuncioView>
    );
  }
}
