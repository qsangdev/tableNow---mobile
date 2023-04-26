import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    await axios
      .post('http://10.0.2.2:3001/api/staffs/log-in', {
        accountName: username,
        accountPassword: password,
      })
      .then(async res => {
        if (res.data.status === 'ERR') {
          return alert(res.data.message);
        } else {
          await AsyncStorage.setItem('resID', res.data.id);
          await AsyncStorage.setItem('staffID', res.data.staffID);
          await AsyncStorage.setItem('access_token', res.data.access_token);
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${res.data.access_token}`;
          navigation.navigate('Tables');
          
        }
      })
      .catch(err => {
        return console.log(err);
      });
  };

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
          onChangeText={setUsername}
          value={username}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <TouchableOpacity onPress={handleLogIn} style={styles.loginBtn}>
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
