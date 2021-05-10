/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  I18nManager,
  Platform,
  Text,
  BackHandler,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  View,
} from 'react-native';

// import components
import Avatar from '../../components/avatar/Avatar';
import Divider from '../../components/divider/Divider';
import Icon from '../../components/icon/Icon';
import {Heading6, Subtitle1, Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

//import switch
import Switch from 'expo-dark-mode-switch';

// import colors
import Colors from '../../theme/colors';

//import firebase
import firebase from '../../config/firebase';

import AlertPro from "react-native-alert-pro";

import LottieView from 'lottie-react-native';

import loading from '../../../assets/loading.json';

// SettingsB Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';

import { useRoute, useNavigation } from "@react-navigation/native";

const NOTIFICATION_OFF_ICON = IOS
  ? 'ios-notifications-off'
  : 'md-notifications-off';
const NOTIFICATION_ICON = IOS ? 'ios-notifications' : 'md-notifications';

const ADDRESS_ICON = IOS ? 'ios-pin' : 'md-pin';
const PAYMENT_ICON = IOS ? 'ios-card' : 'md-card';
const DOLLAR_ICON = IOS ? 'logo-usd' : 'logo-usd';
const ORDERS_ICON = IOS ? 'ios-list' : 'md-list';
const VISIT_CARD = IOS ? 'ios-albums' : 'ios-albums';
const CARRINHO = IOS ? 'md-cart': 'md-cart';
const PRODUCTS_SOLD = IOS ? 'ios-cube' : 'ios-cube';

const ABOUT_ICON = IOS ? 'ios-finger-print' : 'md-finger-print';
const CHAT_ICON = IOS ? 'chatbox-ellipses-outline' : 'chatbox-ellipses-outline';
const UPDATE_ICON = IOS ? 'ios-cloud-download' : 'md-cloud-download';
const TERMS_ICON = IOS ? 'book' : 'book';

const ADD_ICON = IOS ? 'ios-add-circle-outline' : 'md-add-circle-outline';
const LOGOUT_ICON = IOS ? 'ios-exit' : 'md-exit';




//import icons
import { FontAwesome5 } from '@expo/vector-icons';

//CSS responsivo
import { SafeBackground, SetTextUserSetting, IconResponsiveNOBACK, SectionHeaderTextSetting, NameUserSetting, EmailUserSetting, HeadingSetting } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// SettingsB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileContainer: {
    // height: 88
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileInfo: {
    paddingLeft: 16,
  },
  name: {
    fontWeight: '500',
    textAlign: 'left',
  },
  email: {
    paddingVertical: 2,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingHorizontal: 16,
    textAlign: 'left',
  },
  sectionHeaderText: {
    textAlign: 'left',
  },
  setting: {
    height: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

// SectionHeader Props
type SectionHeadreProps = {
  title: string,
};

// Setting Props
type SettingProps = {
  icon: string,
  setting: string,
  type: string,
  onPress: () => {},
};

// SettingsB Components
const SectionHeader = ({title}: SectionHeadreProps) => (
  <View style={styles.sectionHeader}>
    <SectionHeaderTextSetting style={styles.sectionHeaderText}>{title}</SectionHeaderTextSetting>
  </View>
);

const Setting = ({onPress, icon, setting, type}: SettingProps) => (
  <TouchableItem onPress={onPress}>
    <View style={[styles.row, styles.setting]}>
      <View style={styles.leftSide}>
        {icon !== undefined && (
          <View style={styles.iconContainer}>
            <Icon
              name={icon}
              size={20}
              
            />
          </View>
        )}
        <SetTextUserSetting>
          {setting}
        </SetTextUserSetting>
      </View>

    </View>
  </TouchableItem>
);

// SetingsB
export default function Configuracoes() {
  const navigation = useNavigation();
  const [notificationsOn, setNotificationsOn] = React.useState(true)
  const [status, setStatus] = React.useState(null);
  const [emailUser, setEmailUser] = React.useState('');
  const [nomeUser, setNomeUser] = React.useState('');
  const [tipoDeConta, setTipoDeConta] = React.useState('');
  const [dataNascimento, setDataNascimento] = React.useState('');
  const [fotoPerfil, setFotoPerfil] = React.useState('');
  const [value, setValue] = React.useState(false);
  const {dark, setDark} = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = React.useState(true);
  const alertPro = React.useRef();
  const alertPro2 = React.useRef();


  useEffect(() => {
    async function callFirebase() {
      console.log('tema: ' + dark)
      await firebase.auth().onAuthStateChanged(user => {
        if(user.uid !== null || user.uid !== undefined || user.uid !== '') {
          firebase.firestore().collection('usuarios').doc(user.uid).onSnapshot(documentSnapshot => {
            console.log('User data: ', documentSnapshot.data());
            setStatus(true)
            setEmailUser(documentSnapshot.data().email)
            setNomeUser(documentSnapshot.data().nome)
            setDataNascimento(documentSnapshot.data().dataNascimento)
            setFotoPerfil(documentSnapshot.data().photoProfile)
            setTipoDeConta(documentSnapshot.data().tipoDeConta)

            setModalVisible(false)
          })
        } 
        
        if(user.uid == null || user.uid == undefined || user.uid == ''){
          return null
        }
      })

    }

    callFirebase();
  },[])



  function navFunc() {
    alertPro.current.close();
    navigation.navigate('Home')
  }

 
  useEffect(() => {
    const backAction = () => {
        if (navigation.isFocused()) {
              alertPro.current.open();
              return true;
        }
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
}, [dark])


  function sair () {
    alertPro2.current.close();
    navigation.navigate('TelaLogout')
  }

  function logout () {
    alertPro2.current.open();
  };


    return (
      <SafeBackground>

          <AlertPro
            ref={alertPro}
            onCancel={() => alertPro.current.close()}
            onConfirm={() => navFunc()}
            title="Atenção"
            message="Você quer mesmo voltar para a tela principal?"
            textCancel="Não"
            textConfirm="Sim"
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
            onCancel={() => alertPro2.current.close()}
            onConfirm={() => sair()}
            title="Logout"
            message="Tem certeza que quer sair?"
            textCancel="Não"
            textConfirm="Sim"
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


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
          <View style={{flex:1, alignItems:'center', paddingLeft: windowWidth / 2, paddingTop: windowHeight / 2, width: 100}}>
              <LottieView source={loading} style={{width:100, height:100}} autoPlay loop />
          </View>
        </Modal>

        <StatusBar
          backgroundColor={dark ? '#3E3C3F' : '#E98D0A'}
          barStyle={dark ? 'light-content' : 'dark-content'}
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.titleContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <IconResponsiveNOBACK style={{marginRight: 24}} name="arrow-left" size={20}/>
                </TouchableOpacity>
            <HeadingSetting>Configurações</HeadingSetting>
          </View>

          <TouchableItem useForeground onPress={() => navigation.navigate('EditProfile')}>
            <View style={[styles.row, styles.profileContainer]}>
              <View style={styles.leftSide}>
                {fotoPerfil == '' ?
                    <Image style={{borderRadius:50, width:60, height:60}} source={require('../../assets/img/profile_1.jpeg')}
                    />
                  :
                    <Image
                      source={{uri: fotoPerfil}}
                      style={{borderRadius:50, width:60, height:60}}
                    />
                }
                <View style={styles.profileInfo}>
                    <NameUserSetting>{nomeUser}</NameUserSetting>

                    <EmailUserSetting style={styles.email}>
                      {emailUser}
                    </EmailUserSetting>

                    <EmailUserSetting style={styles.email}>
                      {dataNascimento}
                    </EmailUserSetting>

                </View>
              </View>
            </View>
          </TouchableItem>


          <SectionHeader title="Planos & Pagamentos" />
          <Setting
            onPress={() => navigation.navigate('PaymentMethod')}
            icon={PAYMENT_ICON}
            setting="Escolha o Seu Plano"
          />

          <Setting
            onPress={() => navigation.navigate('MLConfigAccount')}
            icon={DOLLAR_ICON}
            setting="Configure sua conta de recebimento"
          />

          <SectionHeader title="Anúncios / Portifólios / Produtos" />
          <Setting
            onPress={() => navigation.navigate('TelaPrincipalAnuncio')}
            icon={ORDERS_ICON}
            setting="Meus Anúncios"
          />

          {tipoDeConta == 'Autonomo' &&
            <Setting
              onPress={() => navigation.navigate('TelaGeralCriarCartao')}
              icon={VISIT_CARD}
              setting="Meus Portfólios"
            />
          }
            
          {tipoDeConta == 'Estabelecimento' &&
            <Setting
              onPress={() => navigation.navigate('TelaGeralCriarCartao')}
              icon={VISIT_CARD}
              setting="Meus Produtos"
            />
          }
            
          <Setting
            onPress={() => navigation.navigate('Checkout')}
            icon={CARRINHO}
            setting="Meu Carrinho"
          />

          {tipoDeConta == 'Estabelecimento' &&
            <Setting
              onPress={() => navigation.navigate('SoldProducts')}
              icon={PRODUCTS_SOLD}
              setting="Produtos Vendidos"
            />
          }

          <SectionHeader title="Sobre" />
          <Setting
            onPress={() => navigation.navigate('AboutUs')}
            icon={ABOUT_ICON}
            setting="Quem Nós Somos"
          />



        {/* <Setting icon={UPDATE_ICON} setting="App Updates" /> */}

          <Setting
            onPress={() => navigation.navigate('TermsConditions')}
            icon={TERMS_ICON}
            setting="Termos & Condições"
          />

          <SectionHeader title="Sair" />
          {/* <Setting icon={ADD_ICON} setting="Add Account" /> */}
          <Setting
            onPress={() => logout()}
            icon={LOGOUT_ICON}
            setting="Sair"
            type="logout"
          />

          <Switch style={{marginLeft: 18, marginTop:75}} value={dark} onChange={(value) => setDark(value)}/>
        </ScrollView>
      </SafeBackground>
    );
  }
