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
  View,
} from 'react-native';




//import firebase
import firebase from '../../config/firebase';

import { SafeAnuncioView, Heading, TextDescription2, IconResponsive, InputChat, Subtitle2EditProfile, ButtonCustomized, IconResponsiveNOBACK} from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';


import LottieView from 'lottie-react-native';


import loading from '../../../assets/loading.json';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ChatReceive extends Component {
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
      chatFromFirebase: []
    };
  }

  async componentDidMount() {
    let e = this;
    let loggedUser = firebase.auth().currentUser;

    await firebase.firestore().collection('chat').where('idContratado', "==", loggedUser.uid).orderBy("texto", "desc").onSnapshot(documentSnapshot => {
      let chatContent = [];
      documentSnapshot.forEach(function(doc) {
        chatContent.push({
          idContratado: doc.data().idContratado,
          idContratante: doc.data().idContratante,
          texto: doc.data().texto
        })
      })

      e.setState({chatFromFirebase: chatContent})
    })
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

  async uploadChatToFirebase() {
    let textChat = this.state.textChat;
    let idRandom = this.makeid(25);
    let e = this;

    await firebase.firestore().collection('chat').doc(idRandom).set({
        idContratante: e.state.idUserLogado,
        idContratado: e.state.idUserDonoDoAnuncio,
        texto: textChat
    })

    e.setState({textChat: ''})


  }

  onChangeText(text) {
    this.setState({textChat: text})
    console.log('text: '  + this.state.textChat)
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
            <Heading>Chat</Heading>
            


            <FlatList
              keyExtractor={() => this.makeid(17)}
              data={this.state.chatFromFirebase}
              renderItem={({item}) => 
                <View style={{marginTop:10, marginLeft:50, backgroundColor:'#d98b0d', padding:10, minWidth: windowWidth/1.4, maxWidth: windowWidth/1.4, borderRadius:20}}>
                  <Text style={{color:'white'}}>{item.texto}</Text>
                </View>
              }
            ></FlatList>

          </View>
        </ScrollView>
        
        <View style={{paddingHorizontal:20}}>
            <InputChat
                value={this.state.textChat}
                style={{marginBottom: 10, position:'absolute', bottom: windowHeight/44, left:20}}
                editable={true}
                onChangeText={text => this.onChangeText(text) }
                maxLength={255}
                multiline={true}
                minLength={1}
                placeholder="Digite sua mensagem...                                                                       "
            />
            
            <TouchableOpacity onPress={() => this.uploadChatToFirebase()} style={{paddingHorizontal:20, marginLeft: windowWidth/1.45, marginBottom: windowHeight/20}}>
                <IconResponsiveNOBACK name="telegram-plane" size={27}/>
            </TouchableOpacity>
        </View>
      </SafeAnuncioView>
    );
  }
}
