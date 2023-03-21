import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDistance} from 'geolib';

const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const IMG_WIDTH = width / 2 - 30;

const Restaurant = ({route, navigation}) => {
  const item = route.params.item;
  const location = route.params.location;
  const [imgActive, setImgActive] = useState(0);

  onchange = nativeEvent => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={25} />
      </TouchableOpacity>
      <ScrollView>
        <View>
          <View style={styles.wrap}>
            <View style={styles.wrapDot}>
              {item.images.map((e, index) => (
                <Text
                  key={index}
                  style={imgActive === index ? styles.dotActive : styles.dot}>
                  ●
                </Text>
              ))}
            </View>
            <ScrollView
              onScroll={({nativeEvent}) => onchange(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              style={styles.wrap}>
              {item.images.map((e, index) => (
                <ImageBackground
                  key={index}
                  resizeMode="stretch"
                  source={e}
                  style={styles.wrap}></ImageBackground>
              ))}
            </ScrollView>
          </View>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <View style={styles.title}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.rating}
                onPress={() => navigation.navigate('Rating')}>
                <Ionicons name="star-outline" color="black" size={17} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.location}>
              <Text>{item.location}</Text>
              <Text>
                {getDistance(
                  {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                  {
                    latitude: item.latitude,
                    longitude: item.longitude,
                  },
                ) / 1000}{' '}
                KM
              </Text>
            </View>
            <View style={styles.time}>
              <Ionicons name="alarm-outline" color="black" size={22} />
              <Text style={styles.timeText}>
                <Text>Opening Time:</Text> {item.times.open_time} -{' '}
                {item.times.close_time}
              </Text>
            </View>
            <Text style={styles.resDescription}>{item.description}</Text>
            <Text style={styles.menuText}>Menu</Text>
            <View style={styles.menuContainer}>
              {item.menu.map(e => {
                return (
                  <View style={styles.menu} key={e.id}>
                    <Image style={styles.menuImage} source={{uri: e.image}} />
                    <Text style={styles.menuItem}>{e.title}</Text>
                    <Text>${e.price}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonBooking}
            onPress={() => navigation.navigate('Booking', {item: item})}>
            <Text style={styles.buttonText}>Choose this Restaurant</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  wrap: {
    width: width,
    height: height / 2.5,
  },
  wrapDot: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    zIndex: 1,
  },
  dotActive: {
    margin: 3,
    color: 'gray',
    fontSize: 20,
  },
  dot: {
    margin: 3,
    color: 'white',
    fontSize: 20,
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
  buttonShare: {
    height: 45,
    width: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  container: {
    padding: 20,
    paddingTop: 30,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 30,
    color: 'black',
    fontWeight: '700',
  },
  title: {
    width: '70%',
  },
  rating: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
    color: 'black',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
    color: 'black',
  },
  resDescription: {
    paddingVertical: 10,
  },
  location: {
    marginBottom: 10,
  },
  time: {
    padding: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  menuContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  menu: {
    width: IMG_WIDTH,
    marginBottom: 20,
  },
  circle: {
    width: 10,
    height: 10,
    backgroundColor: 'silver',
    borderRadius: 10,
  },
  menuItem: {
    fontSize: 17,
    fontWeight: '600',
    color: 'gray',
  },
  menuText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonBooking: {
    width: '100%',
    padding: 5,
    backgroundColor: 'gray',
    borderRadius: 10,
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  menuImage: {
    width: '100%',
    height: IMG_WIDTH + 30,
    borderRadius: 20,
  },
});
