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
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Party} from '../assets';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import axios from 'axios';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const Booking = ({route, navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [checkTime, setCheckTime] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dataTables, setDataTables] = useState([]);
  const [dataTime, setDataTime] = useState([]);

  const [chooseId, setChooseId] = useState(0);
  const [tableId, setTableId] = useState(0);
  const handleChoose = (name, id) => {
    setChooseId(name);
    setTableId(id);
  };

  const today = new Date();

  const item = route.params.item;

  const [clicked, setClicked] = useState(1);

  const getDataTables = async () => {
    setLoading(true);
    await axios
      .get(`https://tablenow.onrender.com/api/table/get-details/${item.restaurantID}`)
      .then(res => {
        setLoading(false);
        setDataTables(res.data.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataTables();
  }, []);

  const getDataTimes = async () => {
    setLoading(true);
    await axios
      .get(`https://tablenow.onrender.com/api/profile/get-details/${item.restaurantID}`)
      .then(res => {
        setLoading(false);
        setDataTime(res.data.data.shiftTime);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataTimes();
  }, []);

  function increment() {
    if (dataTables.tables.length > 0) {
      const maxPeople = Math.max(...dataTables.tables.map(e => e.maxPeople));
      setPeople(function (prevCount) {
        if (prevCount < maxPeople) return (prevCount += 1);
        else {
          return prevCount;
        }
      });
    }
  }

  function decrement() {
    setPeople(function (prevCount) {
      if (prevCount > 1) {
        return (prevCount -= 1);
      } else {
        return (prevCount = 1);
      }
    });
  }

  const handleClick = id => {
    checkRealTime();
    setClicked(id);
  };

  const onComfirmPress = () => {
    if (name === '') {
      return Alert.alert('Warning', 'Please enter your name');
    } else if (number === '') {
      return Alert.alert('Warning', 'Please enter your number..');
    } else if (people === 0) {
      return Alert.alert('Warning', 'Please choose number of people..');
    } else if (chooseId === 0) {
      return Alert.alert('Warning', 'Please choose your table!');
    } else if (checkTime === false) {
      return Alert.alert('Warning', 'The reservation time has passed');
    } else if (number.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      return setModalVisible(!modalVisible);
    } else {
      Alert.alert('Warning', 'Phone number is not in the correct format!');
    }
  };

  const checkRealTime = () => {
    if (dataTime.length > 0) {
      const eatTime = moment(
        moment(date).format('DD/MM') + ' ' + dataTime[clicked - 1].timeEnd,
        'DD/MM HH:mm',
      )
        .subtract(30, 'minutes')
        .toDate();
      if (moment().isAfter(eatTime)) {
        setCheckTime(false);
      } else {
        setCheckTime(true);
      }
    }
  };

  useEffect(() => {
    checkRealTime();
  }, [clicked, checkTime, date, dataTime]);

  const handleOrder = async () => {
    try {
      setLoading(true);
      await axios
        .post('https://tablenow.onrender.com/api/order/create', {
          restaurantID: item.restaurantID,
          tableID: tableId,
          guestName: name,
          guestPhone: number,
          dateOrder: moment(date).format('DD/MM/YYYY'),
          numberOfPeople: people,
          timeOrder: `${dataTime[clicked - 1].timeStart} - ${
            dataTime[clicked - 1].timeEnd
          }`,
          tableName: chooseId,
        })
        .then(async res => {
          if (res.data.status === 'ERR') {
            return alert(res.data.message);
          } else {
            await axios
              .post('https://tablenow.onrender.com/api/order-menu/create', {
                restaurantID: item.restaurantID,
                orderID: res.data.data._id,
              })
              .then(async res => {
                await axios.put(
                  `https://tablenow.onrender.com/api/order/update/${res.data.data.orderID}`,
                  {
                    orderMenuID: res.data.data._id,
                  },
                );
              });
            await axios
              .post(
                `https://tablenow.onrender.com/api/table/update-status/${item.restaurantID}`,
                {
                  tables: [
                    {
                      _id: tableId,
                      timeOrder: `${dataTime[clicked - 1].timeStart} - ${
                        dataTime[clicked - 1].timeEnd
                      }`,
                      dateOrder: moment(date).format('DD/MM/YYYY'),
                      orderID: res.data.data._id,
                    },
                  ],
                },
              )
              .then(async res => {
                await saveInfo(name, number);
                setLoading(false);
                Alert.alert(
                  res.data.message,
                  'You have made a successful reservation!',
                );
                navigation.navigate('Home');
              });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const saveInfo = async (name, number) => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('users')) || [];
      if ((name, number)) {
        const newUser = {userName: name, userPhone: number};
        data.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const autoFillLastInfo = async () => {
    try {
      const data = await AsyncStorage.getItem('users');
      if (!data || data.length === 0) {
        return;
      } else {
        const user = JSON.parse(data);
        setName(user[user.length - 1].userName);
        setNumber(user[user.length - 1].userPhone);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    autoFillLastInfo();
  }, []);

  return (
    <>
      {dataTables.length === 0 || dataTime.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <ScrollView>
            <Party width={width} height={width / 2} fill={'none'} />
            <SafeAreaView>
              <View style={styles.container}>
                <View style={styles.description}>
                  <Text style={styles.descriptionText}>
                    Please enter your reservation information ..
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons
                      style={{marginRight: 10}}
                      color="black"
                      size={30}
                      name="person-circle-outline"></Ionicons>
                    <TextInput
                      style={styles.input}
                      value={name}
                      placeholder="Name .."
                      onChangeText={e => setName(e)}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons
                      style={{marginRight: 10}}
                      color="black"
                      size={30}
                      name="call-outline"></Ionicons>
                    <TextInput
                      value={number}
                      style={styles.input}
                      placeholder="Phone number .."
                      keyboardType="numeric"
                      onChangeText={e => setNumber(e)}
                    />
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.mealTimeText}>
                    <Ionicons
                      color="black"
                      size={25}
                      name="calendar-outline"></Ionicons>{' '}
                    Date: {moment(date).format('DD/MM/YYYY')}
                  </Text>
                  {moment().isAfter(
                    moment(
                      moment(date).format('DD/MM') + ' ' + dataTime[2].timeEnd,
                      'DD/MM HH:mm',
                    )
                      .subtract(30, 'minutes')
                      .toDate(),
                  ) ? (
                    <Text style={{marginBottom: 5, color: 'red'}}>
                      Today's reservation time has passed, please select the
                      next date !
                    </Text>
                  ) : null}
                  <Button
                    color="black"
                    title="Choose your date"
                    onPress={() => setOpen(true)}
                  />
                  <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    minimumDate={new Date(today)}
                    maximumDate={new Date(today.setDate(today.getDate() + 7))}
                    onConfirm={date => {
                      setOpen(false);
                      setDate(date);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>
                <View style={styles.peopleContainer}>
                  <View style={{flex: 11, marginRight: 20}}>
                    <Text style={styles.mealTimeText}>
                      <Ionicons
                        size={25}
                        color="black"
                        name="people-outline"></Ionicons>{' '}
                      Number of people
                    </Text>
                    <Text style={{color: 'teal'}}>
                      Only 1 table can be selected per booking, please choose a
                      table with a reasonable number of seats.
                    </Text>
                  </View>
                  <View style={{flex: 2}}>
                    <TouchableOpacity
                      style={styles.buttonQuantity}
                      onPress={increment}>
                      <Text style={styles.buttonTextQtt}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{people}</Text>
                    <TouchableOpacity
                      style={styles.buttonQuantity}
                      onPress={decrement}>
                      <Text style={styles.buttonTextQtt}>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.timesContainer}>
                  <Text style={styles.mealTimeText}>
                    <Ionicons
                      color="black"
                      size={25}
                      name="time-outline"></Ionicons>{' '}
                    Meal times
                  </Text>
                  <Text style={{color: 'teal'}}>
                    The maximum time that can be booked is 30 minutes before the
                    end of the shift.
                  </Text>
                  <View style={styles.mealTimes}>
                    {dataTime.map(e => {
                      return (
                        <TouchableOpacity
                          key={e._id}
                          onPress={() => {
                            handleClick(e.shift);
                          }}
                          style={[
                            e.shift === clicked
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
                  <View>
                    <View style={styles.tableAvaiText}>
                      <Ionicons
                        style={styles.note}
                        size={30}
                        name="restaurant-outline"></Ionicons>
                      <Text style={styles.note}>
                        Reserved:{' '}
                        {
                          dataTables.tables
                            .filter(e => e.shift === clicked)
                            .filter(
                              e =>
                                e.status.filter(
                                  e =>
                                    e.dateOrder ===
                                    moment(date).format('DD/MM/YYYY'),
                                ).length,
                            ).length
                        }{' '}
                        / {dataTables.tables.length / 3}
                      </Text>
                    </View>
                    <View style={styles.tables}>
                      {dataTables.tables
                        .filter(e => e.shift === clicked)
                        .filter(
                          e => e.maxPeople >= people && e.minPeople <= people,
                        )
                        .map(e => {
                          return (
                            <TouchableOpacity
                              onPress={() => handleChoose(e.name, e._id)}
                              style={styles.table}
                              key={e._id}>
                              {e.status.length > 0 &&
                              e.status.map(i => i.dateOrder)[0] ===
                                moment(date).format('DD/MM/YYYY') ? (
                                <>
                                  <CheckBox
                                    style={{alignSelf: 'center'}}
                                    disabled={true}
                                    value={true}
                                  />
                                  <Text style={styles.tableName}>{e.name}</Text>
                                </>
                              ) : (
                                <>
                                  <CheckBox
                                    style={{alignSelf: 'center'}}
                                    disabled={false}
                                    value={chooseId === e.name}
                                    onChange={() => handleChoose(e.name, e._id)}
                                  />
                                  <Text style={styles.tableNameAvai}>
                                    {e.name}
                                  </Text>
                                </>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
          <SafeAreaView>
            <TouchableOpacity
              style={styles.buttonBooking}
              onPress={onComfirmPress}>
              <Text style={styles.buttonDone}>Comfirm</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.backgroundModal}>
              <View style={styles.modalView}>
                <Image
                  style={styles.logo}
                  source={require('../assets/logo.png')}></Image>
                <Text style={styles.mealTimeText}>Confirm information</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Ionicons
                    size={40}
                    color="red"
                    name="close-circle-outline"></Ionicons>
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="restaurant-outline"></Ionicons>
                    <Text style={styles.infoText}>{item.restaurantName}</Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="location-outline"></Ionicons>
                    <Text style={styles.infoText}>
                      {item.restaurantAddress}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="calendar-outline"></Ionicons>
                    <Text style={styles.infoText}>
                      {moment(date).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="time-outline"></Ionicons>
                    <Text style={styles.infoText}>
                      {dataTime[clicked - 1].timeStart} -{' '}
                      {dataTime[clicked - 1].timeEnd}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="grid-outline"></Ionicons>
                    <Text style={styles.infoText}>{chooseId}</Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="people-outline"></Ionicons>
                    <Text style={styles.infoText}>{people}</Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="person-circle-outline"></Ionicons>
                    <Text style={styles.infoText}>{name}</Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons
                      color="black"
                      size={30}
                      name="call-outline"></Ionicons>
                    <Text style={styles.infoText}>{number}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleOrder} style={styles.button}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Start Booking</Text>
                    {loading ? (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        style={{marginLeft: 10}}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    flex: 1,
  },
  description: {
    width: '100%',
  },
  descriptionText: {
    fontSize: 23,
    fontWeight: '700',
    color: 'black',
  },
  dateContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxHeight: 135,
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
  mealTimeText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    color: 'black',
  },
  mealTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  buttonTime: {
    padding: 8,
    backgroundColor: 'silver',
    borderRadius: 5,
    backgroundColor: 'gray',
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: '800',
    color: 'white',
  },
  buttonActive: {
    padding: 8,
    backgroundColor: 'gray',
    alignSelf: 'center',
    borderRadius: 5,
    backgroundColor: 'black',
    paddingHorizontal: 10,
  },
  peopleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    height: 105,
    marginVertical: 15,
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
  note: {
    color: 'teal',
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  tables: {
    flexDirection: 'row',
    rowGap: 5,
    columnGap: 5,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  tableAvaiText: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginTop: 5,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: 69,
  },
  tableName: {
    textAlign: 'center',
    fontWeight: '800',
  },
  tableNameAvai: {
    fontWeight: '800',
    color: 'teal',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  buttonBooking: {
    width: '90%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 5,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonDone: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalView: {
    zIndex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    height: height - 80,
  },
  button: {
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    backgroundColor: '#228B22',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  info: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  infoText: {
    fontSize: 15,
    color: 'black',
    fontWeight: '700',
    textAlignVertical: 'center',
    marginHorizontal: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logo: {
    width: 60,
    height: 55,
    borderRadius: 5,
    marginRight: 10,
    zIndex: 1,
  },
  buttonQuantity: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 1,
  },
  buttonTextQtt: {
    fontWeight: '800',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: 'black',
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
  timesContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxHeight: 700,
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
  backgroundModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
