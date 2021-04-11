/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from "react";
import {
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";

//CSS responsivo
import { SafeBackground, TextDays, InputFormMask, TextDescription2, ChooseOption, Heading, Title} from '../home/styles';


import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';


import { ThemeContext } from '../../../ThemeContext';

import { WebView } from 'react-native-webview'

//QRCODE
import QRCode from 'react-native-qrcode-svg';

//BIBLIOTECA PIX
import { staticPix } from "pix-charge";


//consts
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  paddingTitle: {
    padding: 30,
  },
  moneyCard: {
    position:'absolute',
    right:windowWidth/8
  },
  title: {
    marginLeft: 20, 
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
export default class PixPayment extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      cpf: '',
      typePix:'',
      tel:'',
      cnpj:'',
      email:''
    };
  }
  
  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  navigateTo = screen => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };


  onChangeCPF(text) {
    this.setState({cpf: text})
    console.log('CPF'  + this.state.cpf)
  }

  onChangeCNPJ(text) {
    this.setState({cnpj: text})
    console.log('CNPJ'  + this.state.cnpj)
  }

  onChangeTEL(text) {
    this.setState({tel: text})
    console.log('TELEFONE'  + this.state.tel)
  }

  emailChange = text => {
    this.setState({
      email: text,
    });

    console.log('email: ' + this.state.email)
  };

  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />
          <View style={{alignItems:'center'}}>
            <Heading style={styles.paddingTitle}>Gere seu Pix</Heading>
            <TextDescription2 style={{paddingHorizontal:40, textAlign:'center'}}>Coloque aqui nessa tela a sua chave pix cadastrada no seu banco e gere o qrcode para receber pelo serviço prestado</TextDescription2>
                {this.state.typePix == '' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({typePix:'cpf'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>CPF</TextDays>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({typePix:'cnpj'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>CNPJ</TextDays>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({typePix:'telefone'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>TELEFONE</TextDays>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.setState({typePix:'email'})} style={{backgroundColor:'#E3E3E3', width:22, height:22, borderRadius:30, marginLeft:15, marginTop:20}}/>
                      <TextDays>EMAIL</TextDays>
                    </View>
                  </View>
                }
                
                {this.state.typePix == 'cpf' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <ChooseOption onPress={() => this.setState({typePix: ''})} style={{marginTop:20}}/>
                      <TextDays>CPF</TextDays>
                    </View>

                    <InputFormMask
                      type={'cpf'}
                      value={this.state.cpf}
                      onChangeText={text => this.onChangeCPF(text)}
                      keyboardType={"number-pad"}
                      placeholder="Seu CPF                                                          "
                    />
                  </View>
                }

                {this.state.typePix == 'cnpj' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <ChooseOption onPress={() => this.setState({typePix: ''})} style={{marginTop:20}}/>
                      <TextDays>CNPJ</TextDays>
                    </View>

                    <InputFormMask
                      type={'cnpj'}
                      value={this.state.cnpj}
                      onChangeText={text => this.onChangeCNPJ(text)}
                      keyboardType={"number-pad"}
                      placeholder="Seu CNPJ                                                          "
                    />
                  </View>
                }

                {this.state.typePix == 'telefone' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <ChooseOption onPress={() => this.setState({typePix: ''})} style={{marginTop:20}}/>
                      <TextDays>TELEFONE</TextDays>
                    </View>

                    <InputFormMask
                      type={'cel-phone'}
                      value={this.state.tel}
                      onChangeText={text => this.onChangeTEL(text)}
                      keyboardType={"number-pad"}
                      placeholder="Seu Telefone                                                          "
                    />
                  </View>
                }

                {this.state.typePix == 'email' &&
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <ChooseOption onPress={() => this.setState({typePix: ''})} style={{marginTop:20}}/>
                      <TextDays>CPF</TextDays>
                    </View>

                    <UnderlineTextInput
                      onRef={r => {
                        this.email = r;
                      }}
                      onChangeText={this.emailChange}
                      placeholder="Seu E-mail"
                      keyboardType={"email-address"}
                    />
                  </View>
                }

          </View>
      </SafeBackground>
    );
  }
}
