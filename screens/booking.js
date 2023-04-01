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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Party} from '../assets';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const Booking = ({route, navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [people, setPeople] = useState(0);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [checkTime, setCheckTime] = useState(false);

  const [chooseId, setChooseId] = useState(0);
  const handleChoose = id => {
    setChooseId(id);
  };

  const today = new Date();

  const item = route.params.item;

  const [clicked, setClicked] = useState(1);

  // useEffect(() => {
  //   checkAvailableTable();
  // }, [available]);

  const maxPeople = Math.max(...item.shift[0].tables.map(e => e.maxPeople));

  function increment() {
    //setCount(prevCount => prevCount+=1);
    setPeople(function (prevCount) {
      if (prevCount < maxPeople) return (prevCount += 1);
      else {
        return prevCount;
      }
    });
  }

  function decrement() {
    setPeople(function (prevCount) {
      if (prevCount > 1) {
        return (prevCount -= 1);
      } else {
        return (prevCount = 0);
      }
    });
  }

  const handleClick = id => {
    // checkAvailableTable();
    checkRealTime();
    setClicked(id);
    setPeople(0);
  };

  const onComfirmPress = () => {
    if (name === '') {
      return alert('Please enter your name');
    } else if (number === '') {
      return alert('Please enter your number..');
    } else if (people === 0) {
      return alert('Please choose number of people..');
    } else if (chooseId === 0) {
      return alert('Please choose your table!');
    } else if (checkTime === false) {
      return alert('The reservation time has passed');
    } else if (number.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      return setModalVisible(!modalVisible);
    } else {
      alert('Phone number is not in the correct format!');
    }
  };

  // const checkAvailableTable = () => {
  //   const check = item.shift[clicked - 1].tables.filter(
  //     e => e.status === 'unavailable',
  //   ).length;
  //   setAvailable(item.shift[clicked - 1].tables.length - check);
  //   if (check < item.shift[clicked - 1].tables.length) {
  //     return setCheckTable(true);
  //   } else {
  //     setCheckTable(false);
  //   }
  // };

  // const calculatorMaxTables = () => {
  //   const check = item.shift[clicked - 1].tables.filter(
  //     e => e.status === 'unavailable',
  //   ).length;
  //   const allTables = item.shift[clicked - 1].tables.length;
  //   const remainingTables = (allTables - check) * 4;
  //   if (remainingTables < allTables * 4) {
  //     setRemaining(remainingTables);
  //   } else console.log('full slot.');
  // };

  const eatTime = moment(
    moment(date).format('DD/MM') + ' ' + item.shift[clicked - 1].timeStart,
    'DD/MM HH:mm',
  );

  const checkRealTime = () => {
    if (eatTime.isBefore(moment())) {
      setCheckTime(false);
    } else {
      setCheckTime(true);
    }
  };

  // useEffect(() => {
  //   calculatorMaxTables();
  // }, [clicked, remaining]);

  useEffect(() => {
    checkRealTime();
  }, [clicked, checkTime, date]);

  // useEffect(() => {
  //   checkAvailableTable();
  // }, [clicked]);

  const sendRequest = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('tables')) || [];
      const newOrder = {
        id: uuidv4(),
        name: name,
        number: number,
        date: moment(date).format('DD/MM/YYYY'),
        time: item.shift[clicked - 1].timeStart,
        restaurant: item.name,
        location: item.location,
        people: people,
        tableId: chooseId,
      };
      data.push(newOrder);
      await AsyncStorage.setItem('tables', JSON.stringify(data));
      alert('Booking Success');
      Keyboard.dismiss();
      navigation.navigate('Home');
    } catch (e) {
      console.log(e);
    }
  };

  const autoFillLastInfo = async () => {
    try {
      const data = await AsyncStorage.getItem('tables');
      if (!data || data.length === 0) {
        return console.log('empty');
      } else {
        const allBooked = JSON.parse(data);
        setName(allBooked[allBooked.length - 1].name);
        setNumber(allBooked[allBooked.length - 1].number);
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
              {moment(
                moment(date).format('DD/MM') + ' ' + item.shift[2].timeStart,
                'DD/MM HH:mm',
              ).isBefore(moment()) ? (
                <Text style={{marginBottom: 5, color: 'red'}}>
                  Today's reservation time has passed, please select the next
                  date !
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
                maximumDate={new Date(today.setDate(today.getDate() + 3))}
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
              <View style={styles.mealTimes}>
                {item.shift.map(e => {
                  return (
                    <TouchableOpacity
                      key={e.id}
                      onPress={() => {
                        handleClick(e.id);
                      }}
                      style={[
                        e.id === clicked
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
                      item.shift[clicked - 1].tables.filter(
                        e => e.status === 'unavailable',
                      ).length
                    }{' '}
                    / {item.shift[clicked - 1].tables.length}
                  </Text>
                </View>
                {item.shift.map(e => {
                  return (
                    e.id === clicked && (
                      <View style={styles.tables} key={e.id}>
                        {e.tables.map(e => {
                          return (
                            people === 0 && (
                              <TouchableOpacity style={styles.table} key={e.id}>
                                {e.status === 'unavailable' ? (
                                  <CheckBox disabled={true} value={true} />
                                ) : (
                                  <CheckBox
                                    disabled={false}
                                    value={false}
                                    onValueChange={() =>
                                      alert(
                                        'Please choose number of people first !',
                                      )
                                    }
                                  />
                                )}
                                <Text style={styles.tableName}>{e.name}</Text>
                              </TouchableOpacity>
                            )
                          );
                        })}
                        {e.tables
                          .filter(e => {
                            return (
                              e.maxPeople >= people && people >= e.minPeople
                            );
                          })
                          .map(e => {
                            return (
                              <TouchableOpacity
                                onPress={() => handleChoose(e.name)}
                                style={styles.table}
                                key={e.id}>
                                {e.status === 'unavailable' ? (
                                  <>
                                    <CheckBox
                                      disabled={true}
                                      value={true}
                                      style={styles.checkbox}
                                    />
                                    <Text style={styles.tableName}>
                                      {e.name}
                                    </Text>
                                  </>
                                ) : (
                                  <>
                                    <CheckBox
                                      disabled={false}
                                      value={chooseId === e.name}
                                      onChange={() => handleChoose(e.name)}
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
                    )
                  );
                })}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView>
        <TouchableOpacity style={styles.buttonBooking} onPress={onComfirmPress}>
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
                <Text style={styles.infoText}>{item.name}</Text>
              </View>
              <View style={styles.info}>
                <Ionicons
                  color="black"
                  size={30}
                  name="location-outline"></Ionicons>
                <Text style={styles.infoText}>{item.location}</Text>
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
                  {item.shift[clicked - 1].timeStart} -{' '}
                  {item.shift[clicked - 1].timeEnd}
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
            <TouchableOpacity onPress={sendRequest} style={styles.button}>
              <Text style={styles.textStyle}>Start Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 11,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  tableName: {
    alignSelf: 'center',
    fontWeight: '800',
  },
  tableNameAvai: {
    alignSelf: 'center',
    fontWeight: '800',
    color: 'teal',
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
    marginLeft: 10,
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
    maxHeight: 550,
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
});
