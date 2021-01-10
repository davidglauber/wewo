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
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

// import components
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

// OnboardingB Config
const isRTL = I18nManager.isRTL;
const BUTTON_HEIGHT = 58; // pagination button height
const BUTTON_WIDTH = 92; // pagination button width

const slide1Img = require('../../assets/img/onboarding_1.png');
const slide2Img = require('../../assets/img/onboarding_2.png');
const slide3Img = require('../../assets/img/onboarding_3.png');
const slide4Img = require('../../assets/img/onboarding_4.png');

const slides = [
  {
    id: 'slide1',
    img: slide1Img,
    title: 'Find your flavour',
    description:
      'Easy and fast way to order food from the best local restaurant.',
  },
  {
    id: 'slide2',
    img: slide2Img,
    title: 'Choose your meal',
    description: 'Browse through menu and reviews to find the food you like.',
  },
  {
    id: 'slide3',
    img: slide3Img,
    title: 'Easy payment',
    description: 'Pay online with credit card. Click, sit back and relax.',
  },
  {
    id: 'slide4',
    img: slide4Img,
    title: 'Delivered fast',
    description: 'Get food to your door in minutes. We deliver, you enjoy!',
  },
];

// OnboardingB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  slideImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 208,
    height: 208,
    borderRadius: 104,
    backgroundColor: '#fff',
  },
  slideImg: {
    width: 160,
    height: 104,
    resizeMode: 'cover',
  },
  title: {
    paddingTop: 24,
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
  descriptionContainer: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.onPrimaryColor,
    textAlign: 'center',
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.32)',
    height: BUTTON_HEIGHT,
    backgroundColor: Colors.secondaryGradientColor,
  },
  buttonContainer: {
    width: BUTTON_WIDTH,
  },
  leftButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    paddingLeft: 10,
    paddingRight: 12,
  },
  rightButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    paddingLeft: 12,
    paddingRight: 10,
  },
  actionButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.onPrimaryColor,
  },
  dot: {
    margin: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: Colors.onPrimaryColor,
  },
  inactiveDot: {
    backgroundColor: Colors.black,
    opacity: 0.28,
  },
});

// OnboardingB
export default class OnboardingB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  onIndexChanged = (index) => {
    let activeIndex;
    if (isRTL) {
      activeIndex = slides.length - 1 - index;
    } else {
      activeIndex = index;
    }
    this.setState({
      activeIndex: activeIndex,
    });
  };

  previousSlide = () => {
    this.swiper.scrollBy(-1, true);
  };

  nextSlide = () => {
    this.swiper.scrollBy(1, true);
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  render() {
    const {activeIndex} = this.state;
    return (
      <GradientContainer>
        <SafeAreaView style={styles.screenContainer}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <View style={styles.swiperContainer}>
            <Swiper
              ref={(swiper) => {
                this.swiper = swiper;
              }}
              index={isRTL ? slides.length - 1 : 0}
              onIndexChanged={this.onIndexChanged}
              loop={false}
              showsPagination={false}>
              {slides.map((item) => (
                <View key={item.id} style={styles.slide}>
                  <View style={styles.slideImgContainer}>
                    <Image source={item.img} style={styles.slideImg} />
                  </View>
                  <Heading5 style={styles.title}>{item.title}</Heading5>
                  <View style={styles.descriptionContainer}>
                    <Paragraph style={styles.descriptionText}>
                      {item.description}
                    </Paragraph>
                  </View>
                </View>
              ))}
            </Swiper>
          </View>

          <View style={styles.paginationContainer}>
            <View style={styles.buttonContainer}>
              {activeIndex > 0 ? (
                <TouchableItem
                  onPress={isRTL ? this.nextSlide : this.previousSlide}>
                  <View style={[styles.row, styles.leftButton]}>
                    <Icon
                      name={isRTL ? 'chevron-right' : 'chevron-left'}
                      size={24}
                      color={Colors.onPrimaryColor}
                    />
                    <Text style={styles.buttonText}>
                      {'back'.toUpperCase()}
                    </Text>
                  </View>
                </TouchableItem>
              ) : (
                <TouchableItem onPress={this.navigateTo('Welcome')}>
                  <View style={styles.actionButton}>
                    <Text style={styles.buttonText}>
                      {'skip'.toUpperCase()}
                    </Text>
                  </View>
                </TouchableItem>
              )}
            </View>

            <View style={styles.row}>
              {slides.map((item, i) => (
                <View
                  key={`dot_${item.id}`}
                  style={[
                    styles.dot,
                    activeIndex === i ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {activeIndex < slides.length - 1 ? (
                <TouchableItem
                  onPress={isRTL ? this.previousSlide : this.nextSlide}>
                  <View style={[styles.row, styles.rightButton]}>
                    <Text style={styles.buttonText}>
                      {'next'.toUpperCase()}
                    </Text>
                    <Icon
                      name={isRTL ? 'chevron-left' : 'chevron-right'}
                      size={24}
                      color={Colors.onPrimaryColor}
                    />
                  </View>
                </TouchableItem>
              ) : (
                <TouchableItem onPress={this.navigateTo('Welcome')}>
                  <View style={styles.actionButton}>
                    <Text style={styles.buttonText}>
                      {'done'.toUpperCase()}
                    </Text>
                  </View>
                </TouchableItem>
              )}
            </View>
          </View>
        </SafeAreaView>
      </GradientContainer>
    );
  }
}
