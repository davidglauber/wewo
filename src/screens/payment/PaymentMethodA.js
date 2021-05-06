/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component, useEffect, useState} from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  View,
  Linking,
  Text,
  TouchableOpacity
} from 'react-native';

// import components
import Button from '../../components/buttons/Button';


// import colors
import Colors from '../../theme/colors';


//import IAP API 
import {purchased, fetchAvailableProducts,purchaseUpdateSubscription,requestPurchase} from '../../config/purchase';

import { useRoute, useNavigation } from "@react-navigation/native";

//import firebase
import firebase from '../../config/firebase';

import LottieView from 'lottie-react-native';

import AlertPro from "react-native-alert-pro";

import { Subtitle2Publish, ChooseOption } from '../home/styles';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// PaymentMethodA Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const MORE_ICON = IOS ? 'ios-more' : 'md-more';
const EDIT_ICON = IOS ? 'ios-create' : 'md-create';
const SAVE_ICON = IOS ? 'ios-save' : 'md-save';
const REMOVE_ICON = IOS ? 'ios-remove-circle' : 'md-remove-circle';
const BOTTOM_SHEET_PB = IOS ? 16 : 0;

const diamond = require('../../../assets/diamond.json');

// PaymentMethodA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  swiperContainer: {
    height: 240, // cardContainer.height + dot.height
  },
  dot: {
    backgroundColor: Colors.black,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#DAA520",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationStyle: {
    bottom: 0,
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },
  cardContainer: {
    width: '100%',
    height: 232,
  },
  editButtonContainer: {
    position: 'absolute',
    top: 32,
    right: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  bottomSheetItem: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    height: 64,
  },
  bottomSheetCaption: {paddingVertical: 2},
  bottomSheetAction: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height: 56,
  },
  bottomSheetIconContainer: {
    marginRight: IOS ? 24 : 32,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// PaymentMethodA
export default function PaymentMethodA() {
  const route = useRoute();
  const navigation = useNavigation();
  const [plan, setPlan] = useState('mensal');
  const [verifySub, setVerifySub] = useState(false);
  const [tipoDeConta, setTipoDeConta] = useState("");
  const alertPro = React.useRef();
  const alertPro2 = React.useRef();
  
  const itemSubs = Platform.select({
    android: [
      'wewo.gold.mensal',
      'wewo_gold_anual',
      'wewo_gold_anual_auto',
      'wewo_gold_auto'
    ]
  })


  function goBack() {
    navigation.goBack();
  };

  function navigateTo (screen) {
    navigation.navigate(screen);
  };

 

  useEffect(() => {
    fetchAvailableProducts(itemSubs);
  }, [])


  useEffect(() => {
    purchaseUpdateSubscription(itemSubs);
  }, [])

  useEffect(() => {
    async function user() {
      let usuarioAtual = firebase.auth().currentUser.uid;
  
      //pegar a foto do usuario
      await firebase.firestore().collection('usuarios').doc(usuarioAtual).onSnapshot(documentSnapshot => {
        setTipoDeConta(documentSnapshot.data().tipoDeConta)
      })
    }

    user();
  }, [])


  useEffect(() => {
    async function isBought() {
      let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual', 'wewo_gold_auto', 'wewo_gold_anual_auto')
  
      if(comprou == true) {
        setVerifySub(true)
        alertPro.current.open()
      } else {
        setVerifySub(false)
        alertPro2.current.open()
      }
    }
    isBought();
  }, [])

  function signPremium(idProp) {
    requestPurchase(idProp)
  }





    return (
      <View style={{flex:1, padding:15, backgroundColor:'#fff'}}>
      
      
      <AlertPro
        ref={alertPro}
        showCancel={false}
        onConfirm={() => alertPro.current.close()}
        title="Que legal!"
        message="Você já possui um plano"
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
        title="Que pena!"
        message="Você não possui um plano"
        textConfirm="Vou assinar"
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


        {plan == 'mensal' && tipoDeConta == 'Autonomo' &&
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <LottieView source={diamond} style={{width:200, height:200}} autoPlay loop />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Mensal: R$ 14,90</Text>
          </View>
        }

        {plan == 'mensal' && tipoDeConta == 'Estabelecimento' &&
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <LottieView source={diamond} style={{width:200, height:200}} autoPlay loop />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Mensal: R$ 19,90</Text>
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Autonomo' &&
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <LottieView source={diamond} style={{width:200, height:200}} autoPlay loop />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Mensal: R$ 170,00</Text>
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Estabelecimento' &&
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <LottieView source={diamond} style={{width:200, height:200}} autoPlay loop />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Mensal: R$ 220,00</Text>
          </View>
        }

        <View style={{flexDirection:'row', marginHorizontal: windowWidth/4, justifyContent:'space-between'}}>
          {plan == 'mensal' ?
            <View style={{flexDirection:'row'}}>
                <ChooseOption/>
                <TouchableOpacity>
                    <Subtitle2Publish
                      style={{fontWeight: 'bold'}}>Mensal</Subtitle2Publish>
                </TouchableOpacity>
            </View>
          :
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={() => setPlan('mensal')} style={{backgroundColor:'#E3E3E3', width:18, height:18, borderRadius:30}}/>
                  <TouchableOpacity onPress={() => setPlan( 'mensal')}>
                      <Subtitle2Publish>Mensal</Subtitle2Publish>
                  </TouchableOpacity>
            </View>                         
          }

          {plan == 'anual' ?
            <View style={{flexDirection:'row'}}>
                <ChooseOption/>
                <TouchableOpacity>
                    <Subtitle2Publish
                      style={{fontWeight: 'bold'}}>Anual</Subtitle2Publish>
                </TouchableOpacity>
            </View>
          :
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={() => setPlan('anual')} style={{backgroundColor:'#E3E3E3', width:18, height:18, borderRadius:30}}/>
                  <TouchableOpacity onPress={() => setPlan('anual')}>
                      <Subtitle2Publish>Anual</Subtitle2Publish>
                  </TouchableOpacity>
            </View>                         
          }
        </View>

        <ScrollView>
          {tipoDeConta == 'Autonomo' && 
            <View style={{backgroundColor:'#e3e3e3', borderRadius:40, padding:10, marginTop: windowHeight/12}}>
              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>15 Anúncios e Portfólios Ilimitados</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>Maior Visibilidade</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>Sem Anúncios no App WeWo</Text>
              </View>
            </View>
          }

          {tipoDeConta == 'Estabelecimento' &&
            <View style={{backgroundColor:'#e3e3e3', borderRadius:40, padding:10, marginTop: windowHeight/12}}>
              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>15 Anúncios e Produtos Ilimitados</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>Maior Visibilidade</Text>
              </View>

              <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
                <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
                <Text style={{marginLeft:10}}>Sem Anúncios no App WeWo</Text>
              </View>
            </View>
          }
        </ScrollView>


        {plan == 'mensal' && tipoDeConta == 'Estabelecimento' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button 
              onPress={() => signPremium('wewo.gold.mensal')}
              title="Assinar Premium"
            />
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Estabelecimento' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => signPremium('wewo_gold_anual')}
              title="Assinar Premium"
            />
          </View>
        }

        {plan == 'mensal' && tipoDeConta == 'Autonomo' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => signPremium('wewo_gold_auto')}
              title="Assinar Premium"
            />
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Autonomo' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => signPremium('wewo_gold_anual_auto')}
              title="Assinar Premium"
            />
          </View>
        }





        {plan == 'mensal' && tipoDeConta == 'Estabelecimento' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo.gold.mensal')}
              title="Cancelar Plano Mensal"
            />
          </View>
        }

        {plan == 'mensal' && tipoDeConta == 'Autonomo' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo_gold_auto')}
              title="Cancelar Plano Mensal"
            />
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Estabelecimento' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo_gold_anual')}
              title="Cancelar Plano Anual"
            />
          </View>
        }

        {plan == 'anual' && tipoDeConta == 'Autonomo' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo_gold_anual_auto')}
              title="Cancelar Plano Anual"
            />
          </View>
        }

      </View>
    );
}
