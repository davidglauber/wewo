/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  I18nManager,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';

// import components
import Button from '../../components/buttons/Button';
import CreditCard from '../../components/creditcard/CreditCard';
import InfoModal from '../../components/modals/InfoModal';
import LinkButton from '../../components/buttons/LinkButton';
import {Caption, Subtitle1, Subtitle2} from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// CheckoutA Config
const isRTL = I18nManager.isRTL;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;
const CHECKMARK_ICON =
  Platform.OS === 'ios'
    ? 'ios-checkmark-circle-outline'
    : 'md-checkmark-circle-outline';

// CheckoutA Styles
const styles = StyleSheet.create({
  pt16: {paddingTop: 16},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    elevation: 1,
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#a7a7aa',
      },
    }),
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  stepContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepText: {
    color: Colors.primaryColor,
  },
  activeLine: {
    backgroundColor: Colors.primaryColor,
  },
  swiperContainer: {
    flex: 1,
    ...Platform.select({
      android: {
        minHeight: Layout.SCREEN_HEIGHT - 3 * 56,
      },
    }),
  },
  formContainer: {
    flex: 1,
  },
  form: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  overline: {
    color: "#fff",
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 18,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionButton: {
    color: Colors.accentColor,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  linkButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  linkButton: {
    color: Colors.black,
  },
  orderInfo: {
    paddingVertical: 8,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
  },
});

// CheckoutA
export default class CheckoutA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      address: '455 Larkspur Dr.',
      city: 'Baviera',
      zip: '92908',
      addressFocused: false,
      cityFocused: false,
      zipFocused: false,
      infoModalVisible: false,
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  clearInputs = () => {
    this.address.clear();
    this.city.clear();
    this.zip.clear();
  };

  addressChange = (text) => {
    this.setState({
      address: text,
    });
  };

  addressFocus = () => {
    this.setState({
      addressFocused: true,
      cityFocused: false,
      zipFocused: false,
    });
  };

  cityChange = (text) => {
    this.setState({
      city: text,
    });
  };

  cityFocus = () => {
    this.setState({
      addressFocused: false,
      cityFocused: true,
      zipFocused: false,
    });
  };

  zipChange = (text) => {
    this.setState({
      zip: text,
    });
  };

  zipFocus = () => {
    this.setState({
      addressFocused: false,
      cityFocused: false,
      zipFocused: true,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  onIndexChanged = (index) => {
    let activeIndex;
    if (isRTL) {
      activeIndex = 2 - index; // 2 = 3 steps - 1
    } else {
      activeIndex = index;
    }
    this.setState({
      activeIndex: activeIndex,
    });
  };

  nextStep = () => {
    this.swiper.scrollBy(1, true);
  };

  previousStep = () => {
    this.swiper.scrollBy(-1, true);
  };

  showInfoModal = (value) => () => {
    this.setState({
      infoModalVisible: value,
    });
  };

  closeInfoModal = (value) => () => {
    this.setState(
      {
        infoModalVisible: value,
      },
      () => {
        this.goBack();
      },
    );
  };

  render() {
    const {
      activeIndex,
      address,
      addressFocused,
      city,
      cityFocused,
      zip,
      zipFocused,
      infoModalVisible,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepContainer}>
                <Caption
                  style={[
                    
                    activeIndex === 0 && styles.activeStepText,
                  ]}>
                  Delivery
                </Caption>
                <Caption
                  style={[
                    activeIndex === 0 && styles.activeStepText,
                  ]}>
                  address
                </Caption>
              </View>

              <View
                style={[styles.line, activeIndex > 0 && styles.activeLine]}
              />

              <View style={styles.stepContainer}>
                <Caption
                  style={[
                    activeIndex === 1 && styles.activeStepText,
                  ]}>
                  Payment
                </Caption>
                <Caption
                  style={[
                    activeIndex === 1 && styles.activeStepText,
                  ]}>
                  method
                </Caption>
              </View>

              <View
                style={[styles.line, activeIndex > 1 && styles.activeLine]}
              />

              <View style={styles.stepContainer}>
                <Caption
                  style={[
                    activeIndex === 2 && styles.activeStepText,
                  ]}>
                  Place
                </Caption>
                <Caption
                  style={[
                    activeIndex === 2 && styles.activeStepText,
                  ]}>
                  order
                </Caption>
              </View>
            </View>
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={styles.swiperContainer}>
            <Swiper
              ref={(r) => {
                this.swiper = r;
              }}
              index={isRTL ? 2 : 0}
              onIndexChanged={this.onIndexChanged}
              loop={false}
              showsPagination={false}
              // scrollEnabled={false}
            >
              {/* STEP 1 */}
              <View style={styles.formContainer}>
                <View style={styles.form}>
                  <Subtitle2 style={styles.overline}>Address</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.address = r;
                    }}
                    value={address}
                    onChangeText={this.addressChange}
                    onFocus={this.addressFocus}
                    inputFocused={addressFocused}
                    onSubmitEditing={this.focusOn(this.city)}
                    returnKeyType="next"
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <Subtitle2 style={styles.overline}>City</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.city = r;
                    }}
                    value={city}
                    onChangeText={this.cityChange}
                    onFocus={this.cityFocus}
                    inputFocused={cityFocused}
                    onSubmitEditing={this.focusOn(this.zip)}
                    returnKeyType="next"
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <Subtitle2 style={styles.overline}>ZIP Code</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.zip = r;
                    }}
                    value={zip}
                    onChangeText={this.zipChange}
                    onFocus={this.zipFocus}
                    inputFocused={zipFocused}
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <View>
                    <LinkButton
                      onPress={this.clearInputs}
                      title="Clear"
                      titleStyle={styles.actionButton}
                    />
                  </View>
                </View>
              </View>

              {/* STEP 2 */}
              <View>
                <CreditCard
                  colors={['#784BA0', '#2B86C5']}
                  brand="visa"
                  last4Digits="3456"
                  cardHolder="Kristin Evans"
                  expiry="09 / 21"
                />

                <View>
                  <LinkButton
                    onPress={this.navigateTo('PaymentMethod')}
                    title="Edit details"
                    titleStyle={styles.actionButton}
                  />
                </View>
              </View>

              <View style={styles.form}>
                <Subtitle2 style={styles.overline}>Delivery Address</Subtitle2>
                <Subtitle1
                  style={
                    styles.orderInfo
                  }>{`${address}, ${city}, ${zip}`}</Subtitle1>

                <Subtitle2 style={[styles.overline, styles.pt16]}>
                  Payment Method
                </Subtitle2>
                <Subtitle1 style={styles.orderInfo}>
                  XXXX XXXX XXXX 3456
                </Subtitle1>

                <Subtitle2 style={[styles.overline, styles.pt16]}>
                  Your Order
                </Subtitle2>
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Total amount</Subtitle1>
                  <Subtitle1 style={styles.amount}>$ 75.40</Subtitle1>
                </View>
              </View>
            </Swiper>

            <View style={styles.buttonContainer}>
              {activeIndex < 2 && (
                <Button
                  onPress={isRTL ? this.previousStep : this.nextStep}
                  title="Next"
                />
              )}

              {activeIndex === 2 && (
                <Button
                  onPress={this.showInfoModal(true)}
                  title="Place Order"
                />
              )}

              {activeIndex === 0 && (
                <View style={styles.linkButtonContainer}>
                  <LinkButton
                    onPress={this.goBack}
                    title="Cancel"
                    titleStyle={styles.linkButton}
                  />
                </View>
              )}

              {activeIndex > 0 && (
                <View style={styles.linkButtonContainer}>
                  <LinkButton
                    onPress={isRTL ? this.nextStep : this.previousStep}
                    title="Back"
                    titleStyle={styles.linkButton}
                  />
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>

          <InfoModal
            iconName={CHECKMARK_ICON}
            iconColor={Colors.primaryColor}
            title={'Success!'.toUpperCase()}
            message="Order placed successfully. For more details check your orders."
            buttonTitle="Back to shopping"
            onButtonPress={this.closeInfoModal(false)}
            onRequestClose={this.closeInfoModal(false)}
            visible={infoModalVisible}
          />
        </View>
      </SafeAreaView>
    );
  }
}
