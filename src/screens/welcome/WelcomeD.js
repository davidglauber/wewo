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
import Color from 'color';

// import components
import Button from '../../components/buttons/Button';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import LinkButton from '../../components/buttons/LinkButton';
import Logo from '../../components/logo/Logo';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// WelcomeA Config
const headerImg = require('../../assets/img/welcome_2.jpg');

// WelcomeA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  headerImg: {
    height: Layout.SCREEN_HEIGHT * 0.46,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color(Colors.black).alpha(0.4),
  },
  headerText: {
    fontWeight: '700',
    color: Colors.white,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    borderRadius: 52,
    width: 104,
    height: 104,
    backgroundColor: Colors.white,
  },
  center: {
    alignItems: 'center',
  },
  buttonsGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  customButton: {
    width: 148,
  },
  hspace16: {
    width: 16,
  },
  linkButtonText: {
    color: Colors.onSurface,
  },
});

export default class WelcomeD extends Component {
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
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />

        <ImageBackground source={headerImg} style={styles.headerImg}>
          <View style={styles.overlay}>
            <Heading5 style={styles.headerText}>Bon Appétit</Heading5>
          </View>
        </ImageBackground>

        <View style={styles.footer}>
          <View style={styles.logoContainer}>
            <Logo size={96} tintColor={Colors.secondaryColor} />
          </View>

          <View style={styles.center}>
            <Paragraph>Order food. Quick and easy.</Paragraph>
            <Paragraph>Take the first bite. Enjoy.</Paragraph>
          </View>

          <View style={styles.center}>
            <View style={styles.buttonsGroup}>
              <Button
                buttonStyle={styles.customButton}
                onPress={this.navigateTo('SignUp')}
                title={'Sign in'.toUpperCase()}
              />
              <View style={styles.hspace16} />
              <Button
                buttonStyle={styles.customButton}
                onPress={this.navigateTo('SignIn')}
                title={'Sing up'.toUpperCase()}
                outlined
              />
            </View>

            <LinkButton
              onPress={this.navigateTo('HomeNavigator')}
              title="Skip"
              titleStyle={styles.linkButtonText}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
