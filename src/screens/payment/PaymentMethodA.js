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
  
  const itemSubs = Platform.select({
    android: [
      'wewo.gold.mensal',
      'wewo_gold_anual'
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
    async function isBought() {
      let comprou = await purchased('wewo.gold.mensal', 'wewo_gold_anual')
  
      if(comprou == true) {
        setVerifySub(true)
        alert('Você já possui um plano')
      } else {
        setVerifySub(false)
        alert('Você não possui um plano')
      }
    }
    isBought();
  }, [])

  function signPremium(idProp) {
    requestPurchase(idProp)
  }





    return (
      <View style={{flex:1, padding:15, backgroundColor:'#fff'}}>
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
          <View style={{flexDirection:'row', marginTop:20}}>
              <ChooseOption/>
              <TouchableOpacity>
                  <Subtitle2Publish
                    style={{fontWeight: 'bold'}}>Anual</Subtitle2Publish>
              </TouchableOpacity>
          </View>
        :
          <View style={{flexDirection:'row', marginTop:20}}>
              <TouchableOpacity onPress={() => setPlan('anual')} style={{backgroundColor:'#E3E3E3', width:18, height:18, borderRadius:30}}/>
                <TouchableOpacity onPress={() => setPlan('anual')}>
                    <Subtitle2Publish>Anual</Subtitle2Publish>
                </TouchableOpacity>
          </View>                         
        }


        {plan == 'mensal' ?
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <Image style={{width:200, height:200}} source={require("../../assets/img/star.gif")} />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Mensal: R$ 14,99</Text>
          </View>
        :
          <View style={{alignItems:'center', marginBottom: windowHeight/8}}>
            <Image style={{width:200, height:200}} source={require("../../assets/img/star.gif")} />
            <Text style={{fontSize:20, fontWeight:'bold'}}>Anual: R$ 160,00</Text>
          </View>
        }


        <ScrollView>
          <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
            <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
            <Text style={{marginLeft:10}}>5 Anúncios e 5 Cartões Simultâneos</Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
            <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
            <Text style={{marginLeft:10}}>Maior Visibilidade</Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', padding:12}}>
            <Image style={{width:30, height:30}} source={require('../../assets/img/correct.png')}/>
            <Text style={{marginLeft:10}}>Sem Anúncios no App WeWo</Text>
          </View>
        </ScrollView>


        {plan == 'mensal' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button 
              onPress={() => signPremium('wewo.gold.mensal')}
              title="Assinar Premium"
            />
          </View>
        }

        {plan == 'anual' && verifySub == false &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => signPremium('wewo_gold_anual')}
              title="Assinar Premium"
            />
          </View>
        }

        {plan == 'mensal' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo.gold.mensal')}
              title="Cancelar Plano Mensal"
            />
          </View>
        }

        {plan == 'anual' && verifySub == true &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.zubito.wewo&sku=wewo_gold_anual')}
              title="Cancelar Plano Anual"
            />
          </View>
        }

      </View>
    );
}
