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
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDistance} from 'geolib';
import axios from 'axios';
import moment from 'moment';

const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const IMG_WIDTH = width / 2 - 30;

const Restaurant = ({route, navigation}) => {
  const item = route.params.item;
  const location = route.params.location;
  const [imgActive, setImgActive] = useState(0);

  const [loading, setLoading] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataRating, setDataRating] = useState([]);

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

  const getDataMenu = async () => {
    setLoading(true);
    await axios
      .get(`http://10.0.2.2:3001/api/dish/get/${item.restaurantID}`)
      .then(res => {
        setLoading(false);
        setDataMenu(res.data.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataMenu();
  }, []);

  const getDataRating = async () => {
    setLoading(true);
    await axios
      .get(`http://10.0.2.2:3001/api/rating/get-details/${item.restaurantID}`)
      .then(res => {
        setLoading(false);
        setDataRating(res.data.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataRating();
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.navigate('Home')}>
        <Ionicons color="white" name="arrow-back" size={25} />
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
                  source={{uri: e}}
                  style={styles.wrap}></ImageBackground>
              ))}
            </ScrollView>
          </View>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <View style={styles.title}>
                <Text style={styles.name}>{item.restaurantName}</Text>
              </View>
              <TouchableOpacity
                style={styles.rating}
                onPress={() =>
                  navigation.navigate('Rating', {
                    item: item,
                  })
                }>
                <Ionicons name="star-outline" color="black" size={20} />

                <Text style={styles.ratingText}>
                  {item.rating ? `${item.rating}`.slice(0, 3) : null}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.location}>
              <Text style={styles.addressText}>{item.restaurantAddress}</Text>
              <Text style={styles.addressText}>
                {`${
                  getDistance(
                    {
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                    {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    },
                  ) / 1000
                }`.slice(0, 4)}{' '}
                KM
              </Text>
            </View>
            <View style={styles.time}>
              <Ionicons name="alarm-outline" color="black" size={22} />
              <Text style={styles.timeText}>
                <Text>Opening Time:</Text> {item.shiftTime[0].timeStart} -{' '}
                {item.shiftTime[2].timeEnd}
              </Text>
            </View>
            <Text style={styles.resDescription}>{item.restaurantDescribe}</Text>
            <Text style={styles.name}>Menu</Text>
            <Text style={styles.timeText}>● Dishes</Text>
            <ScrollView
              persistentScrollbar={true}
              horizontal={true}
              style={styles.menuContainer}>
              {loading || dataMenu === '' ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : (
                dataMenu
                  .filter(e => e.dishType === 'Dish')
                  .map(e => {
                    return (
                      <View style={styles.menu} key={e._id}>
                        <Text style={styles.dishDiscount}>
                          -{e.dishDiscount ? e.dishDiscount : 0}%
                        </Text>
                        <Image
                          style={styles.menuImage}
                          source={{
                            uri:
                              e.dishImage.length === 0
                                ? 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'
                                : e.dishImage[0],
                          }}
                        />
                        <Text style={styles.menuItem}>{e.dishName}</Text>
                        <Text style={styles.menuText}>${e.dishPrice}</Text>
                        <Text>{e.dishDescribe}</Text>
                      </View>
                    );
                  })
              )}
            </ScrollView>
            <Text style={styles.timeText}>● Drinks</Text>
            <ScrollView
              persistentScrollbar={true}
              horizontal={true}
              style={styles.menuContainer}>
              {loading || dataMenu === '' ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : (
                dataMenu
                  .filter(e => e.dishType === 'Drink')
                  .map(e => {
                    return (
                      <View style={styles.menu} key={e._id}>
                        <Text style={styles.dishDiscount}>
                          -{e.dishDiscount ? e.dishDiscount : 0}%
                        </Text>
                        <Image
                          style={styles.menuImage}
                          source={{
                            uri:
                              e.dishImage.length === 0
                                ? 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'
                                : e.dishImage[0],
                          }}
                        />
                        <Text style={styles.menuItem}>{e.dishName}</Text>
                        <Text style={styles.menuText}>${e.dishPrice}</Text>
                        <Text>{e.dishDescribe}</Text>
                      </View>
                    );
                  })
              )}
            </ScrollView>
            <View>
              <Text style={styles.menuText}>Rating</Text>
              {loading || dataRating === '' ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : (
                dataRating
                  .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
                  .map(e => {
                    return (
                      <View
                        key={e._id}
                        style={{
                          marginTop: 10,
                          borderWidth: 1,
                          borderRadius: 10,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.addressText}>
                            {e.ratingName}:
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            {[...Array(e.ratingStar)].map((e, i) => {
                              return (
                                <Ionicons
                                  key={i}
                                  name="star"
                                  color="gold"
                                  size={20}
                                />
                              );
                            })}
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.addressText}>
                            "{e.ratingComment}"
                          </Text>
                          <Text>
                            {moment(e.createdAt).format('HH:mm DD/MM/YYYY')}
                          </Text>
                        </View>
                      </View>
                    );
                  })
              )}
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
    backgroundColor: 'silver',
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
    padding: 7,
    paddingHorizontal: 10,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ratingText: {
    fontSize: 18,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginVertical: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  menu: {
    width: IMG_WIDTH,
    marginBottom: 20,
    marginRight: 20,
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
    fontSize: 25,
    fontWeight: '700',
    color: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'white',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  addressText: {
    fontWeight: '800',
  },
  dishDiscount: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#006400',
    color: 'white',
    right: 0,
    paddingHorizontal: 5,
    fontSize: 15,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
});
