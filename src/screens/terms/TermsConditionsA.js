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
  ScrollView,
  Linking,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// import components
import Button from '../../components/buttons/Button';
import {Caption} from '../../components/text/CustomText';


//CSS responsivo
import { SafeBackground, CaptionTerms, TextBlock, HeadTerm, ContainerButton, Title, ValueField, TouchableDetails, TextDetails, SignUpBottom, TextBold, TextBoldGolden } from '../home/styles';

import { ThemeContext } from '../../../ThemeContext';

// import colors
import Colors from '../../theme/colors';

import normalize from '../../config/resizeFont';

// TermsConditionsA Config
const APP_NAME = 'App Name';

// TermsConditionsA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  caption: {
    paddingBottom: 12,
    textAlign: 'left',
  },
  heading: {
    paddingBottom: 16,
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primaryColor,
    letterSpacing: 0.2,
    textAlign: 'left',
    // writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' // iOS
  },
  textBlock: {
    paddingBottom: 24,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.primaryText,
    letterSpacing: 0.4,
    textAlign: 'left',
  },
  button: {
    width: Dimensions.get('window').width/3,
    marginRight:70
  },
});

// TermsConditionsA
export default class TermsConditionsA extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    return (
      <SafeBackground>
        <StatusBar
          backgroundColor={this.context.dark ? '#121212' : 'white'}
          barStyle={this.context.dark ? "light-content" : "dark-content"}
        />
        <ScrollView>
          <View style={styles.content}>
            <CaptionTerms>
              Última atualização: 01 de Dezembro, 2020
            </CaptionTerms>
            <TextBlock style={{fontSize: normalize(14)}}>{`Por favor leia os termos e condições cautelosamente, antes de começar a usar o aplicativo móvel WeWo`}</TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>0. Introdução</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`WeWo construiu o aplicativo WeWo como um aplicativo Freemium. Este SERVIÇO é fornecido pela WeWo sem nenhum custo e deve ser usado como está.

Esta página é usada para informar os visitantes sobre nossas políticas de coleta, uso e divulgação de Informações Pessoais, caso alguém decida usar nosso Serviço.

Se você optar por usar nosso Serviço, você concorda com a coleta e uso de informações em relação a esta política. As informações pessoais que coletamos são usadas para fornecer e melhorar o serviço. Não usaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.

Os termos usados ​​nesta Política de Privacidade têm os mesmos significados que em nossos Termos e Condições, que podem ser acessados ​​no WeWo, a menos que definido de outra forma nesta Política de Privacidade.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>1. Coleta e Uso de Informações</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Para uma melhor experiência, ao usar nosso Serviço, podemos exigir que você nos forneça certas informações de identificação pessoal, incluindo, mas não se limitando ao Desenvolvedor WeWo. As informações que solicitamos serão retidas por nós e usadas conforme descrito nesta política de privacidade.

O aplicativo usa serviços de terceiros que podem coletar informações usadas para identificá-lo.

Link para a política de privacidade de provedores de serviços terceirizados usados ​​pelo aplicativo

Serviços do Google Play
AdMob
Google Analytics para Firebase
Firebase Crashlytics
Facebook
Expo`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>2. Dados de Registro</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Queremos informar que sempre que você utiliza o nosso Serviço, em caso de erro no aplicativo, coletamos dados e informações (por meio de produtos de terceiros) no seu telefone chamados Log Data. 
              
Esses dados de registro podem incluir informações como endereço de protocolo de Internet ("IP") do dispositivo, nome do dispositivo, versão do sistema operacional, configuração do aplicativo ao utilizar nosso serviço, hora e data de uso do serviço e outras estatísticas.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>3. Cookies</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Cookies são arquivos com uma pequena quantidade de dados que são comumente usados ​​como identificadores exclusivos anônimos. Eles são enviados para o seu navegador a partir dos sites que você visita e são armazenados na memória interna do seu dispositivo.

Este Serviço não usa esses “cookies” explicitamente. No entanto, o aplicativo pode usar código de terceiros e bibliotecas que usam “cookies” para coletar informações e melhorar seus serviços. Você tem a opção de aceitar ou recusar esses cookies e saber quando um cookie está sendo enviado para o seu dispositivo. Se você optar por recusar nossos cookies, pode não ser capaz de usar algumas partes deste Serviço.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>4. Provedores de serviço</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Podemos empregar empresas terceirizadas e indivíduos pelos seguintes motivos:

1 - Para facilitar nosso serviço
2 - Para fornecer o Serviço em nosso nome
3 - Para executar serviços relacionados com o serviço
4 - Para nos ajudar a analisar como nosso Serviço é usado

Queremos informar aos usuários deste serviço que esses terceiros têm acesso às suas informações pessoais. O motivo é realizar as tarefas atribuídas a eles em nosso nome. No entanto, eles são obrigados a não divulgar ou usar as informações para qualquer outra finalidade.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>5. Segurança</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Valorizamos sua confiança em nos fornecer suas informações pessoais, portanto, estamos nos empenhando para usar meios comercialmente aceitáveis ​​de protegê-las. Mas lembre-se que nenhum método de transmissão pela internet, ou método de armazenamento eletrônico é 100% seguro e confiável, e não podemos garantir sua segurança absoluta.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>6. Links para Outros Sites</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Este serviço pode conter links para outros sites. 
              
Se você clicar em um link de terceiros, você será direcionado a esse site. 
              
Observe que esses sites externos não são operados por nós. Portanto, recomendamos fortemente que você reveja a Política de Privacidade desses sites. 
              
Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>7. Privacidade Infantil</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Estes Serviços não se dirigem a ninguém com idade inferior a 13 anos. 
              
Não recolhemos intencionalmente informações de identificação pessoal de crianças com menos de 13 anos. No caso de descobrirmos que uma criança com menos de 13 anos nos forneceu informações pessoais, as eliminamos imediatamente dos nossos servidores. Se você é um pai ou responsável e está ciente de que seu filho nos forneceu informações pessoais, entre em contato para que possamos tomar as medidas necessárias.`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>8. Mudanças nesta Política de Privacidade</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Podemos atualizar nossa Política de Privacidade de tempos em tempos. Portanto, recomendamos que você revise esta página periodicamente para verificar quaisquer alterações. Iremos notificá-lo de quaisquer alterações, publicando a nova Política de Privacidade nesta página.

Esta política entra em vigor a partir de 01/12/2020`}
            </TextBlock>

            <HeadTerm style={{fontSize: normalize(16)}}>9. Contate-Nos</HeadTerm>
            <TextBlock style={{fontSize: normalize(14)}}>
              {`Se você tiver dúvidas ou sugestões sobre nossa Política de Privacidade, não hesite em nos contatar em wewobrasil@gmail.com.`}
            </TextBlock>
          </View>
        </ScrollView>
      </SafeBackground>
    );
  }
}
