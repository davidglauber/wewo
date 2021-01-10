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
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import ContainedButton from '../../components/buttons/ContainedButton';
import HeaderHeight from '../../components/navigation/HeaderHeight';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SignUpC Config
const bgImg = require('../../assets/img/signup_1.jpg');

const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.6)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

// SignUpC Styles
const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    minHeight: Layout.SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  screenContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: INPUT_BORDER_COLOR,
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.white,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

// SignUpC
export default class SignUpC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      phone: '',
      phoneFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
    };
  }

  // react navigation header
  static navigationOptions = {
    // FIX ME: react navigation just hide header
    // instead of setting backgroundColor: "transparent"
    headerTransparent: true,
    headerTintColor: '#fff',
  };

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      phoneFocused: false,
      passwordFocused: false,
    });
  };

  phoneChange = text => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      phoneFocused: true,
      emailFocused: false,
      passwordFocused: false,
    });
  };

  passwordChange = text => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  createAccount = () => {
    // const { email, phone, password } = this.state;
    this.setState(
      {
        emailFocused: false,
        phoneFocused: false,
        passwordFocused: false,
      },
      this.navigateTo('Verification'),
    );
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      emailFocused,
      phoneFocused,
      password,
      passwordFocused,
      secureTextEntry,
    } = this.state;

    return (
      <ImageBackground source={bgImg} style={styles.bgImg}>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <View style={styles.overlay} />

        <SafeAreaView style={styles.screenContainer}>
          <HeaderHeight />
          <KeyboardAwareScrollView
            contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.content}>
              <View />

              <View style={styles.form}>
                <UnderlineTextInput
                  onRef={r => {
                    this.email = r;
                  }}
                  onChangeText={this.emailChange}
                  onFocus={this.emailFocus}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.focusOn(this.phone)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="email-address"
                  placeholder="E-mail"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={r => {
                    this.phone = r;
                  }}
                  onChangeText={this.phoneChange}
                  onFocus={this.phoneFocus}
                  inputFocused={phoneFocused}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlinePasswordInput
                  onRef={r => {
                    this.password = r;
                  }}
                  onChangeText={this.passwordChange}
                  onFocus={this.passwordFocus}
                  inputFocused={passwordFocused}
                  onSubmitEditing={this.createAccount}
                  returnKeyType="go"
                  placeholder="Password"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  secureTextEntry={secureTextEntry}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  toggleVisible={password.length > 0}
                  toggleText={secureTextEntry ? 'Show' : 'Hide'}
                  onTogglePress={this.onTogglePress}
                  inputContainerStyle={styles.inputContainer}
                />

                <View style={styles.buttonContainer}>
                  <ContainedButton
                    onPress={this.createAccount}
                    color={Colors.primaryColor}
                    title={'Register now'.toUpperCase()}
                    rounded
                  />
                </View>

                <View style={styles.separator}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.line} />
                </View>

                <View style={styles.buttonsGroup}>
                  <ContainedButton
                    onPress={this.createAccount}
                    color={Colors.surface}
                    socialIconName="facebook-square"
                    iconColor="#3b5998"
                    title={'Sign up with Facebook'.toUpperCase()}
                    titleColor="#3b5998"
                    rounded
                  />
                  <View style={styles.vSpacer} />
                  <ContainedButton
                    onPress={this.createAccount}
                    color={Colors.surface}
                    socialIconName="google"
                    iconColor="#db4437"
                    title={'Sign up with Google'.toUpperCase()}
                    titleColor="#db4437"
                    rounded
                  />
                </View>
              </View>

              <TouchableWithoutFeedback
                onPress={this.navigateTo('TermsConditions')}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    By registering, you accepts our
                  </Text>
                  <View style={styles.termsContainer}>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Terms & Conditions
                    </Text>
                    <Text style={styles.footerText}> and </Text>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Privacy Policy
                    </Text>
                    <Text style={styles.footerText}>.</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
