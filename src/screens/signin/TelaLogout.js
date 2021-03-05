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
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import firebase from '../../config/firebase';

import LottieView from 'lottie-react-native';

import {Paragraph} from '../../components/text/CustomText';

import logoutAni from '../../../assets/logoutWEWO.json';

// import colors
import Colors from '../../theme/colors';


//consts
const windowHeight = Dimensions.get('window').height;

// ForgotPasswordA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: windowHeight/4,
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
              <LottieView source={logoutAni} style={{width:200, height:200}} autoPlay loop />
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
