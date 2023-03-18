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
import React, {useState} from 'react';
import {Party} from '../assets';
import DatePicker from 'react-native-date-picker';
import NumericInput from 'react-native-numeric-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';


const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const Booking = ({route, navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tables, setTables] = useState(1);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const today = new Date();

  const item = route.params.item;

  const [clicked, setClicked] = useState(1);

  const handleClick = id => {
    setClicked(id);
  };

  const onComfirmPress = () => {
    if (name === '') {
      return alert('Please enter your name');
    } else if (number === '') {
      return alert('Please enter your number..');
    } else {
      setModalVisible(!modalVisible);
    }
  };

  const sendRequest = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('tables')) || [];
      const newOrder = {
        id: uuidv4(),
        name: name,
        number: number,
        date: moment(date).format('DD/MM/YYYY'),
        time: item.times.shift[clicked - 1].time,
        restaurant: item.name,
        location: item.location,
        people: tables,
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
            <View>
              <TextInput
                style={styles.input}
                value={name}
                placeholder="Name .."
                onChangeText={e => setName(e)}
              />
              <TextInput
                value={number}
                style={styles.input}
                placeholder="Phone number .."
                keyboardType="numeric"
                onChangeText={e => setNumber(e)}
              />
            </View>
            <View style={styles.date}>
              <Text style={styles.mealTimeText}>
                Time: {moment(date).format('DD/MM/YYYY')}
              </Text>
              <Button
                color="#483D8B"
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
            <View style={styles.people}>
              <Text style={styles.mealTimeText}>How many people? (*) :</Text>

              <NumericInput
                type="plus-minus"
                value={tables}
                minValue={1}
                maxValue={15}
                totalWidth={100}
                totalHeight={35}
                onChange={value => setTables(value)}
              />
              <Text>1 table with maximum of 4 seats for 4 adults</Text>
            </View>
            <Text style={styles.mealTimeText}>Meal times :</Text>
            <View style={styles.mealTimes}>
              {item.times.shift.map(e => {
                return (
                  <TouchableOpacity
                    key={e.id}
                    onPress={() => handleClick(e.id)}
                    style={[
                      e.id === clicked
                        ? styles.buttonActive
                        : styles.buttonTime,
                    ]}>
                    <Text style={styles.buttonText}>
                      <Ionicons
                        color="white"
                        size={15}
                        name="time-outline"></Ionicons>{' '}
                      {e.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.tableContainer}>
              {item.times.shift.map(e => {
                return (
                  e.id === clicked && (
                    <View style={styles.tables} key={e.id}>
                      <View style={styles.tableAvaiText}>
                        <Ionicons
                          style={styles.note}
                          size={30}
                          name="restaurant-outline"></Ionicons>
                        <Text style={styles.note}>
                          Available:{' '}
                          {
                            e.tables.filter(e => e.status === 'available')
                              .length
                          }{' '}
                          / {e.tables.length}
                        </Text>
                      </View>
                      {/* {e.tables.map(e => {
                        return (
                          <TouchableOpacity style={styles.table} key={e.id}>
                            {e.status === 'available' ? (
                              <CheckBox
                                disabled={true}
                                value={true}
                                style={styles.checkbox}
                              />
                            ) : (
                              <CheckBox
                                disabled={true}
                                value={false}
                                style={styles.checkbox}
                              />
                            )}
                            <Text style={styles.tableName}>{e.name}</Text>
                          </TouchableOpacity>
                        );
                      })} */}
                    </View>
                  )
                );
              })}
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
              <Ionicons color="black" size={30} name="time-outline"></Ionicons>
              <Text style={styles.infoText}>
                {item.times.shift[clicked - 1].time}
              </Text>
            </View>
            <View style={styles.info}>
              <Ionicons
                color="black"
                size={30}
                name="people-outline"></Ionicons>
              <Text style={styles.infoText}>{tables}</Text>
            </View>
            <View style={styles.info}>
              <Ionicons
                color="black"
                size={30}
                name="person-circle-outline"></Ionicons>
              <Text style={styles.infoText}>{name}</Text>
            </View>
            <View style={styles.info}>
              <Ionicons color="black" size={30} name="call-outline"></Ionicons>
              <Text style={styles.infoText}>{number}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={sendRequest} style={styles.button}>
            <Text style={styles.textStyle}>Start Booking</Text>
          </TouchableOpacity>
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
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    borderColor:'#483D8B'
  },
  description: {
    width: '100%',
  },
  descriptionText: {
    fontSize: 23,
    fontWeight: '700',
    color: 'black',
  },
  date: {
    marginVertical: 15,
  },
  mealTimeText: {
    fontSize: 18,
    fontWeight: '500',
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
    backgroundColor: '#6A5ACD',
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
    backgroundColor: '#483D8B',
  },
  people: {
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  note: {
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  tables: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tableAvaiText: {
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    marginLeft: 5,
    padding: 5,
    borderColor: '#483D8B',
  },
  table: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  tableName: {
    alignSelf: 'center',
    fontWeight: '800',
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
    marginBottom: 10,
    backgroundColor: '#483D8B',
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
    borderRadius: 20,
    padding: 20,
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
});
