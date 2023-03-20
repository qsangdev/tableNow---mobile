import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

const Login = ({navigation}) => {
  const onPressLogin = () => {
    // Do something about login operation
  };
  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };
  const onPressSignUp = () => {
    // Do something about signup operation
  };
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}></Image>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          onChangeText={text => setState({email: text})}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          onChangeText={text => setState({password: text})}
        />
      </View>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 20,
  },
  inputView: {
    width: '80%',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  forgotAndSignUpText: {
    color: 'black',
    fontSize: 11,
  },
  loginBtn: {
    padding: 15,
    backgroundColor: 'black',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
export default Login;
