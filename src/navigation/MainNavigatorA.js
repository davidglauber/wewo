/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React ,{useState} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components';

// import components
import HeaderIconButton from '../components/navigation/HeaderIconButton';

// import Onboarding screen
import Onboarding from '../screens/onboarding/OnboardingA';

import CheckUserScreen from '../screens/onboarding/CheckUserScreen';



// import SignUp screen
import SignUp from '../screens/signup/Cadastro';

// import Settings screen
import Settings from '../screens/settings/Configuracoes';

// import Verification screen
import Verification from '../screens/verification/Verificação';
import SMSVerificacao from '../screens/verification/SMSVerificacao';
import TelaLoginSMS from '../screens/signin/TelaLoginSMS';

// import SignIn screen
import TelaLogin from '../screens/signin/TelaLogin';

// import ForgotPassword screen
import ForgotPassword from '../screens/forgotpassword/TelaEsqueciSenha';

//import Logout screen
import TelaLogout from '../screens/signin/TelaLogout';

// import TermsConditions screen
import TermsConditions from '../screens/terms/TermsConditionsA';

// import HomeNavigator
import HomeNavigator from './HomeNavigatorA';

//screen of filter
import HomeFiltro from '../screens/home/HomeFiltro';

import HomeCategory from '../screens/home/HomeCategory';

import HomeCategory2 from '../screens/home/HomeCategory2';

import CartaoFiltro from '../screens/cartaoVisita/CartaoFiltro';

import CartaoCategory from '../screens/cartaoVisita/CartaoCategory';

import CartaoCategory2 from '../screens/cartaoVisita/CartaoCategory2';

import TelaPrincipalAnuncio from '../screens/anuncios/TelaPrincipalAnuncio';

import EditarAnuncio from '../screens/anuncios/EditarAnuncio';

// import Product screen
import TelaAnuncio from '../screens/telasAnuncios/TelaAnuncio';

import TelaAnunciosPendentes from '../screens/anuncios/TelaAnunciosPendentes';

import TelaCartaoPendente from '../screens/cartaoVisita/TelaCartaoPendente';

import MostrarCartao from '../screens/cartaoVisita/MostrarCartao';

import EditarCartao from '../screens/cartaoVisita/EditarCartao';

import TelaGeralCriarCartao from '../screens/cartaoVisita/TelaGeralCriarCartao';

import TelaCriarCartaoVisita from '../screens/cartaoVisita/TelaCriarCartaoVisita';

// import Categories screen
import Categories from '../screens/categories/CategoriesA';
import Category from '../screens/categories/CategoryA';


// import Checkout screen
import Checkout from '../screens/checkout/CheckoutA';

// import EditProfile screen
import EditProfile from '../screens/profile/EditarPerfil';

// import DeliveryAddress screen
import DeliveryAddress from '../screens/address/DeliveryAddressA';

// import AddAddress screen
import AddAddress from '../screens/address/AddAddressA';

// import Search screen
import Search from '../screens/search/SearchB';

// import EditAddress screen
import EditAddress from '../screens/address/EditAddressA';

// import Payment screen
import PaymentMethod from '../screens/payment/PaymentMethodA';

// import AddCreditCard screen
import AddCreditCard from '../screens/payment/AddCreditCardA';

// import Notifications screen
import Notifications from '../screens/notifications/NotificationsA';

// import Orders screen
import Orders from '../screens/anuncios/CriarAnuncio';

// import AboutUs screen
import AboutUs from '../screens/about/AboutUsA';

// import colors
import Colors from '../theme/colors';

import Filtro from '../screens/search/Filtro';
import FilterCartao from '../screens/search/FilterCartao';

import themes from '../theme';


import ThemeProviderStyle from '../../ThemeContext';


// MainNavigatorA Config
const SAVE_ICON = Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark';

// create stack navigator
const Stack = createStackNavigator();




// MainNavigatorA
function MainNavigatorA() {
  const [dark, setDark] = useState(false)

  return (
<ThemeProvider theme={dark ? themes.dark: themes.light}>
  <ThemeProviderStyle dark={dark} setDark={setDark}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardOverlayEnabled: false,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: Colors.onBackground,
          headerTitleAlign: 'center',
        }}>


        <Stack.Screen
          name="CheckUserScreen"
          component={CheckUserScreen}
          options={{headerShown: false}}
          />




        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{headerShown: false}}
        />


            <Stack.Screen
              name="HomeNavigator"
              component={HomeNavigator}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={
                ({navigation}) => ({ 
                  headerTitleStyle: {
                    color:'#DAA520'
                  },
                  title: 'Criar Conta',
                  headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    backgroundColor: '#fff'
                  },
                  
                  headerLeft: () => (
                    <HeaderIconButton
                    onPress={() => navigation.goBack()}
                    name={'ios-arrow-back'}
                    color={'white'}
                    />
                    ),
                  })
                }
            />




<Stack.Screen
          name="SignIn"
          component={TelaLogin}
          options={({navigation}) => ({ 
            headerTitleStyle: {
              color:'#DAA520'
            },
            title: 'Entrar na Conta',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor: '#fff'
            },
            
            headerLeft: () => (
              <HeaderIconButton
              onPress={() => navigation.goBack()}
              name={'ios-arrow-back'}
              color={'white'}
              />
              ),
            })}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({navigation}) => ({ 
            headerTitleStyle: {
              color:'#fff'
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            title: 'Esqueci Minha Senha',
            
            headerLeft: () => (
              <HeaderIconButton
                onPress={() => navigation.goBack()}
                name={'ios-arrow-back'}
                color={'#fff'}
                />
                )
              })}
        />
        <Stack.Screen
          name="TermsConditions"
          component={TermsConditions}
          options={{
            title: 'Termos e Condições',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />

       


        <Stack.Screen
          name="HomeFiltro"
          component={HomeFiltro}
          options={{headerShown: false}}
        />

        
        <Stack.Screen
          name="CartaoCategory"
          component={CartaoCategory}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CartaoCategory2"
          component={CartaoCategory2}
          options={{headerShown: false}}
        />


        <Stack.Screen
          name="HomeCategory"
          component={HomeCategory}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="HomeCategory2"
          component={HomeCategory2}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CartaoFiltro"
          component={CartaoFiltro}
          options={{headerShown: false}}
        />



        <Stack.Screen
          name="TelaLogout"
          component={TelaLogout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TelaPrincipalAnuncio"
          component={TelaPrincipalAnuncio}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditarAnuncio"
          component={EditarAnuncio}
          options={{
            title: 'Editar Anúncio',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />

        <Stack.Screen
          name="TelaAnunciosPendentes"
          component={TelaAnunciosPendentes}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TelaCartaoPendente"
          component={TelaCartaoPendente}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MostrarCartao"
          component={MostrarCartao}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SMSVerificacao"
          component={SMSVerificacao}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="EditarCartao"
          component={EditarCartao}
          options={{
            title: 'Editar Cartão',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />

        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: 'All Categories',
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            title: 'Pizza',
          }}
        />
        <Stack.Screen
          name="TelaAnuncio"
          component={TelaAnuncio}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TelaLoginSMS"
          component={TelaLoginSMS}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TelaGeralCriarCartao"
          component={TelaGeralCriarCartao}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Filtro"
          component={Filtro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FilterCartao"
          component={FilterCartao}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: 'Checkout',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={({navigation}) => ({
            title: 'Editar Perfil',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          })}
        />

        <Stack.Screen
          name="DeliveryAddress"
          component={DeliveryAddress}
          options={({navigation}) => ({
            title: 'Delivery Address',
            headerRight: () => (
              <HeaderIconButton
              onPress={() => navigation.goBack()}
              name={SAVE_ICON}
              color={Colors.primaryColor}
              />
              ),
            })}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{
            title: 'Add New Address',
          }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={{
            title: 'Edit Address',
          }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={{
            title: 'Tela de Planos',
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: { color: 'black' }
          }}
        />
        <Stack.Screen
          name="AddCreditCard"
          component={AddCreditCard}
          options={{
            title: 'Add Credit Card',
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{
            title: 'Criar Anúncio',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />

        <Stack.Screen
          name="TelaCriarCartaoVisita"
          component={TelaCriarCartaoVisita}
          options={{
            title: 'Criar Cartão de Visita',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />

        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            title: 'Sobre Nós',
            headerStyle: { backgroundColor: dark ? '#121212' : 'white' },
            headerTitleStyle: { color: dark ? '#FFD700' : 'black' },
          }}
        />


          <Stack.Screen
            name="Verification"
            component={Verification}
            options={{headerShown: false}}
          />


        

      
      </Stack.Navigator>


    </NavigationContainer>
  </ThemeProviderStyle>
</ThemeProvider>
  );
}

export default MainNavigatorA;
