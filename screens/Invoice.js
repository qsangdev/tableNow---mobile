import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Invoice = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [dataOrderMenu, setDataOrderMenu] = useState([]);
  const [method, setMethod] = useState('cash');
  const [orderMenuID, setOrderMenuID] = useState('');

  const resID = route.params.resID;
  const staffID = route.params.staffID;
  const orderID = route.params.orderID;
  const tableName = route.params.tableName;
  const tableID = route.params.tableID;
  const dataMenu = route.params.dataMenu;

  const getDataOrderMenu = async () => {
    setLoading(true);
    await axios
      .get(`https://tablenow.onrender.com/api/order-menu/get-details/${orderID}`)
      .then(res => {
        if (res.data.status === 'ERR') {
          return alert(res.data.message);
        } else {
          setLoading(false);
          setOrderMenuID(res.data.data[0]._id);

          const total = res.data.data[0].ordered.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.dishID === curr.dishID);
            if (index !== -1) {
              acc[index].quantity += curr.quantity;
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

          const newBill = total.map(e => {
            return {
              ...e,
              dishName: dataMenu.filter(i => i._id === e.dishID)[0].dishName,
              dishPrice: dataMenu.filter(i => i._id === e.dishID)[0].dishPrice,
              dishDiscount: dataMenu.filter(i => i._id === e.dishID)[0]
                .dishDiscount,
            };
          });

          const finalBill = newBill.map(e => {
            return {
              ...e,
              total:
                (e.dishPrice - (e.dishDiscount / 100) * e.dishPrice) *
                e.quantity,
            };
          });
          setDataOrderMenu(finalBill);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getDataOrderMenu();
  }, []);

  const handlePay = async () => {
    setLoading(true);
    await axios
      .post('https://tablenow.onrender.com/api/bill/create', {
        tableID: tableID,
        staffID: staffID,
        restaurantID: resID,
        orderID: orderID,
        orderList: dataOrderMenu,
        paymentMethod: method,
        totalPay: dataOrderMenu.reduce((acc, obj) => {
          return acc + obj.total;
        }, 0),
      })
      .then(async () => {
        await axios.delete(
          `https://tablenow.onrender.com/api/order-menu/delete/${orderMenuID}`,
        );
        await axios.put(`https://tablenow.onrender.com/api/order/update/${orderID}`, {
          completed: true,
        });
        await axios
          .post(`https://tablenow.onrender.com/api/table/delete-status/${resID}`, {
            tables: [
              {
                _id: tableID,
                orderID: orderID
              },
            ],
          })
          .then(() => {
            setLoading(false);
            navigation.navigate('Tables');
          });
      })
      .catch(err => console.log(err));
  };

  const handleRemove = id => {
    Alert.alert('Are you sure?', 'Remove this dish off the bill', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () =>
          await axios
            .post(
              `https://tablenow.onrender.com/api/order-menu/delete-dish/${orderID}`,
              {
                ordered: [
                  {
                    dishID: id,
                  },
                ],
              },
            )
            .then(() => getDataOrderMenu()),
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
        <>
          <View style={styles.backgroundModal}>
            <View style={styles.invoiceContainer}>
              <View style={styles.invoiceHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('Tables')}>
                  <Ionicons
                    size={40}
                    color="maroon"
                    name="arrow-back-circle-outline"></Ionicons>
                </TouchableOpacity>
                <Text
                  style={{
                    textAlignVertical: 'center',
                    fontWeight: '700',
                    fontSize: 20,
                    color: 'black',
                  }}>
                  {tableName}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Payment Comfirm',
                      'This action cannot be undone',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => handlePay()},
                      ],
                    )
                  }>
                  <Ionicons
                    size={40}
                    color="maroon"
                    name="checkmark-done-circle"></Ionicons>
                </TouchableOpacity>
              </View>
              <FlatList
                data={dataOrderMenu}
                renderItem={({item}) => {
                  return (
                    <View style={styles.invoiceItem}>
                      <Text style={styles.invoiceTitle}>{item.dishName}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '80%',
                          }}>
                          <Text style={styles.invoicePrice}>
                            ${item.dishPrice}
                          </Text>
                          <Text style={styles.invoicePrice}>
                            -{item.dishDiscount}%
                          </Text>
                          <Text style={styles.invoiceQuantity}>
                            x{item.quantity}
                          </Text>
                          <Text style={styles.totalText}>${item.total}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemove(item.dishID)}
                        style={{
                          position: 'absolute',
                          right: 5,
                          bottom: 20,
                          zIndex: 1,
                        }}>
                        <Ionicons
                          size={30}
                          name="remove-circle-outline"
                          style={{color: 'maroon', fontWeight: '800'}}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={item => item._id}
                style={styles.invoiceList}
              />

              <Picker
                mode="dropdown"
                selectedValue={method}
                onValueChange={itemValue => setMethod(itemValue)}>
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Banking" value="banking" />
                <Picker.Item label="ATM" value="atm" />
              </Picker>

              <Text style={styles.totalText}>
                Total: $
                {dataOrderMenu.reduce((acc, obj) => {
                  return acc + obj.total;
                }, 0)}
              </Text>
              <View style={styles.invoiceFooter}>
                <QRCode value={Math.random().toString()} size={100} />
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default Invoice;

const styles = StyleSheet.create({
  invoiceContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  invoiceHeader: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlignVertical: 'center',
    width: '100%',
  },
  invoiceList: {
    flex: 1,
  },
  invoiceItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexWrap: 'wrap',
  },
  invoicePrice: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  invoiceQuantity: {
    fontSize: 14,
    color: '#777',
    marginHorizontal: 5,
    fontWeight: '600',
  },
  invoiceSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginRight: 10,
  },
  invoiceFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
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
