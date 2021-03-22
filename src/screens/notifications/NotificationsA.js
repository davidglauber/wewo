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
  }
})

// NotificationsA
export default class NotificationsA extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      modalizeRef: React.createRef(null),
      notifications: [
        {
          notificationId: 5,
          type: "delivered",
          title: "YooHoo! Your order is delivered",
          text: "We hope you like it! Please send us your feedback and rate.",
          meta: "just now",
          readOut: false
        },
        {
          notificationId: 0,
          type: "failed_delivery",
          title: "Oops. Failed attempt delivery",
          text: "You were not available at the time of the first delivery attempt. A second attempt will be made. Please contact us at +1-234-567-8910.",
          meta: "3 min ago",
          readOut: false
        },
        {
          notificationId: 1,
          type: "ready_for_delivery",
          title: "Your order is out for delivery",
          text: "We are at your doorstep. Open it to us.",
          meta: "5 min ago",
          readOut: false
        },
        {
          notificationId: 2,
          type: "on_the_way",
          title: "Your order is on the way",
          text: "Good news! Your order is arriving today. Expected to be delivered by 6:30 pm.",
          meta: "21 min ago",
          readOut: false
        },
        {
          notificationId: 3,
          type: "exception",
          title: "Delivery exception",
          text: "Your order encounters a delivery exception. Please contact us at +1-234-567-8910.",
          meta: "1 day ago",
          readOut: true
        },
        {
          notificationId: 4,
          type: "delivered",
          title: "YooHoo! Your order is delivered",
          text: "We hope you like it! Please send us your feedback and rate.",
          meta: "5 days ago",
          readOut: true
        }
      ]
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

  swipeoutOnPressRemove = item => () => {
    let { notifications } = this.state;
    const index = notifications.indexOf(item);

    notifications = remove(notifications, n => notifications.indexOf(n) !== index);

    this.setState({
      notifications
    });
  };


  openModalize() {
    const modalizeRef = this.state.modalizeRef;
    modalizeRef.current?.open()
  }

  keyExtractor = item => item.notificationId.toString();

  renderItem = ({ item, index }) => (
    <NotificationItem
      activeOpacity={0.85}
      type={item.type}
      title={item.title}
      text={item.text}
      meta={item.meta}
      // onPress={this.navigateTo("")}
      readOut={item.readOut}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
    />
  );

  render() {
    const { notifications } = this.state;

    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? 'light-content' : 'dark-content'}
        />

        <View>
          <Heading style={styles.paddingTitle}>Notificações</Heading>
          <View style={{width: windowWidth/1.06, height:100, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
            <Title style={{marginLeft:10}}>Rodrigo Lombardi</Title>
              <TouchableOpacity onPress={() => this.openModalize()} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
                <IconResponsiveNOBACK name="at" size={24}/>
              </TouchableOpacity>
          </View>

          <View style={{width: windowWidth/1.06, height:100, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
            <Title style={{marginLeft:10}}>Rodrigo</Title>
              <TouchableOpacity onPress={() => this.openModalize()} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
                <IconResponsiveNOBACK name="at" size={24}/>
              </TouchableOpacity>
          </View>

          <View style={{width: windowWidth/1.06, height:100, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
            <Title style={{marginLeft:10}}>Rodrigo Lombardi</Title>
              <TouchableOpacity onPress={() => this.openModalize()} style={{width:30, height:30, borderRadius: 20, position:'absolute', right: windowWidth/11, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
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
          <View style={{width: windowWidth/1.06, height:100, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10, alignItems:'center'}}>
            <Image source={{uri: 'https://veja.abril.com.br/wp-content/uploads/2021/01/GettyImages-1229893385.jpg.jpg'}} style={{height:54, width:54, marginLeft:20, borderRadius:20}}/>
              <Title style={{marginLeft: windowWidth/6, fontSize: 15}}>Rodrigo Lombardi</Title>
          </View>

          <View style={{width: windowWidth/1.06, height:500, backgroundColor:'#d98b0d', flexDirection:'row', borderRadius:10, marginTop:20, marginLeft:10, marginRight:10}}>
            <View style={{marginTop:20}}>
              <Title style={{marginLeft: 30, fontSize: 27}}>CEP: 57046-503</Title>
              <Title style={{marginLeft: 30, fontSize: 20, marginTop:10}}>SERVIÇO: Caminhão de Mudança</Title>
            </View>
          </View>
        </Modalize>
      </SafeBackground>
    );
  }
}
