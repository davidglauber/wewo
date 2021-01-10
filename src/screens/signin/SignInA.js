/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import Button from '../../components/buttons/Button';
import InputModal from '../../components/modals/InputModal';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SignInA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

// SignInA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {flex: 1},
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  buttonContainer: {paddingTop: 23},
  forgotPassword: {paddingVertical: 23},
  forgotPasswordText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.secondaryText,
    textAlign: 'center',
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
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
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
    color: Colors.primaryText,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

// SignInA
export default class TelaLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      inputModalVisible: false,
    };
  }

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
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
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  showInputModal = value => () => {
    this.setState({
      inputModalVisible: value,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  signIn = () => {
    this.setState(
      {
        emailFocused: false,
        passwordFocused: false,
      },
      this.navigateTo('HomeNavigator'),
    );
  };

  render() {
    const {
      email,
      emailFocused,
      password,
      passwordFocused,
      secureTextEntry,
      inputModalVisible,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

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
                onSubmitEditing={this.focusOn(this.password)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="E-mail or phone number"
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
                onSubmitEditing={this.signIn}
                returnKeyType="done"
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              />

              <View style={styles.buttonContainer}>
                <Button
                  onPress={this.navigateTo('HomeNavigator')}
                  title={'Sign in'.toUpperCase()}
                />
              </View>

              <View style={styles.forgotPassword}>
                <Text
                  // onPress={this.showInputModal(true)}
                  onPress={this.navigateTo('ForgotPassword')}
                  style={styles.forgotPasswordText}>
                  Forgot password?
                </Text>
              </View>

              <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.buttonsGroup}>
                <Button
                  onPress={this.navigateTo('HomeNavigator')}
                  color="#3b5998"
                  socialIconName="facebook-square"
                  iconColor={Colors.white}
                  title={'Sign in with Facebook'.toUpperCase()}
                />
                <View style={styles.vSpacer} />
                <Button
                  onPress={this.navigateTo('HomeNavigator')}
                  color="#db4437"
                  socialIconName="google"
                  iconColor={Colors.white}
                  title={'Sign in with Google'.toUpperCase()}
                />
              </View>
            </View>

            <TouchableWithoutFeedback
              onPress={this.navigateTo('TermsConditions')}>
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By signing in, you accepts our
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

        <InputModal
          title="Forgot password?"
          message="Enter your e-mail address to reset password"
          inputDefaultValue={email}
          inputPlaceholder="E-mail address"
          inputKeyboardType="email-address"
          onRequestClose={this.showInputModal(false)}
          buttonTitle={'Reset password'.toUpperCase()}
          onClosePress={this.showInputModal(false)}
          visible={inputModalVisible}
        />
      </SafeAreaView>
    );
  }
}
