/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Color from 'color';

import firebase from '../../config/firebase';

import {Paragraph} from '../../components/text/CustomText';


// import colors
import Colors from '../../theme/colors';


// ForgotPasswordA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 22,
  },
});

// ForgotPasswordA
export default class TelaLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estadoLogoutState:'verdade'
    }
  }

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };


  componentDidMount(){
    console.reportErrorsAsExceptions = false;
    let e = this;

    e.timeout = setTimeout(async () => {
        await firebase.auth().signOut()
        e.props.navigation.navigate('HomeNavigator')
    }, 2000);
  };


  navigateTo = screen => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };


  render() {

    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.instructionContainer}>
            <View>
              <Image source={require('../../assets/img/loading.gif')} style={{width:200, height:400}}/>
            </View>
            <Paragraph style={styles.instruction}>
             Volte em Breve!  Saindo...
            </Paragraph>
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }
}
