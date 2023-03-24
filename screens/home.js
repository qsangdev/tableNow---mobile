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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DATA from '../hardData/DATA';
import GetLocation from 'react-native-get-location';
import {getDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {sortByDistance} from 'sort-by-distance';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 30;

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(0);
  const [openBooked, setOpenBooked] = useState(false);
  const [tables, setTables] = useState([]);
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
  // const [location, setLocation] = useState('');

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
    // console.log(location);
  };

  useEffect(() => {
    getLocation();
  }, []);

  ////////////////////// LOCATION ////////////////////

  useEffect(() => {
    const refesh = navigation.addListener('focus', () => {
      allTables();
    });
    return refesh;
  }, []);

  const allTables = async () => {
    try {
      const data = await AsyncStorage.getItem('tables');
      const allBooked = JSON.parse(data);
      setTables(allBooked);
      setBooked(allBooked.length);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteData = () => {
    try {
      Alert.alert('Are you sure?', 'Delete all booked?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('tables');
            allTables();
            setBooked(0);
          },
        },
      ]);
    } catch (e) {
      console.log(e);
    }
    console.log('All data deleted.');
  };

  const handleDeleteItem = async id => {
    try {
      const removeItem = [...tables].filter(item => item.id !== id);
      await AsyncStorage.setItem('tables', JSON.stringify(removeItem));
      setTables(removeItem);
      allTables();
    } catch (e) {
      console.log(e);
    }
  };

  const filterRestaurant = () => {
    return DATA.filter(e =>
      e.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
    );
  };

  const sortByRating = () => {
    return DATA.sort((a, b) => b.rating - a.rating);
  };

  const sortByDiscount = () => {
    return DATA.sort((a, b) => b.discount - a.discount);
  };

  // const origin = {
  //   x: currentLocation.longitude,
  //   y: currentLocation.latitude,
  // };

  // const points = DATA.map(e => {
  //   return {x: e.longitude, y: e.latitude};
  // });

  // const sortByDistanceFunction = () => {
  //   return sortByDistance(origin, points).sort(
  //     (a, b) => a.distance - b.distance,
  //   );
  // };

  return (
    <>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text style={styles.name}>Table Now</Text>
          </View>
          <Modal animationType="slide" transparent={true} visible={openBooked}>
            <View style={styles.modalContainer}>
              <SafeAreaView style={styles.modalHeader}>
                <TouchableOpacity onPress={tables && handleDeleteData}>
                  <Ionicons
                    size={30}
                    color="maroon"
                    name="trash-sharp"></Ionicons>
                </TouchableOpacity>
                <Text style={styles.modalText}>Booked List</Text>
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
                {tables ? (
                  tables.map(e => {
                    return (
                      <View style={styles.bookedItem} key={e.id}>
                        <View style={styles.itemsHeader}>
                          <Text style={styles.itemText}>
                            <Ionicons
                              color="maroon"
                              size={20}
                              name="time-outline"></Ionicons>
                            {'  '}
                            {e.time}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteItem(e.id)}>
                            <Ionicons
                              color="maroon"
                              size={25}
                              name="close-circle-outline"></Ionicons>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="restaurant-outline"></Ionicons>
                          {'  '}
                          {e.restaurant}
                        </Text>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="location-outline"></Ionicons>
                          {'  '}
                          {e.location}
                        </Text>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="calendar-outline"></Ionicons>
                          {'  '}
                          {e.date}
                        </Text>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="people-outline"></Ionicons>
                          {'  '}
                          {e.people}
                        </Text>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="person-circle-outline"></Ionicons>
                          {'  '}
                          {e.name}
                        </Text>
                        <Text style={styles.itemText}>
                          <Ionicons
                            color="maroon"
                            size={20}
                            name="call-outline"></Ionicons>
                          {'  '}
                          {e.number}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.modalText}>Empty</Text>
                )}
                {tables ? (
                  <Text style={{textAlign: 'center'}}>
                    * Warning: Your booking will be automatically canceled if
                    you check in 30 minutes late
                  </Text>
                ) : null}
              </ScrollView>
            </View>
          </Modal>
          <View style={styles.headerButton}>
            <TouchableOpacity onPress={() => setOpenBooked(!openBooked)}>
              <View style={styles.bookedNumber}>
                <Text style={styles.booked}>{booked}</Text>
              </View>
              <Ionicons name="restaurant-outline" size={35} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        currentLocation && (
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
              />
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

            {filterRestaurant().length > 0 ? (
              <FlatList
                data={
                  sort === 'rating'
                    ? sortByRating() && filterRestaurant()
                    : sort === 'discount'
                    ? sortByDiscount() && filterRestaurant()
                    : filterRestaurant()
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
                      <Image style={styles.itemImage} source={item.images[0]} />
                      <Text style={styles.itemDescription}>
                        {item.name}{' '}
                        <View style={styles.ratingBox}>
                          <Ionicons
                            name="star-outline"
                            color="black"
                            size={15}
                          />
                          <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                      </Text>
                      <Text>
                        {getDistance(
                          {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                          },
                          {
                            latitude: item.latitude,
                            longitude: item.longitude,
                          },
                        ) / 1000}{' '}
                        KM
                      </Text>
                      <Text style={styles.itemDiscount}>
                        Max discount {item.discount}%
                      </Text>
                    </TouchableOpacity>
                  );
                }}></FlatList>
            ) : (
              <Text style={styles.modalText}>Restaurant not found</Text>
            )}
          </>
        )
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
    fontSize: 17,
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
    borderRadius: 5,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
    color: 'black',
  },
  itemDiscount: {
    fontSize: 13,
    color: '#006400',
    marginTop: 5,
  },
  modalContainer: {
    margin: 18,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
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
    // borderWidth: 1,
    // borderColor: 'maroon',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    textAlignVertical: 'center',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {},
});
