import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Modal,
  Alert,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetLocation from 'react-native-get-location';
import {getDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import moment from 'moment';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 30;

const Home = ({navigation}) => {
  const [DATA, setDATA] = useState('');
  const [dataOrder, setDataOrder] = useState('');

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [openBooked, setOpenBooked] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [sort, setSort] = useState('rating');

  ////////////////////// LOCATION ////////////////////
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  // State to hold location //
  const [currentLocation, setCurrentLocation] = useState('');

  // Function to check permissions and get Location //
  const getLocation = () => {
    setLoading(true);
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 30000,
        })
          .then(location => {
            console.log(location.latitude, location.longitude);
            setCurrentLocation(location);
            setLoading(false);
          })
          .catch(error => {
            const {code, message} = error;
            console.warn(code, message);
          });
      }
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  ////////////////////// LOCATION ////////////////////

  useEffect(() => {
    const refesh = navigation.addListener('focus', () => {
      getUser();
      getDATA();
      getDataOrder();
    });
    return refesh;
  }, [userName, userPhone]);

  const getUser = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      if (!data || data.length === 0) {
        return;
      } else {
        const user = JSON.parse(data);
        setUserName(user.userName);
        setUserPhone(user.userPhone);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const handleDeleteData = () => {
  //   try {
  //     Alert.alert('Are you sure?', 'Delete all reservation?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: async () => {
  //           await AsyncStorage.removeItem('tables');
  //           allTables();
  //           setBooked(0);
  //           console.log('All data deleted.');
  //         },
  //       },
  //     ]);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleCancelOrder = (id, resID) => {
    try {
      Alert.alert('Are you sure?', 'Delete this reservation?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await axios
              .put(`http://10.0.2.2:3001/api/order/update/${id}`, {
                cancelled: true,
              })
              .then(async res => {
                if (res.data.status === 'ERR') {
                  return alert(res.data.message);
                } else {
                  await axios
                    .post(
                      `http://10.0.2.2:3001/api/table/update-status/${
                        DATA?.filter(e => e.restaurantID === resID)[0]
                          .restaurantID
                      }`,
                      {
                        tables: [
                          {
                            _id: id,
                            status: 'available',
                          },
                        ],
                      },
                    )
                    .then(() => {
                      getUser();
                      getDataOrder();
                    });
                }
              });
          },
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const getDATA = async () => {
    setLoading(true);
    await axios
      .get('http://10.0.2.2:3001/api/profile/getAll')
      .then(res => {
        setLoading(false);
        setDATA(res.data.data.filter(e => e.active === true));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDATA();
  }, []);

  const getDataOrder = async () => {
    setLoading(true);
    await axios
      .get('http://10.0.2.2:3001/api/order/getAll')
      .then(res => {
        if ((userName, userPhone)) {
          setLoading(false);
          setDataOrder(
            res.data.data.filter(
              e =>
                (e.guestName === userName || e.guestPhone === userPhone) &&
                e.completed === false &&
                e.cancelled === false,
            ),
          );
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataOrder();
  }, [userName, userPhone]);

  useEffect(() => {
    checkOverTime();
  }, [dataOrder]);

  const checkOverTime = () => {
    dataOrder !== '' &&
      dataOrder.map(async e => {
        if (
          moment().isAfter(
            moment(
              `${e.dateOrder.slice(0, 5)} ${e.timeOrder.slice(0, 6)}`,
              'DD/MM HH:mm',
            )
              .add(30, 'minutes')
              .toDate(),
          ) === true
        ) {
          await axios
            .put(`http://10.0.2.2:3001/api/order/update/${e._id}`, {
              cancelled: true,
            })
            .then(async res => {
              if (res.data.status === 'ERR') {
                return alert(res.data.message);
              } else {
                await axios
                  .post(
                    `http://10.0.2.2:3001/api/table/update-status/${e.restaurantID}`,
                    {
                      tables: [
                        {
                          _id: e._id,
                          status: 'available',
                        },
                      ],
                    },
                  )
                  .then(() => {
                    getUser();
                    getDataOrder();
                  });
              }
            });
        }
      });
  };

  const filterRestaurant = () => {
    if (loading === false || DATA !== '') {
      return DATA.filter(e =>
        e.restaurantName
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase()),
      );
    } else setLoading(true);
  };

  const sortByRating = () => {
    return DATA.sort((a, b) => b.rating - a.rating);
  };

  const sortByDiscount = () => {
    return DATA.sort((a, b) => b.maxDiscount - a.maxDiscount);
  };

  return (
    <>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text style={styles.name}>Table Now</Text>
          </View>
          <Modal animationType="slide" transparent={true} visible={openBooked}>
            <View style={styles.backgroundModal}>
              <View style={styles.modalContainer}>
                <SafeAreaView style={styles.modalHeader}>
                  <TouchableOpacity
                  //  onPress={tables && handleDeleteData}
                  >
                    <Ionicons
                      size={30}
                      color="maroon"
                      name="trash-sharp"></Ionicons>
                  </TouchableOpacity>
                  <Text style={styles.modalText}>Reservation List</Text>
                  <TouchableOpacity onPress={() => setOpenBooked(!openBooked)}>
                    <Ionicons
                      size={30}
                      color="maroon"
                      name="close-circle"></Ionicons>
                  </TouchableOpacity>
                </SafeAreaView>
                <ScrollView
                  style={styles.modalBox}
                  showsVerticalScrollIndicator={false}>
                  {!dataOrder || dataOrder.length === 0 || DATA.length === 0 ? (
                    <Text style={styles.modalText}>Empty</Text>
                  ) : (
                    dataOrder.map(e => {
                      return (
                        <View style={styles.bookedItem} key={e._id}>
                          <View style={styles.itemText}>
                            <Ionicons
                              style={{marginVertical: -4}}
                              color="maroon"
                              size={22}
                              name="time-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: 2}}
                              color="maroon"
                              size={22}
                              name="restaurant-outline"></Ionicons>
                            <Ionicons
                              style={{marginTop: 2, marginBottom: 1}}
                              color="maroon"
                              size={25}
                              name="location-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: 5}}
                              color="maroon"
                              size={22}
                              name="calendar-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: -1}}
                              color="maroon"
                              size={22}
                              name="grid-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: 1}}
                              color="maroon"
                              size={22}
                              name="people-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: -2}}
                              color="maroon"
                              size={22}
                              name="person-circle-outline"></Ionicons>
                            <Ionicons
                              style={{marginVertical: 2}}
                              color="maroon"
                              size={22}
                              name="call-outline"></Ionicons>
                          </View>

                          <View style={{marginLeft: 10, marginRight: 20}}>
                            <Text style={styles.itemText}>{e.timeOrder}</Text>
                            <Text style={styles.itemText}>
                              {DATA.filter(
                                i => i.restaurantID === e.restaurantID,
                              ).map(i => {
                                return i.restaurantName;
                              })}
                            </Text>
                            <Text style={styles.itemText}>
                              {DATA.filter(
                                i => i.restaurantID === e.restaurantID,
                              ).map(i => {
                                return i.restaurantAddress;
                              })}
                            </Text>
                            <Text style={styles.itemText}>{e.dateOrder}</Text>
                            <Text style={styles.itemText}>{e.tableName}</Text>
                            <Text style={styles.itemText}>
                              {' '}
                              {e.numberOfPeople}
                            </Text>
                            <Text style={styles.itemText}>{e.guestName}</Text>
                            <View style={styles.itemsHeader}>
                              <Text style={styles.itemText}>
                                {e.guestPhone}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  handleCancelOrder(e._id, e.restaurantID)
                                }>
                                <Ionicons
                                  color="maroon"
                                  size={25}
                                  name="trash-outline"></Ionicons>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  )}
                  {!dataOrder ||
                  dataOrder.length === 0 ||
                  DATA.length === 0 ? null : (
                    <Text style={{textAlign: 'center', fontWeight: '600'}}>
                      * Warning: Your booking will be automatically canceled if
                      you check in 30 minutes late!
                    </Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
          <View style={styles.headerButton}>
            <TouchableOpacity onPress={() => setOpenBooked(!openBooked)}>
              <View style={styles.bookedNumber}>
                {!dataOrder || dataOrder.length === 0 || DATA.length === 0 ? (
                  <Text style={styles.booked}>0</Text>
                ) : (
                  <Text style={styles.booked}>{dataOrder.length}</Text>
                )}
              </View>
              <Ionicons name="restaurant-outline" size={35} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {loading || DATA === '' ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <View style={styles.search}>
            <Ionicons
              style={{marginLeft: 10}}
              name="search-outline"
              size={20}
              color="white"
            />
            <TextInput
              placeholder="Where do you want to eat today?"
              placeholderTextColor="white"
              onChangeText={text => setSearchText(text)}
              style={styles.searchText}
              value={searchText}
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  Keyboard.dismiss();
                }}>
                <Ionicons
                  style={{marginRight: 10}}
                  name="close-circle-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Picker
            style={styles.picker}
            mode="dropdown"
            itemStyle={styles.itemPicker}
            selectedValue={sort}
            onValueChange={(itemValue, itemIndex) => setSort(itemValue)}>
            <Picker.Item label="Sort by Discount" value="discount" />
            <Picker.Item label="Sort by Rating" value="rating" />
            <Picker.Item label="Sort by Distance" value="distance" />
          </Picker>

          {DATA !== '' ? (
            <FlatList
              data={
                sort === 'rating'
                  ? sortByRating() && filterRestaurant()
                  : sort === 'discount'
                  ? sortByDiscount() && filterRestaurant()
                  : DATA
              }
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.items}
                    key={index}
                    onPress={() => {
                      navigation.navigate('Restaurant', {
                        item: item,
                        location: currentLocation,
                      });
                    }}>
                    <Image
                      style={styles.itemImage}
                      source={{
                        uri:
                          item.images.length === 0
                            ? 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'
                            : item.images[0],
                      }}
                    />
                    <Text style={styles.itemDescription}>
                      {item.restaurantName}{' '}
                    </Text>
                    <View style={styles.ratingBox}>
                      <Ionicons name="star-outline" color="black" size={17} />

                      <Text style={styles.ratingText}>
                        {item.rating ? `${item.rating}`.slice(0, 3) : null}
                      </Text>
                    </View>
                    <View style={styles.resInfo}>
                      {currentLocation && (
                        <Text style={styles.distant}>
                          {`${
                            getDistance(
                              {
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                              },
                              {
                                latitude: item.latitude,
                                longitude: item.longitude,
                              },
                            ) / 1000
                          }`.slice(0, 4)}{' '}
                          KM
                        </Text>
                      )}
                      <Text style={styles.itemDiscount}>
                        Max discount {item.maxDiscount}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}></FlatList>
          ) : (
            <Text style={styles.modalText}>Restaurant not found</Text>
          )}
        </>
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  search: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'silver',
    borderRadius: 10,
  },
  searchText: {
    backgroundColor: 'silver',
    height: 40,
    padding: 5,
    flex: 1,
    marginEnd: 8,
    color: 'white',
    fontWeight: '800',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginRight: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: '800',
    color: 'black',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookedNumber: {
    height: 20,
    width: 20,
    position: 'absolute',
    zIndex: 1,
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  booked: {
    color: 'white',
    textAlign: 'center',
  },
  description: {
    width: '100%',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 23,
    fontWeight: '700',
    color: 'black',
  },
  list: {
    marginRight: 30,
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
  },
  items: {
    width: ITEM_WIDTH,
    marginStart: 20,
    marginVertical: 20,
    height: 295,
  },
  itemImage: {
    width: '100%',
    height: ITEM_WIDTH + 30,
    borderRadius: 20,
  },
  itemDescription: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  rating: {
    padding: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
    padding: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    width: 50,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
    color: 'black',
  },
  itemDiscount: {
    fontSize: 13,
    color: '#006400',
    marginTop: 5,
    fontWeight: '700',
  },
  backgroundModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  modalContainer: {
    margin: 18,
    borderRadius: 20,
    backgroundColor: '#DCDCDC',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    maxHeight: height - 50,
  },
  modalBox: {
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlignVertical: 'center',
    flex: 1,
  },
  bookedItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    textAlignVertical: 'center',
    marginVertical: 2,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {},
  distant: {
    fontWeight: '800',
  },
  resInfo: {
    position: 'absolute',
    bottom: 0,
  },
});
