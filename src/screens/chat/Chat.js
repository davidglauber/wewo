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
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';




//import firebase
import firebase from '../../config/firebase';

import { SafeAnuncioView, Heading, InputChat, IconResponsiveNOBACK, IconResponsive, TextDescription2, InputFormMask} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


import LottieView from 'lottie-react-native';

import { Modalize } from 'react-native-modalize';

import loading from '../../../assets/loading.json';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  moneyCard: {
    position:'absolute',
    left:windowWidth/1.2,
    backgroundColor:'#d98b0d',
    padding:7,
    borderRadius:10
  }
})
export default class Chat extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {
      idUserLogado: '',
      idUserDonoDoAnuncio:'',
      nome: '',
      foto:'',
      modalVisible: false,
      textChat: '',
      modalizeRef: React.createRef(null),
      chatFromFirebase: [],
      idUserRespondedorDaMensagem: '',
      valueUser:'',
      type: '',
      idAnuncioUser: ''
    };
  }

  async componentDidMount() {
    let e = this;
    this.setState({idUserLogado: this.props.route.params.idLoggedUser})
    this.setState({idUserDonoDoAnuncio: this.props.route.params.idDonoDoAnuncio})
    this.setState({valueUser: this.props.route.params.valuePayment})
    this.setState({type: this.props.route.params.type})
    this.setState({idAnuncioUser: this.props.route.params.idDoAnuncio})

    console.log('USUARIO DONO DO ANUNCIO: ' + this.props.route.params.idDonoDoAnuncio)
    console.log('Valor do SERVIÇO: ' + this.props.route.params.valuePayment)

    await firebase.firestore().collection('notifications').doc(this.props.route.params.idNotification).collection('chat').orderBy("time", "asc").onSnapshot(documentSnapshot => {
      let chatContent2 = [];
      documentSnapshot.forEach(function(doc) {
        chatContent2.push({
          idContratado: doc.data().idUsuarioQueEnviou,
          idContratante: doc.data().idUsuarioQueRecebeu,
          valorCombinado: doc.data().valorCombinado,
          boolean: doc.data().boolean,
          texto: doc.data().texto,
          time: doc.data().time
        })

      })

      e.setState({chatFromFirebase: chatContent2})
    })
  }

  openModalize() {
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.open()
  }


  closeModalize(){
    const modalizeRef = this.state.modalizeRef;

    modalizeRef.current?.close()
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

  uploadChatToFirebase(linkToPaymentScreen) {
    let currentTime = new Date().getTime();

    let textChat = this.state.textChat;
    let idUserDonoDoAnuncio = this.state.idUserDonoDoAnuncio;
    let currentUser = firebase.auth().currentUser;
    let e = this;

    if(linkToPaymentScreen == false){
      firebase.firestore().collection('notifications').doc(this.props.route.params.idNotification).collection('chat').doc().set({
        idUsuarioQueEnviou: currentUser.uid,
        idUsuarioQueRecebeu: e.state.idUserDonoDoAnuncio,
        texto: textChat,
        boolean: false,
        time: currentTime
      })
    } else {
      firebase.firestore().collection('notifications').doc(this.props.route.params.idNotification).collection('chat').doc().set({
        idUsuarioQueEnviou: currentUser.uid,
        idUsuarioQueRecebeu: e.state.idUserDonoDoAnuncio,
        texto: `Valor combinado: ${e.state.valueUser}. Clique aqui para ser redirecionado para a tela de pagamento (somente usuário pagador)`,
        valorCombinado: e.state.valueUser,
        boolean: true,
        time: currentTime
      })

      e.closeModalize()
      e.props.navigation.navigate('AwaitPayment')
    }

    e.setState({textChat: ''})

  }




  onChangeText(text) {
    this.setState({textChat: text})
  }


  render() {
    const { valueUser } = this.state;
    const currentUserId = firebase.auth().currentUser.uid; 
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
            <Heading>Chat</Heading>
            
            {this.state.type == 'confirmedNotif' &&
              <TouchableOpacity style={styles.moneyCard} onPress={() => this.openModalize()}>
                <IconResponsive name="money-bill-alt" size={24}/>
              </TouchableOpacity>
            }

            <FlatList
              keyExtractor={() => this.makeid(17)}
              data={this.state.chatFromFirebase}
              renderItem={({item}) => 
              <View>
                {/*USUARIO QUE ENVIOU A MENSAGEM*/}
                {currentUserId == item.idContratado && item.valorCombinado !== null && item.boolean == true  &&
                  <View style={{marginTop:30, marginLeft:50, backgroundColor:'#d98b0d', padding:10, minWidth: windowWidth/1.4, maxWidth: windowWidth/1.4, borderRadius:20}}>
                    <Text style={{color:'white'}}>{item.texto}</Text>
                  </View>
                }



                {currentUserId == item.idContratado && item.valorCombinado == null && item.boolean == false &&
                  <View style={{marginTop:20, marginLeft:50, backgroundColor:'#d98b0d', padding:10, minWidth: windowWidth/1.4, maxWidth: windowWidth/1.4, borderRadius:20}}>
                    <Text style={{color:'white'}}>{item.texto}</Text>
                  </View>
                }


                {currentUserId !== item.idContratado && item.valorCombinado == null && item.boolean == false &&
                  <View onPress={() => alert('oi')} style={{marginTop:15, marginRight:50, backgroundColor:'#d4cccb', padding:10, minWidth: windowWidth/1.4, maxWidth: windowWidth/1.4, borderRadius:20}}>
                    <Text style={{color:'black'}}>{item.texto}</Text>
                  </View>
                }


                {currentUserId !== item.idContratado && item.valorCombinado !== null && item.boolean == true &&
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('PaymentServices', {valuePayment: item.valorCombinado, idNotification: this.props.route.params.idNotification, idContratado: item.idContratado, idDoAnuncio: this.state.idAnuncioUser})} style={{marginTop:15, marginRight:50, backgroundColor:'#d4cccb', borderWidth:2, borderColor:"#d98b0d", padding:10, minWidth: windowWidth/1.4, maxWidth: windowWidth/1.4, borderRadius:20}}>
                    <Text style={{color:'black', fontSize:17}}>{item.texto}</Text>
                  </TouchableOpacity>
                }
                
              </View>
              }
            ></FlatList>

          </View>
        </ScrollView>

        {/*Modalize para definir o valor*/}
          <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
            <View style={{alignItems:'center', marginTop:40, paddingHorizontal:40}}>
              <Heading style={this.context.dark ? {fontWeight:'bold', marginLeft: 10, marginBottom:10, color:'#fff'} : {fontWeight:'bold', marginBottom:10, marginLeft: 10, color:'#d98b0d'}}>Definir Valor</Heading>
              <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>(Digite o valor negociado)</TextDescription2>
                <InputFormMask
                  type={'money'}
                  value={this.state.valueUser}
                  placeholderTextColor={this.context.dark ? "#fff" : "#000"}
                  style={{borderWidth:3, borderColor: '#DAA520', borderRadius:20, padding:10}}
                  onChangeText={(text) => this.setState({valueUser: text})}
                  keyboardType={"number-pad"}
                  placeholder="Digite o valor definitivo do serviço...                                                          "
                />

            <TouchableOpacity onPress={() => this.uploadChatToFirebase(true)} style={{marginTop:30, paddingHorizontal:20}}>
                <IconResponsiveNOBACK name="telegram-plane" size={35}/>
            </TouchableOpacity>
            </View>
          </Modalize>
        
        <View style={{paddingHorizontal:20}}>
            <InputChat
                value={this.state.textChat}
                style={{marginBottom: 10, position:'absolute', bottom: windowHeight/44, left:20}}
                editable={true}
                onChangeText={text => this.onChangeText(text) }
                maxLength={255}
                multiline={true}
                minLength={1}
                placeholderTextColor={this.context.dark ? "#fff" : "#000"}
                placeholder="Digite sua mensagem...                                                                       "
            />
            <TouchableOpacity onPress={() => this.uploadChatToFirebase(false)} style={{paddingHorizontal:20, marginLeft: windowWidth/1.45, marginBottom: windowHeight/20}}>
                <IconResponsiveNOBACK name="telegram-plane" size={27}/>
            </TouchableOpacity>
        </View>
      </SafeAnuncioView>
    );
  }
}
