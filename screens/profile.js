import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = ({navigation, route}) => {
  const staff = route.params.staff;
  const resName = route.params.profile;

  return (
    <View style={styles.profileContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{top: 20, left: 20}}
          onPress={() => navigation.navigate('Tables')}>
          <Ionicons
            size={50}
            color="maroon"
            name="arrow-back-circle-outline"></Ionicons>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: !staff.staffPhoto
                ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'
                : staff.staffPhoto,
            }}
          />

          <Text style={styles.name}>{staff.accountName}</Text>
          <Text style={styles.id}>{resName}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.gender}>{staff.staffName}</Text>
        <Text style={styles.gender}>{staff.staffSex}</Text>
        <Text style={styles.phone}>{staff.staffPhone}</Text>
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
    width: 150,
    height: 150,
    borderRadius: 100,
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
