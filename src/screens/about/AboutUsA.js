/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  View,
  I18nManager,
  ImageBackground,
  Linking,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import { ThemeContext } from '../../../ThemeContext';

import {FontAwesome as FAIcon} from '@expo/vector-icons';

// import components
import {
  Caption,
  Heading5,
  Subtitle1,
  Subtitle2,
} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

//CSS responsivo
import { SafeBackground, HeadingAbout, SubtitleAbout, FooterText, Footer, SocialButtonAbout } from '../home/styles';

import normalize from '../../config/resizeFont';

// AboutUsA Config
const isRTL = I18nManager.isRTL;
const FACEBOOK_ICON = 'facebook';
const INSTAGRAM_ICON = 'instagram';
const YELP_ICON = 'yelp';
const OVERLAY_COLOR = 'rgba(185, 0, 57, 0.4)';
const AVATAR_SIZE = 54;

// AboutUsA Styles
const styles = StyleSheet.create({
  pb6: {paddingBottom: 6},
  pl8: {paddingLeft: 8},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap:'wrap'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 16,
  },
  center: {
    alignItems: 'center',
    paddingHorizontal:40,
    width: '100%',
  },
  swiperContainer: {
    width: '100%',
    height: 252,
  },
  paginationStyle: {
    bottom: 14,
    transform: [{scaleX: isRTL ? -1 : 1}],
  },
  dot: {backgroundColor: Colors.white},
  activeDot: {backgroundColor: Colors.white},
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
  },
  swiperContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: AVATAR_SIZE + 2,
    height: AVATAR_SIZE + 2,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    backgroundColor: Colors.white,
  },
  info: {
    fontWeight: '500',
  },
  infoText: {
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4,
    textAlign: 'left',
  },
  caption: {
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4,
    textAlign: 'left',
  },
  description: {
    maxWidth: '80%',
  },
  phone: {
    marginTop: 8,
    color: Colors.primaryColor,
  },
  social: {
    flexDirection: 'row',
    marginTop: 8,
    fontWeight: '500',
    marginBottom: 20,
  },
  socialButton: {
    margin: 8,
    borderRadius: 22,
    backgroundColor: Colors.primaryColor,
  },
  socialIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  footer: {
    width: '100%',
    backgroundColor: Colors.background,
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  footerButtonText: {
    fontWeight: '500',
    color: Colors.primaryColor,
  },
});

// AboutUsA
export default class AboutUsA extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  callPhone = () => {
    Linking.openURL(`tel:${82988232301}`);
  };

  openInstagram = () => {
    Linking.openURL('https://www.instagram.com/wewobrasil/')
  }

  openLinkedIn = () => {
    Linking.openURL('https://www.linkedin.com/in/david-glauber-1b1961191/')
  }

  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />

        <View style={styles.content}>
           {/* <Swiper
              loop={false}
              index={isRTL ? 2 : 0} // number of slides - 1
              paginationStyle={styles.paginationStyle}
              activeDotStyle={styles.activeDot}
              dotStyle={styles.dot}>
              <ImageBackground
                source={require('../../assets/img/about_1.jpg')}
                style={styles.bgImg}>
                <GradientContainer
                  colors={
                    isRTL
                      ? ['transparent', OVERLAY_COLOR]
                      : [OVERLAY_COLOR, 'transparent']
                  }
                  start={isRTL ? {x: 0, y: 0} : {x: 0.1, y: 0}}
                  end={isRTL ? {x: 0.4, y: 0} : {x: 1, y: 0}}
                  containerStyle={styles.swiperContent}>
                  <View style={styles.row}>
                    <View style={styles.avatarWrapper}>
                      <Avatar
                        imageUri={require('../../assets/img/profile_2.jpeg')}
                        size={AVATAR_SIZE}
                        rounded
                      />
                    </View>

                    <View style={styles.pl8}>
                      <Subtitle1 style={[styles.info, styles.infoText]}>
                        Natalie Garcia
                      </Subtitle1>
                      <Caption style={styles.caption}>Main Chef</Caption>
                    </View>
                  </View>

                  <View style={styles.description}>
                    <Subtitle1 style={styles.infoText}>
                      Exquisite and fashionable cuisine from the famous cooks.
                      Try our dishes and you will never want something else.
                    </Subtitle1>
                  </View>
                </GradientContainer>
              </ImageBackground>

              <ImageBackground
                source={require('../../assets/img/about_2.jpg')}
                style={styles.bgImg}>
                <GradientContainer
                  colors={
                    isRTL
                      ? ['transparent', OVERLAY_COLOR]
                      : [OVERLAY_COLOR, 'transparent']
                  }
                  start={isRTL ? {x: 0, y: 0} : {x: 0.1, y: 0}}
                  end={isRTL ? {x: 0.4, y: 0} : {x: 1, y: 0}}
                  containerStyle={styles.swiperContent}>
                  <View style={styles.description}>
                    <Subtitle1 style={styles.infoText}>
                      Our street-style food is bold, imaginative, and
                      deliciously messy. We use locally sourced ingedients, and
                      offer vegan-friendly dishes.
                    </Subtitle1>
                  </View>
                </GradientContainer>
              </ImageBackground>

              <ImageBackground
                source={require('../../assets/img/about_3.jpg')}
                style={styles.bgImg}>
                <GradientContainer
                  colors={
                    isRTL
                      ? ['transparent', OVERLAY_COLOR]
                      : [OVERLAY_COLOR, 'transparent']
                  }
                  start={isRTL ? {x: 0, y: 0} : {x: 0.1, y: 0}}
                  end={isRTL ? {x: 0.4, y: 0} : {x: 1, y: 0}}
                  containerStyle={styles.swiperContent}>
                  <View style={styles.row}>
                    <View>
                      <Caption style={[styles.caption, styles.pb6]}>
                        ADDRESS
                      </Caption>
                      <Subtitle1 style={[styles.info, styles.infoText]}>
                        384 K Las Vegas Blvd,
                      </Subtitle1>
                      <Subtitle1 style={[styles.info, styles.infoText]}>
                        Las Vegas, MS 85701
                      </Subtitle1>
                    </View>
                  </View>
                  <View style={styles.description}>
                    <Subtitle1 style={styles.infoText}>
                      We are not just a team, we are family. Visit us.
                    </Subtitle1>
                  </View>
                </GradientContainer>
              </ImageBackground>
            </Swiper>*/}

          <ScrollView contentContainerStyle={styles.center}>
            <HeadingAbout style={{fontSize: normalize(15)}}>
              Bem-vindo(a) a WeWo!
            </HeadingAbout>
            <SubtitleAbout style={{fontSize: normalize(12), textAlign: 'justify', marginBottom:40}}>{"\n\n"}Estamos muito felizes em ter você conosco.
              Somos uma nova proposta para o mercado trabalhista brasileiro. 
              Viemos com o objetivo de facilitar as relações entre as pessoas, fazendo com que estas possam comprar e vender seus serviços e produtos
              de uma maneira muito simples. 

              {"\n\n"}Viemos para acrescentar no e-commerce brasileiro, e nosso principal e único objetivo é mudar a vida das pessoas para melhor!


              Seja você um trabalhador de qualquer profissão, através da WeWo você pode anunciar o seu serviço para que milhares de brasileiros
              possam contratá-lo de forma muito simples e intuitiva, em poucos minutos podendo conseguir vários clientes! 


              Lojas e estabelecimentos também fazem parte da nossa família. {"\n\n"}Pela WeWo, qualquer vendedor pode montar o seu próprio
              catálogo online, de forma gratuita. Com um simples cadastro no aplicativo, a sua loja terá a oportunidade de ter uma visibilidade
              muito maior. Desta forma, o aplicativo é uma ferramenta não somente de compra e venda de serviços e produtos, mas também um meio
              de você promover o seu próprio negócio! 


              Todas as transações são feitas pelo próprio aplicativo, usando a plataforma do MercadoPago. {"\n\n"}O cliente poderá pagar usando diversos meios de pagamento, como cartão de crédito e débito, boleto e PIX. Todas as transações são feitas de forma totalmente segura, de maneira que o anunciante só receberá o dinheiro quando o serviço ou venda forem confirmados por ambas as partes. Caso venham a acontecer tentativas fraudulentas, os usuários que assim procederem terão as suas contas banidas de uma maneira definitiva do aplicativo.


              {"\n\n"}A WeWo dispõe ainda de um plano pago para os usuários que queiram aumentar ainda mais o alcance de seus anúncios e de suas vendas. Tanto profissionais autônomos quanto estabelecimentos terão uma usabilidade ilimitada no aplicativo.


              Venha fazer parte da nossa família, juntamente a muitos milhares de brasileiros! {"\n\n"}A WeWo inicialmente está disponível em todos os estados do Brasil e, sem dúvida alguma, nós viemos parar unir pessoas e criar soluções!</SubtitleAbout>


              <View style={{justifyContent: 'flex-start',alignItems: 'center', alignContent:'center', width: '100%'}}>
                <TouchableOpacity onPress={() => this.openLinkedIn()}>
                  <SubtitleAbout style={{marginLeft: 0}}>...</SubtitleAbout>
                </TouchableOpacity>
              </View>

              <View style={{marginTop:50, alignItems:"center"}}>
                <Subtitle2 style={{fontSize: normalize(10)}}>SIGA-NOS</Subtitle2>
                <View style={styles.social}>
                  
                  <SocialButtonAbout>
                    <TouchableItem onPress={() => alert('Indisponível no momento')} rippleColor={Colors.white} borderless>
                      <View style={styles.socialIconContainer}>
                        <FAIcon
                          name={FACEBOOK_ICON}
                          size={20}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableItem>
                  </SocialButtonAbout>

                  <SocialButtonAbout>
                    <TouchableItem onPress={() => this.openInstagram()} rippleColor={Colors.white} borderless>
                      <View style={styles.socialIconContainer}>
                        <FAIcon
                          name={INSTAGRAM_ICON}
                          size={22}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableItem>
                  </SocialButtonAbout>

                </View>
              </View>
          </ScrollView>
        </View>
        <Footer>
          <TouchableItem>
            <View style={styles.footerButton}>
              <FooterText>www.wewo.com</FooterText>
            </View>
          </TouchableItem>
        </Footer>
      </SafeBackground>

    );
  }
}
