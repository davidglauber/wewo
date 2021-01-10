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
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Color from 'color';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import {Paragraph} from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

import firebase from '../../config/firebase';

// import colors
import Colors from '../../theme/colors';

// ForgotPasswordA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';
const BUTTON_BORDER_RADIUS = 4;

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
export default class TelaEsqueciSenha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      modalVisible: false,
    };
  }

  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  keyboardDidShow = () => {
    this.setState({
      emailFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      emailFocused: false,
    });
  };

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  navigateTo = screen => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  async resetPassword(email) {
    let e = this;
    Keyboard.dismiss();
    await firebase.auth().sendPasswordResetEmail(email).then(function (user) {
      e.setState(
        {
          modalVisible: true,
          emailFocused: false,
        },
        () => {
          // for demo purpose after 3s close modal
          e.timeout = setTimeout(() => {
            e.closeModal();
            e.navigateTo('SignIn')
          }, 3000);
        },
      );
      console.log('senha enviada')
    }).catch(function (error) {
      if(error.code === 'auth/invalid-email') {
        alert('O email fornecido é inválido')
      }
      if(error.code === 'auth/user-not-found') {
        alert('O Usuário não foi encontrado')
      }
    })
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {emailFocused, modalVisible} = this.state;

    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.instructionContainer}>
            <View>
              <Icon name="lock-outline" size={36} color={Colors.primaryColor} />
            </View>
            <Paragraph style={styles.instruction}>
              Puxa, que pena que esqueceu a sua senha, não tem problema! Redefina-a agora colocando o seu email
            </Paragraph>
          </View>

          <View style={styles.inputContainer}>
            <UnderlineTextInput
              onChangeText={this.emailChange}
              inputFocused={emailFocused}
              onSubmitEditing={this.resetPassword}
              returnKeyType="done"
              blurOnSubmit={false}
              keyboardType="email-address"
              placeholder="Endereço de Email"
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputStyle={styles.inputStyle}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => this.resetPassword(this.state.email)}
              disabled={false}
              borderRadius={BUTTON_BORDER_RADIUS}
              small
              title={'Redefinir Senha'.toUpperCase()}
            />
          </View>

          <ActivityIndicatorModal
            message="Espere um Momento"
            onRequestClose={this.closeModal}
            title="Enviando email, verifique-o"
            visible={modalVisible}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
