import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DATA from '../hardData/DATA';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Invoice = ({navigation, route}) => {
  const tableName = route.params.tableName;
  const onGoBack = route.params.onGoBack;
  const [invoiceData, setInvoiceData] = useState([]);
  console.log(tableName);
  useEffect(() => {
    const getInvoiceData = async () => {
      let keys = await AsyncStorage.getAllKeys();
      let values = await AsyncStorage.multiGet(keys);
      let invoiceItems = [];
      let total = 0;
      values.forEach(value => {
        let [key, numValue] = value;
        let [table, item] = key.split('_');
        if (table === tableName && numValue > 0) {
          let menuItem = DATA[0].menu.find(e => e.id == item);
          console.log(menuItem, item);
          let subtotal = menuItem.price * numValue;
          total += subtotal; // add the subtotal to the total
          invoiceItems.push({
            id: item,
            title: menuItem.title,
            price: menuItem.price,
            quantity: numValue,
            subtotal: subtotal,
          });
        }
      });
      setInvoiceData([...invoiceItems, {id: 'total', total: total}]); // set the invoice data with the invoice items and the total amount
    };
    getInvoiceData();
  }, [tableName]); // run the effect when the table name changes

  const renderItem = ({item}) => {
    if (item.id === 'total') {
      // if the item is the total amount
      console.log(invoiceData);
      return <Text style={styles.totalText}>Total: ${item.total}</Text>;
    } else {
      return (
        <View style={styles.invoiceItem}>
          <Text style={styles.invoiceTitle}>{item.title}</Text>
          <Text style={styles.invoicePrice}>${item.price}</Text>
          <Text style={styles.invoiceQuantity}>x{item.quantity}</Text>
          <Text style={styles.invoiceSubtotal}>${item.subtotal}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.invoiceContainer}>
      <View style={styles.invoiceHeader}>
        <TouchableOpacity
          onPress={() => {
            {
              navigation.navigate('Tables');
              onGoBack();
            }
          }}>
          <Ionicons
            size={30}
            color="maroon"
            name="arrow-back-circle-outline"></Ionicons>
        </TouchableOpacity>
        <Text style={styles.invoiceTitle}>Table {tableName}</Text>
        <TouchableOpacity
          onPress={() => {
            {
            }
          }}>
          <Ionicons
            size={30}
            color="maroon"
            name="checkmark-done-circle-outline"></Ionicons>
        </TouchableOpacity>
      </View>
      <FlatList
        data={invoiceData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.invoiceList}
      />
      <View style={styles.invoiceFooter}>
        <QRCode value={Math.random().toString()} size={100} />
      </View>
    </View>
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
    textAlign: 'center',
  },
  invoiceList: {
    flex: 1,
  },
  invoiceItem: {
    flexDirection: 'row',
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
  },
  invoiceQuantity: {
    fontSize: 14,
    color: '#777',
    marginHorizontal: 5,
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
    padding: 10,
  },
  invoiceFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
