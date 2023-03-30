import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Rating = ({navigation}) => {
  const [defaultRating, setDefaultRating] = useState(0);
  const maxRating = [1, 2, 3, 4, 5];
  const [comment, setComment] = useState('');

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}>
              <Text style={styles.starStarStyle}>
                {item <= defaultRating ? (
                  <Ionicons name="star" size={33} color="yellow" />
                ) : (
                  <Ionicons name="star-outline" size={30} color="yellow" />
                )}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.navigate('Home')}>
        <Ionicons color="white" name="home-outline" size={25} />
      </TouchableOpacity>
      <Image style={styles.logo} source={require('../assets/logo.png')}></Image>
      <View style={styles.rateContainer}>
        <Text style={styles.textStyle}>Rate your restaurant</Text>
        <Text style={styles.emoji}>
          {defaultRating == 1 ? (
            <>
              <Text>😡</Text>
            </>
          ) : defaultRating == 2 ? (
            <>
              <Text>😞</Text>
            </>
          ) : defaultRating == 3 ? (
            <>
              <Text>😐</Text>
            </>
          ) : defaultRating == 4 ? (
            <>
              <Text>😊</Text>
            </>
          ) : defaultRating == 5 ? (
            <>
              <Text>😍</Text>
            </>
          ) : (
            <Text>🤔</Text>
          )}
        </Text>
        <CustomRatingBar />
      </View>
      <View style={styles.comment}>
        <TextInput
          value={comment}
          onChangeText={text => setComment(text)}
          placeholder="Your comment .."></TextInput>
        {comment ? (
          <TouchableOpacity
            onPress={() => {
              setComment('');
              Keyboard.dismiss();
            }}>
            <Ionicons
              style={{marginTop: 10}}
              name="close-circle"
              size={25}
              color="silver"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <TouchableOpacity style={styles.buttonRate}>
        <Text style={styles.textRate}>Rate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 55,
    borderRadius: 5,
    marginRight: 10,
    zIndex: 1,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 23,
    color: 'black',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'silver',
    alignItems: 'center',
  },
  starStarStyle: {
    width: 40,
    height: 40,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonBack: {
    height: 45,
    width: 45,
    backgroundColor: 'silver',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  buttonRate: {
    width: '90%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    backgroundColor: 'green',
  },
  textRate: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  comment: {
    marginBottom: 20,
    width: '80%',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  rateContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 200,
    width: '80%',
    marginVertical: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
