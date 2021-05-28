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
  StyleSheet,
  TextInput,
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
import { useNavigation } from "@react-navigation/native";


import AlertPro from "react-native-alert-pro";

//import firebase
import firebase from '../../config/firebase';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaVerifier } from 'expo-firebase-recaptcha';

//input mask
import { TextInputMask } from 'react-native-masked-text';


// import colors
import Colors from '../../theme/colors';


const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';

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
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 133,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#e4e6dc',
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: "#DAA520",
  },
  buttonContainer: {
    marginBottom: 44,
  },
  
});



// VerificationEMAIL
export default function TelaLoginSMS () {
  const navigation = useNavigation();
  const [phoneInput, setPhoneInput] = React.useState('');
  const alertPro = React.useRef();
  const alertPro2 = React.useRef();

  let changePhone = '+55' + phoneInput;
  let changePhone2 = changePhone.replace(' ', '');
  let changePhone3 = changePhone2.replace('-', '');
  let changePhone4 = changePhone3.replace('(', '');
  let changePhone5 = changePhone4.replace(')', '');
  
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState(`${changePhone5}`);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

    async function SendSMS(e) {
      let changePhone = '+55' + e;
      let changePhone2 = changePhone.replace(' ', '');
      let changePhone3 = changePhone2.replace('-', '');
      let changePhone4 = changePhone3.replace('(', '');
      let changePhone5 = changePhone4.replace(')', '');

      console.log('CHANGE PHONE 5: ' + changePhone5)


      try {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          changePhone5,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        alertPro.current.open();
      } catch (err) {
        alert('Ocorreu um erro ao enviar o SMS: ' + err)
      }
    }


    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>

      <AlertPro
        ref={alertPro}
        showCancel={false}
        onConfirm={() => alertPro.current.close()}
        title="Tudo certo!"
        message="O código de verificação foi enviado para o seu celular"
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
        ref={alertPro2}
        showCancel={false}
        onConfirm={() => alertPro2.current.close()}
        title="Tudo certo"
        message="Logado com sucesso!"
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
          backgroundColor="white"
          barStyle="dark-content"
        />

        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Digite o seu Número para Logar</Heading5>
            <Paragraph style={styles.instruction}>
                Assim que confirmado, você entrará na sua conta {"\n\n"}(PODE LEVAR ATÉ 5 MINUTOS, SE NÃO CHEGAR, PEÇA PARA REENVIAR O CÓDIGO).
            </Paragraph>


          <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'column'}}>
                  <View style={styles.codeContainer}>
                    <View style={styles.digitContainer}>
                      <TextInputMask
                        type={'cel-phone'}
                        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                        borderColor={INPUT_BORDER_COLOR}
                        style={{padding:4, color:'gray'}}
                        value={phoneInput}
                        onChangeText={setPhoneInput}
                        placeholderTextColor={'gray'}
                        keyboardType={"phone-pad"}
                        placeholder="Tel Numero"
                      />
                    </View>
                  </View>


                  <View style={{paddingTop:27}}>
                    <Button
                      onPress={() => SendSMS(phoneInput)}
                      disabled={false}
                      borderRadius={4}
                      color={Colors.onPrimaryColor}
                      small
                      title={'Enviar SMS'.toUpperCase()}
                      titleColor={'#DAA520'}
                    />
                  </View>

                </View>

          </View>
          </View>

          <View style={{marginBottom: 234}}>
            <View style={{marginBottom:20}}>
              <View style={styles.codeContainer}>
                  <View style={styles.digitContainer}>
                    <TextInput
                      placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                      borderColor={INPUT_BORDER_COLOR}
                      maxLength={6}
                      style={{padding:4, color:'gray'}}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      placeholderTextColor={'gray'}
                      keyboardType={"number-pad"}
                      placeholder="Digite o Código"
                    />
                  </View>
              </View>
            </View>

            <Button
              onPress={async () => {
                const credential = firebase.auth.PhoneAuthProvider.credential(
                  verificationId,
                  verificationCode
                );
                    await firebase.auth().signInWithCredential(credential).then(() => {
                        alertPro2.current.open();
                        navigation.navigate('Home')
                    }).catch((err) => {
                        console.log(err)
                    })
              }}
              disabled={false}
              borderRadius={10}
              color={Colors.onPrimaryColor}
              small
              title={'Confirmar'.toUpperCase()}
              titleColor={'#DAA520'}
            />

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
