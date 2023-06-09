import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import RNExitApp from 'react-native-exit-app';
import {useFocusEffect} from '@react-navigation/native';

const Welcome = ({navigation}) => {
  const [showButton, setShowButton] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {text: 'Cancel'},
          {text: 'Yes', onPress: () => RNExitApp.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/welcome.png')}>
      <View style={styles.background} />
      <View style={styles.welcome}>
        {showButton ? (
          <TouchableOpacity
            style={styles.logInButton}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text style={styles.logInText}>Staff Log In</Text>
          </TouchableOpacity>
        ) : null}
        <View>
          <TouchableOpacity onLongPress={() => setShowButton(true)}>
            <Text style={styles.welcomeTitle}>
              Let your favourite food find you
            </Text>
            <Text style={styles.welcomeDescription}>
              Classy taste is only for those who are qualified to enjoy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>Booking Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.05,
  },
  welcome: {
    position: 'absolute',
    height: '100%',
    zIndex: 2,
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  welcomeTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 35,
    textTransform: 'capitalize',
  },
  welcomeDescription: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  welcomeButton: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  logInButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
  },
  logInText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
  },
});
