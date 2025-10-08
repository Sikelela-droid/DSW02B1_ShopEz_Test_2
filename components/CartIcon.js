import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function CartIcon({ navigation, count = 0 }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginRight: 12 }}>
      <View style={styles.container}>
        <Text>Cart</Text>
        <Text style={{ fontSize:12, color:'#333' }}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center'
  }
})

