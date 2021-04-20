/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, useEffect} from 'react';
import {
  Alert,
  I18nManager,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import Color from 'color';

// import components
import Button from '../../components/buttons/Button';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import NumericKeyboard from '../../components/keyboard/NumericKeyboard';
import { useRoute, useNavigation } from "@react-navigation/native";

//import firebase
import firebase from '../../config/firebase';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaVerifier } from 'expo-firebase-recaptcha';


// import colors
import Colors from '../../theme/colors';
import { TextInput } from 'react-native-gesture-handler';

// VerificationB Config
const isRTL = I18nManager.isRTL;

// VerificationB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {color: 'black'},
  instruction: {
    marginTop: 16,
    paddingHorizontal: 40,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    opacity: 0.76,
  },
  codeContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
  },
  digitContainer: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 103,
    height: 45,
    borderRadius: 4,
    backgroundColor: '#e4e6dc',
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: '#DAA520',
  },
  buttonContainer: {
    marginBottom: 44,
  },
  
});



// VerificationEMAIL
export default function SMSVerificacao () {
  const route = useRoute();
  const navigation = useNavigation();
  let changePhone = '+55' + route.params.telefone;
  let changePhone2 = changePhone.replace(' ', '');
  let changePhone3 = changePhone2.replace('-', '');
  let changePhone4 = changePhone3.replace('(', '');
  let changePhone5 = changePhone4.replace(')', '');

  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState(`${changePhone5}`);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const getNome = route.params.nome;
  const getEmail = route.params.email;
  const getSenha = route.params.senha;
  const getTelefone = route.params.telefone;
  const getDataNascimento = route.params.dataNascimento;
  const getTipoDeConta = route.params.tipoDeConta;



  useEffect(() =>{
    async function SendSMS() {
      try {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        alert('O código de verificação foi enviado para o seu celular')
      } catch (err) {
        alert('Ocorreu um erro ao enviar o SMS: ' + err)
      }
    }
    SendSMS();
  }, [])


  async function SendSMS2() {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      alert('O código de verificação foi enviado para o seu celular')
    } catch (err) {
      alert('Ocorreu um erro ao enviar o SMS: ' + err)
    }
  }

  
    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor='white'
          barStyle="dark-content"
        />

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Aguarde...</Heading5>
            <Paragraph style={styles.instruction}>
                O SMS de confirmação foi enviado com o código de acesso (PODE LEVAR ATÉ 5 MINUTOS, SE NÃO CHEGAR, PEÇA PARA REENVIAR O CÓDIGO).  
                Ao receber, digite abaixo
            </Paragraph>


            <View style={styles.digitContainer}>
              <TextInput
                style={styles.digit}
                maxLength={6}
                autoFocus={true}
                keyboardType={'number-pad'}
                onChangeText={setVerificationCode}
              />
            </View>

            <View style={styles.codeContainer}>


              <Button
                onPress={async () => {
                  try {
                    SendSMS2()                  
                    alert('Código Reenviado 👍')
                  } catch (err) {
                    navigation.navigate('HomeNavigator')
                    alert('Erro ao confirmar código', err)
                  }
                }}
                disabled={false}
                borderRadius={4}
                color={Colors.onPrimaryColor}
                small
                title={'reenviar'.toUpperCase()}
                titleColor={'#DAA520'}
              />

              <Button
              onPress={async () => {
                try {
                  const credential = firebase.auth.PhoneAuthProvider.credential(
                    verificationId,
                    verificationCode
                  );
                  await firebase.auth().signInWithCredential(credential);
                    var user = firebase.auth().currentUser;
                    firebase.firestore().collection('usuarios').doc(user.uid).set({
                      email: getEmail,
                      nome: getNome,
                      premium: false,
                      dataNascimento: getDataNascimento,
                      telefone: getTelefone,
                      tipoDeConta: getTipoDeConta
                    })
                  AsyncStorage.setItem('emailUserSaved', getEmail)
                  navigation.navigate('HomeNavigator')
                  alert('Você foi cadastrado com sucesso 👍')
                } catch (err) {
                  navigation.navigate('HomeNavigator')
                  alert('Erro ao confirmar código', err)
                }
              }}
              disabled={false}
              borderRadius={4}
              color={Colors.onPrimaryColor}
              small
              title={'Confirmar'.toUpperCase()}
              titleColor={'#DAA520'}
            />

            </View>

          
          </View>


        </ScrollView>
      </SafeAreaView>
    );
  }
