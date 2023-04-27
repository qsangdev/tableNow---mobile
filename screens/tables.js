import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Button,
  TextInput,
  Animated,
  Modal,
  Alert,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'react-native-get-random-values';
import CheckBox from '@react-native-community/checkbox';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const IMG_WIDTH = width / 2 - 60;

const Tables = ({route, navigation}) => {
  const [resID, setResID] = useState('');
  const [staffID, setStaffID] = useState('');
  const [dataTables, setDataTables] = useState([]);
  const [dataStaff, setDataStaff] = useState([]);
  const [dataTimes, setDataTimes] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [clickedTime, setClickedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const [clicked, setClicked] = useState(false);
  const [openBooked, setOpenBooked] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [tableName, setTableName] = useState('');
  const [selectedTableIndex, setSelectedTableIndex] = useState(-1);
  const [isSelected, setSelection] = useState(false);

  const [orderID, setOrderID] = useState('');
  const [addDish, setAddDish] = useState([]);
  const [orderMenuID, setOrderMenuID] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPeoples, setGuestPeoples] = useState('');

  const getID = async () => {
    const resID = await AsyncStorage.getItem('resID');
    const staffID = await AsyncStorage.getItem('staffID');
    setResID(resID);
    setStaffID(staffID);
  };

  useEffect(() => {
    getID();
  }, [resID, staffID]);

  useEffect(() => {
    const refesh = navigation.addListener('focus', () => {
      getDataTables();
    });
    return refesh;
  }, [resID]);

  const getDataTables = async () => {
    setLoading(true);
    resID &&
      (await axios
        .get(`http://10.0.2.2:3001/api/table/get-details/${resID}`)
        .then(res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            setLoading(false);
            setDataTables(res.data.data.tables);
          }
        })
        .catch(err => console.log(err)));
  };

  useEffect(() => {
    getDataTables();
  }, [resID]);

  const getDataStaff = async () => {
    setLoading(true);
    staffID &&
      (await axios
        .get(`http://10.0.2.2:3001/api/staffs/get-details/${staffID}`)
        .then(res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            setLoading(false);
            setDataStaff(res.data.data);
          }
        })
        .catch(err => console.log(err)));
  };

  useEffect(() => {
    getDataStaff();
  }, [staffID]);

  const getDataTimes = async () => {
    setLoading(true);
    resID &&
      (await axios
        .get(`http://10.0.2.2:3001/api/profile/get-details/${resID}`)
        .then(res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            setLoading(false);
            setDataTimes(res.data.data);
          }
        })
        .catch(err => console.log(err)));
  };

  useEffect(() => {
    getDataTimes();
  }, [resID]);

  const getDataMenu = async () => {
    setLoading(true);
    resID &&
      (await axios
        .get(`http://10.0.2.2:3001/api/dish/get/${resID}`)
        .then(res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            setLoading(false);
            setDataMenu(res.data.data);
          }
        })
        .catch(err => console.log(err)));
  };

  useEffect(() => {
    getDataMenu();
  }, [resID]);

  const handleSendRequest = async () => {
    if (!guestName || !guestPeoples || !guestPhone) {
      return alert('Do not leave it blank');
    } else {
      setLoading(true);
      await axios
        .post('http://10.0.2.2:3001/api/order/create', {
          restaurantID: dataTimes.restaurantID,
          tableID: selectedTableIndex,
          guestName: guestName,
          guestPhone: guestPhone,
          dateOrder: moment().format('DD/MM/YYYY'),
          numberOfPeople: guestPeoples,
          timeOrder: `${dataTimes.shiftTime[clickedTime - 1].timeStart} - ${
            dataTimes.shiftTime[clickedTime - 1].timeEnd
          }`,
          tableName: tableName,
        })
        .then(async res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            await axios
              .post('http://10.0.2.2:3001/api/order-menu/create', {
                orderID: res.data.data._id,
              })
              .then(async res => {
                await axios.put(
                  `http://10.0.2.2:3001/api/order/update/${res.data.data.orderID}`,
                  {
                    orderMenuID: res.data.data._id,
                  },
                );
              });
            await axios
              .post(
                `http://10.0.2.2:3001/api/table/update-status/${dataTimes.restaurantID}`,
                {
                  tables: [
                    {
                      _id: selectedTableIndex,
                      status: 'unavailable',
                      orderID: res.data.data._id,
                    },
                  ],
                },
              )
              .then(() => {
                setLoading(false);
                setOpenGuest(false);
                getDataTables();
              });
          }
        })
        .catch(err => console.log(err));
    }
  };

  const handleAddMenu = (id, value) => {
    let found = false;
    for (let i = 0; i < addDish.length; i++) {
      if (JSON.stringify(addDish[i].dishID) === JSON.stringify(id)) {
        found = true;
        addDish[i].quantity = value; // Thêm key value nếu có sự trùng lặp
        break;
      }
    }
    if (!found) {
      addDish.push({dishID: id, quantity: value}); // Thêm mới một object nếu không trùng lặp
    }
    return setAddDish(addDish);
  };

  const handleSubmitMenu = async () => {
    if (addDish.length === 0) {
      return alert('You have not selected the dish yet');
    } else {
      await axios
        .post(`http://10.0.2.2:3001/api/order-menu/update/${orderID}`, {
          ordered: addDish,
        })
        .then(res => {
          setOrderMenuID(res.data.data._id);
          setOpenMenu(false);
          setAddDish([]);
        })
        .catch(err => alert(err));
    }
  };

  const logOut = () => {
    Alert.alert('Log out Comfirm', 'Do you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await AsyncStorage.removeItem('resID');
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('staffID');
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.welcomeButton}
              onPress={() => {
                setClicked(!clicked);
              }}>
              <Image
                style={styles.avatar}
                source={{
                  uri: dataStaff.staffPhoto
                    ? dataStaff.staffPhoto
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png',
                }}
              />
              <Text style={styles.buttonText}>{dataStaff.accountName}</Text>
              <Ionicons
                size={30}
                color={'white'}
                name={
                  clicked
                    ? 'arrow-back-circle-outline'
                    : 'arrow-forward-circle-outline'
                }></Ionicons>
            </TouchableOpacity>
            {clicked && (
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() =>
                  navigation.navigate('Profile', {
                    staff: dataStaff,
                    profile: dataTimes.restaurantName,
                  })
                }>
                <Ionicons
                  size={30}
                  color={'white'}
                  name="person-circle-outline"></Ionicons>
              </TouchableOpacity>
            )}
            {clicked && (
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => logOut()}>
                <Ionicons
                  size={30}
                  color={'white'}
                  name="log-out-outline"></Ionicons>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView>
            <View style={styles.tables}>
              <View style={styles.mealTimes}>
                {dataTimes?.shiftTime?.map(e => {
                  return (
                    <TouchableOpacity
                      key={e._id}
                      onPress={() => {
                        setClickedTime(e.shift);
                      }}
                      style={[
                        e.shift === clickedTime
                          ? styles.buttonActive
                          : styles.buttonTime,
                      ]}>
                      <Text style={styles.buttonText}>
                        {e.timeStart} - {e.timeEnd}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={styles.tableAvaiText}
                onPress={() => setOpenBooked(!openBooked)}>
                <Ionicons size={30} name="restaurant-outline"></Ionicons>
                <Text style={styles.tableName}>Reserved: </Text>
                <Text style={styles.tableName}>
                  {
                    dataTables
                      .filter(e => e.shift === clickedTime)
                      .filter(e => e.status === 'unavailable').length
                  }{' '}
                  / {dataTables.length / 3}
                </Text>
              </TouchableOpacity>
              {dataTables
                .filter(e => e.shift === clickedTime)
                .map(e => {
                  return (
                    <View key={e._id}>
                      <TouchableOpacity
                        style={styles.table}
                        onPress={
                          e.status === 'unavailable'
                            ? () => {
                                setOpenMenu(!openMenu);
                                setTableName(e.name);
                                setOrderID(e.orderID);
                                setSelectedTableIndex(e._id);
                              }
                            : () => {
                                setOpenGuest(true);
                                setTableName(e.name);
                                setSelectedTableIndex(e._id);
                              }
                        }>
                        {e.status === 'available' ? (
                          <CheckBox
                            tintColors={'green'}
                            disabled={true}
                            value={isSelected}
                            style={styles.checkbox}
                            onValueChange={setSelection}
                          />
                        ) : (
                          <CheckBox
                            tintColors={'red'}
                            disabled={true}
                            value={!isSelected}
                            style={styles.checkbox}
                            onValueChange={setSelection}
                          />
                        )}
                        <Text style={styles.tableName}>{e.name}</Text>
                        <Text style={styles.tableName}>
                          <Ionicons name="person" size={16} /> {e.minPeople}
                        </Text>
                        <Text style={styles.tableName}>
                          <Ionicons name="people" size={16} /> {e.maxPeople}
                        </Text>
                      </TouchableOpacity>
                      {selectedTableIndex === e._id && (
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={openGuest}>
                          <View style={styles.backgroundModal}>
                            <View style={styles.modalContainer}>
                              <SafeAreaView style={styles.modalHeader}>
                                <TouchableOpacity
                                  onPress={() => handleSendRequest()}>
                                  <Ionicons
                                    size={30}
                                    color="maroon"
                                    name="send"></Ionicons>
                                </TouchableOpacity>
                                <Text style={styles.modalText}>
                                  {tableName}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => setOpenGuest(false)}>
                                  <Ionicons
                                    size={30}
                                    color="maroon"
                                    name="close-circle"></Ionicons>
                                </TouchableOpacity>
                              </SafeAreaView>
                              <ScrollView style={styles.modalBox}>
                                <TextInput
                                  style={styles.input}
                                  placeholder="Guest name"
                                  onChangeText={e =>
                                    setGuestName(e)
                                  }></TextInput>
                                <TextInput
                                  placeholder="Guest phone number"
                                  keyboardType="numeric"
                                  style={styles.input}
                                  onChangeText={e =>
                                    setGuestPhone(e)
                                  }></TextInput>
                                <TextInput
                                  placeholder="Number of guests"
                                  keyboardType="numeric"
                                  style={styles.input}
                                  onChangeText={e =>
                                    setGuestPeoples(e)
                                  }></TextInput>
                              </ScrollView>
                            </View>
                          </View>
                        </Modal>
                      )}
                    </View>
                  );
                })}
            </View>
          </ScrollView>
          <Modal animationType="slide" transparent={true} visible={openMenu}>
            <View style={styles.backgroundModal}>
              <View style={styles.modalContainer}>
                <SafeAreaView style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      setOpenMenu(false);
                      navigation.navigate('Invoice', {
                        resID: resID,
                        staffID: staffID,
                        orderID: orderID,
                        tableName: tableName,
                        tableID: selectedTableIndex,
                        dataMenu: dataMenu,
                        orderMenuID: orderMenuID,
                      });
                    }}>
                    <Ionicons
                      size={30}
                      color="maroon"
                      name="cash-outline"></Ionicons>
                  </TouchableOpacity>
                  <Text style={styles.modalText}>{tableName}</Text>
                  <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>
                    <Ionicons
                      size={30}
                      color="maroon"
                      name="close-circle"></Ionicons>
                  </TouchableOpacity>
                </SafeAreaView>
                <ScrollView style={styles.modalBox}>
                  <View style={styles.menuContainer}>
                    {dataMenu.map(e => {
                      return (
                        <View style={styles.menu} key={e._id}>
                          <Image
                            style={styles.menuImage}
                            source={{uri: e.dishImage[0]}}
                          />
                          <Text style={styles.menuItem}>{e.dishName}</Text>
                          <Text>${e.dishPrice}</Text>
                          <NumericInput
                            type="plus-minus"
                            minValue={0}
                            maxValue={64}
                            totalWidth={100}
                            totalHeight={35}
                            onChange={value => handleAddMenu(e._id, value)}
                          />
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
                <SafeAreaView>
                  <TouchableOpacity
                    onPress={() => handleSubmitMenu()}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      backgroundColor: 'maroon',
                      padding: 10,
                      borderRadius: 10,
                    }}>
                    <Text style={styles.buttonText}>Submit </Text>
                    <Ionicons
                      size={20}
                      name="checkmark-done"
                      style={{color: 'white'}}></Ionicons>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </Modal>
          <Modal animationType="slide" transparent={true} visible={openBooked}>
            <View style={styles.modalContainer}>
              <SafeAreaView style={styles.modalHeader}>
                <Text style={styles.modalText}>Booked List</Text>
                <TouchableOpacity onPress={() => setOpenBooked(!openBooked)}>
                  <Ionicons
                    size={30}
                    color="maroon"
                    name="close-circle"></Ionicons>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

export default Tables;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: 5,
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tables: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 20,
    gap: 11,
  },
  tableAvaiText: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 2,
    borderColor: 'black',
    width: 100,
    marginRight: 5,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  table: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tableName: {
    alignSelf: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  welcomeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
    paddingRight: 15,
  },
  roundButton: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    height: 55,
    width: 70,
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
  },
  modalContainer: {
    marginHorizontal: 10,
    maxHeight: 560,
    top: height / 2 - 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
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
    borderWidth: 1,
    borderColor: 'maroon',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    textAlignVertical: 'center',
  },
  menuContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  menu: {
    width: IMG_WIDTH,
    marginBottom: 20,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  menuText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  menuImage: {
    width: '100%',
    height: IMG_WIDTH + 30,
    borderRadius: 20,
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    flex: 1,
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 110,
    marginTop: 10,
    marginBottom: 15,
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
  mealTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  buttonTime: {
    padding: 8,
    backgroundColor: 'silver',
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 8,
  },
  buttonActive: {
    padding: 8,
    backgroundColor: 'gray',
    alignSelf: 'center',
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 8,
  },
  buttonText: {
    fontWeight: '800',
    color: 'white',
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
});
