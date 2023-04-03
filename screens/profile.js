import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = ({navigation, route}) => {
  const onGoBack = route.params.onGoBack;

  return (
    <View style={styles.profileContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            {
              navigation.navigate('Tables');
              onGoBack();
            }
          }}>
          <Ionicons
            size={50}
            color="maroon"
            name="arrow-back-circle-outline"></Ionicons>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://bootdey.com/img/Content/avatar/avatar1.png',
            }}
          />

          <Text style={styles.name}>John Smith</Text>
          <Text style={styles.id}>ID: 0001</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.gender}>Gender: Male</Text>
        <Text style={styles.phone}>Phone: 0962788922</Text>
        <Text style={styles.email}>Email: js@gmail.com</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    color: 'black',
    fontWeight: '600',
  },
  id: {fontSize: 18, color: 'maroon', fontWeight: 400},

  gender: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: 'maroon',
    borderRadius: 10,
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 20,
    textAlignVertical: 'center',
  },
  phone: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: 'maroon',
    borderRadius: 10,
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 20,
    textAlignVertical: 'center',
  },
  email: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: 'maroon',
    borderRadius: 10,
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 20,
    textAlignVertical: 'center',
  },
});
