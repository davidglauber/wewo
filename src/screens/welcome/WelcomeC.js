/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

// import components
import Button from '../../components/buttons/Button';
import LinkButton from '../../components/buttons/LinkButton';
import Logo from '../../components/logo/Logo';

// import colors
import Colors from '../../theme/colors';

// WelcomeC Config
const bgImg = require('../../assets/img/welcome_1.jpg');

// WelcomeC Styles
const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
  },
  opacity: {
    opacity: 0.32,
  },
  screenContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsGroup: {
    flex: 3,
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  vspace16: {
    height: 16,
  },
  vspace32: {
    height: 32,
  },
  linkButtonText: {
    color: Colors.accentColor,
  },
});

// WelcomeC Screen
export default class WelcomeC extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  render() {
    return (
      <ImageBackground
        source={bgImg}
        style={styles.bgImg}
        imageStyle={styles.opacity}>
        <SafeAreaView style={styles.screenContainer}>
          <StatusBar
            backgroundColor={Colors.statusBarColor}
            barStyle="dark-content"
          />

          <View style={styles.logoContainer}>
            <Logo size={112} tintColor={Colors.accentColor} />
          </View>

          <View style={styles.buttonsGroup}>
            <Button
              onPress={this.navigateTo('SignUp')}
              title={'I am new'.toUpperCase()}
              rounded
            />

            <View style={styles.vspace16} />

            <Button
              onPress={this.navigateTo('SignIn')}
              title={'I have been here'.toUpperCase()}
              outlined
              rounded
            />

            <View style={styles.vspace32} />

            <LinkButton
              onPress={this.navigateTo('HomeNavigator')}
              title="Skip"
              titleStyle={styles.linkButtonText}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
