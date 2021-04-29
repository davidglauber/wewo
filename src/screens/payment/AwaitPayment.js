/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useContext, useState, useEffect} from "react";
import {
  StatusBar,
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";

//CSS responsivo
import { SafeBackground, TextTheme, TextDescription2, IconResponsiveNOBACK, Heading} from '../home/styles';

import LottieView from 'lottie-react-native';

import firebase from '../../config/firebase';

import { useRoute, useNavigation } from "@react-navigation/native";

import { ThemeContext } from '../../../ThemeContext';

import payLoading from '../../../assets/loadingPay.json';


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
export default function AwaitPayment() {
const route = useRoute();
const navigation = useNavigation();
const {dark, setDark} = useContext(ThemeContext);
const [name, setName] = useState('');

useEffect(() => {
  async function getUserName() {
    await firebase.firestore().collection('usuarios').doc(firebase.auth().currentUser.uid).onSnapshot(documentSnapshot => {
      setName(documentSnapshot.data().nome)
    })
  }

  getUserName()
}, [])



async function deleteFromFirebase() {
  await firebase.firestore().collection('notifications').where('idNot', "==", route.params.idNotification).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc){
      doc.ref.delete();
    })
  }).then(() => {
    Alert.alert(`Parabéns ${name}!`, "O serviço foi concluído, quanto mais serviços fizer mais você cresce e mais clientes você ganha!", [
      {
          text: "OK",
          onPress: () => navigation.navigate('Home'),
          style: "cancel"
      },
      { text: "Vou continuar", onPress: () =>  navigation.navigate('Home')}
    ]);
  })
}



function deleteNotification() {
  Alert.alert("Importante", "Ao confirmar que o pagamento foi aprovado toda o chat será excluído", [
    {
        text: "Cancelar",
        onPress: () => null,
        style: "cancel"
    },
    { text: "Confirmar", onPress: () => deleteFromFirebase() }
  ]);
}

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={dark ? '#121212' : 'white'}
          barStyle={dark ? 'light-content' : 'dark-content'}
        />

          <View style={{alignItems:"center"}}>
            <Heading style={styles.paddingTitle}>Aguardando Pagamento</Heading>

            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Essa tela se atualiza constantemente, ao pagamento ser confirmado será mostrada uma mensagem de sucesso! {"\n\n"}<TextDescription2 style={{fontWeight:"bold"}}>(Lembre-se de pedir ao cliente para lhe avaliar)</TextDescription2></TextDescription2>
            <View style={{alignItems:'center', marginTop:100}}>
              <LottieView source={payLoading} style={{width:200, height:200}} autoPlay loop />  
              <TouchableOpacity onPress={() => deleteNotification()} style={{marginTop:50, height:50, width:200, borderRadius:20,  flexDirection:'row', alignItems: 'center', justifyContent:"center", backgroundColor:'#d98b0d'}}>
                  <Text style={{fontSize:15, fontWeight:'bold', color: dark ? 'black' : 'white'}}>Recebi o dinheiro</Text>
              </TouchableOpacity>
            </View>
          </View>


      </SafeBackground>
    );
}
