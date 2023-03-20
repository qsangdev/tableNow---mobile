import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Rating = ({navigation}) => {
  const [defaultRating, setDefaultRating] = useState(0);
  const maxRating = [1, 2, 3, 4, 5];

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
                  <Ionicons name="star" size={30} color="yellow" />
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
        <Ionicons name="home-outline" size={25} />
      </TouchableOpacity>
      <Image style={styles.logo} source={require('../assets/logo.png')}></Image>
      <Text style={styles.textStyle}>Rate your restaurant</Text>
      <Text style={styles.emoji}>
        {defaultRating == 1 ? (
          <>
            <Text>😡</Text>
            <Text>Bad</Text>
          </>
        ) : defaultRating == 2 ? (
          <>
            <Text>😞</Text>
            <Text>Not Good</Text>
          </>
        ) : defaultRating == 3 ? (
          <>
            <Text>😐</Text>
            <Text>So So</Text>
          </>
        ) : defaultRating == 4 ? (
          <>
            <Text>😊</Text>
            <Text>Great</Text>
          </>
        ) : defaultRating == 5 ? (
          <>
            <Text>😍</Text>
            <Text>Excellent</Text>
          </>
        ) : (
          <Text>🤔</Text>
        )}
      </Text>
      <CustomRatingBar />
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
    marginVertical: 20,
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
  },
  buttonBack: {
    height: 45,
    width: 45,
    backgroundColor: 'white',
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
    marginBottom: 10,
    backgroundColor: 'green',
  },
  textRate: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});
