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
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'react-native-get-random-values';
import DATA from '../hardData/DATA';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from 'react-native-numeric-input';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const IMG_WIDTH = width / 2 - 60;

const Tables = ({route, navigation}) => {
  const [clicked, setClicked] = useState(false);
  const [openBooked, setOpenBooked] = useState(false);
  const [tables, setTables] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [tableName, setTableName] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const refesh = navigation.addListener('focus', () => {
      allTables();
    });
    console.log(tables);
    return refesh;
  }, [tables]);

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

  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://bootdey.com/img/Content/avatar/avatar1.png',
              }}
            />

            <Text style={styles.name}>John Smith</Text>
          </View>
        </View> */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => {
              setClicked(!clicked);
            }}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://bootdey.com/img/Content/avatar/avatar1.png',
              }}
            />
            <Text style={styles.buttonText}>John Smith</Text>
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
            <TouchableOpacity style={styles.roundButton}>
              <Text style={styles.buttonText}>Profile</Text>
              <Ionicons
                size={30}
                color={'white'}
                name="person-circle-outline"></Ionicons>
            </TouchableOpacity>
          )}
          {clicked && (
            <TouchableOpacity style={styles.roundButton}>
              <Text style={styles.buttonText}>Log Out</Text>
              <Ionicons
                size={30}
                color={'white'}
                name="log-out-outline"></Ionicons>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tables}>
            <TouchableOpacity
              style={styles.tableAvaiText}
              onPress={() => setOpenBooked(!openBooked)}>
              <Ionicons size={30} name="restaurant-outline"></Ionicons>
              <Text style={styles.note}>
                Reserved:{' '}
                {
                  DATA[0].times.shift[0].tables.filter(
                    e => e.status === 'unavailable',
                  ).length
                }{' '}
                / {DATA[0].times.shift[0].tables.length}
              </Text>
            </TouchableOpacity>
            {DATA[0].times.shift[0].tables.map(e => {
              return (
                <TouchableOpacity
                  style={styles.table}
                  key={e.id}
                  onPress={
                    e.status === 'unavailable'
                      ? () => {
                          setOpenMenu(!openMenu);
                          setTableName(e.name);
                        }
                      : () => {}
                  }>
                  {e.status === 'available' ? (
                    <CheckBox
                      //   disabled={true}
                      value={false}
                      style={styles.checkbox}
                    />
                  ) : (
                    <CheckBox
                      //   disabled={true}
                      value={true}
                      style={styles.checkbox}
                    />
                  )}
                  <Text style={styles.tableName}>{e.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={openMenu}>
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons
                  size={30}
                  color="maroon"
                  name="cash-outline"></Ionicons>
              </TouchableOpacity>
              <Text style={styles.modalText}>Table {tableName}</Text>
              <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>
                <Ionicons
                  size={30}
                  color="maroon"
                  name="close-circle"></Ionicons>
              </TouchableOpacity>
            </SafeAreaView>
            <ScrollView style={styles.modalBox}>
              <View style={styles.menuContainer}>
                {DATA[0].menu.map(e => {
                  return (
                    <View style={styles.menu} key={e.id}>
                      <Image style={styles.menuImage} source={{uri: e.image}} />
                      <Text style={styles.menuItem}>{e.title}</Text>
                      <Text>${e.price}</Text>
                      <NumericInput
                        type="plus-minus"
                        minValue={0}
                        maxValue={64}
                        totalWidth={100}
                        totalHeight={35}
                        onChange={value => console.log(value)}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
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
            <ScrollView style={styles.modalBox}>
              {tables ? (
                tables
                  .filter(x => x.restaurant === 'Green Tangerine')
                  .map(e => {
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
                <Text style={styles.modalText}></Text>
              )}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Tables;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  note: {
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
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
    padding: 2,
    borderColor: 'black',
    width: 120,
    marginRight: 5,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: 54,
    height: 70,
    alignItems: 'center',
  },
  tableName: {
    alignSelf: 'center',
    fontWeight: '800',
  },
  welcomeButton: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 23,
    alignItems: 'center',
    marginTop: 10,
    height: 55,
    marginLeft: 5,
    marginRight: 5,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
  },
  roundButton: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 23,
    alignItems: 'center',
    marginTop: 10,
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
  },
  modalContainer: {
    margin: 5,
    height: 400,
    top: height / 2 - 60,
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
    borderColor: 'black',
    borderWidth: 1,
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
    backgroundColor: 'silver',
    borderRadius: 20,
  },
  itemText: {
    fontSize: 12,
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
});
