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
import remove from "lodash/remove";

//CSS responsivo
import { SafeBackground, IconResponsive, AnuncioContainer, IconResponsiveNOBACK, Heading, Title} from '../home/styles';

// import components
import { Modalize } from 'react-native-modalize';

// import colors
import Colors from "../../theme/colors";

import { ThemeContext } from '../../../ThemeContext';

// NotificationsA Config
const EMPTY_STATE_ICON = "bell-ring-outline";


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
export default class NotificationsA extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      modalizeRef: React.createRef(null)
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


  openModalize() {
    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }

  confirmButton() {
    alert('Serviço confirmado! Lembre-se de comparecer no local e ativar o modo pagamento no final do serviço!')
  }

  deniedButton() {
    alert('Serviço cancelado! O usuário contratante será informado sobre o cancelamento')
  }

  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        <View>
          <Heading style={styles.paddingTitle}>Notificações</Heading>
          <View style={{width: windowWidth/1.06, height:100, backgroundColor: this.context.dark ? '#3F3F3F' : '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
            <Text  style={styles.titleMain}>Rodrigo Lombardi</Text>
              <TouchableOpacity onPress={() => this.openModalize()} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: this.context.dark ? '#3F3F3F': 'white', justifyContent:'center', alignItems:'center'}}>
                <IconResponsiveNOBACK name="at" size={24}/>
              </TouchableOpacity>
          </View>

        </View>

        {/*Modalize dos comentários*/}
        <Modalize
            ref={this.state.modalizeRef}
            snapPoint={500}
            modalStyle={this.context.dark ? {backgroundColor:'#3E3C3F'} : {backgroundColor:'#fff'}}
          >
          <View style={{width: windowWidth/1.06, height:100, backgroundColor: '#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Text  style={styles.title}>Rodrigo Lombardi</Text>
          </View>

          <View style={{width: windowWidth/1.06, height:500, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10}}>
            <View style={{marginTop:20}}>
              <Title style={{marginLeft: 30, fontSize: 27, color: this.context.dark ? 'white' : 'white'}}>CEP: 57046-503</Title>
              
              <View style={{marginLeft: 30, marginTop:30, flexDirection:'row'}}>
                <IconResponsive name="tools" size={24}/>
                <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>Caminhão de Mudança</Title>
              </View>

              <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                <IconResponsive name="dollar-sign" size={24}/>
                <Title style={{marginLeft: 27, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>R$ 340</Title>
              </View>

              <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                <IconResponsive name="mobile" size={24}/>
                <Title style={{marginLeft: 24, fontSize: 15, color: this.context.dark ? 'white' : 'white'}}>(82) 99432-4542</Title>
              </View>
              

              <View style={{marginLeft: 30, marginTop:10, flexDirection:'row'}}>
                <IconResponsive name="calendar-week" size={24}/>
                <Title style={{marginLeft: 20, fontSize: 15, marginTop:5, color: this.context.dark ? 'white' : 'white'}}>26/07/2021</Title>
              </View>


              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={() => this.confirmButton()} style={{marginLeft: 30, marginTop:60, flexDirection:'row', padding:10, backgroundColor: 'white', marginRight:20, borderRadius:50}}>
                  <IconResponsiveNOBACK name="check" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:2, color:'black'}}>Confirmar</Title>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.deniedButton()} style={{marginLeft: 30, marginTop:60, flexDirection:'row', padding:10, backgroundColor: 'white', marginRight:120, borderRadius:50}}>
                  <IconResponsiveNOBACK name="times" size={24}/>
                  <Title style={{marginLeft: 20, fontSize: 15, marginTop:2, color:'black'}}>Negar</Title>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modalize>
      </SafeBackground>
    );
  }
}
