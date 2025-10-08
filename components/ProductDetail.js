import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { auth, database,ref, set, get, child  } from '../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [qty, setQty] = useState('1');
  const user = auth.currentUser;

  useEffect(() => {
    navigation.setOptions({ title: product.title.slice(0, 20) + '...' });
  }, []);

  const addToCart = async () => {
    if (!user) {
      Alert.alert('Not logged in');
      return;
    }
    const uid = user.uid;
    const cartRef = await set(ref(database, `carts/${uid}`), cart);

    try {
      const snapshot = await cartRef.once('value');
      let cart = snapshot.val() || {};
      if (!cart.items) cart.items = {};

      const pid = product.id;
      const toAddQty = parseInt(qty) || 1;
      if (cart.items[pid]) {
        cart.items[pid].qty += toAddQty;
      } else {
        cart.items[pid] = {
          product: {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
          },
          qty: toAddQty
        };
      }

      await cartRef.set(cart); 

      await AsyncStorage.setItem(`@shopez_cart_${uid}`, JSON.stringify(cart));

      Alert.alert('Added to cart!');
    } catch (e) {
      Alert.alert('Error adding to cart', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image_styles} />
      <Text style={{ fontSize:18, fontWeight:'bold', marginTop:12 }}>{product.title}</Text>
      <Text style={{ marginTop:8 }}>{product.description}</Text>
      <Text style={{ marginTop:8, fontSize:16 }}>${product.price}</Text>

      <View style={{ flexDirection:'row', marginTop:12, alignItems:'center' }}>
        <Text>Qty:</Text>
        <TextInput value={qty} onChangeText={setQty} keyboardType="numeric" style={{ borderWidth:1, marginLeft:8, padding:6, width:80 }} />
      </View>

      <View style={{ marginTop:16 }}>
        <Button title="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

    container:{
        flex:1, 
        padding:12
    },
    image_styles: { 
            width:"100%", 
            height:250, 
            resizeMode:'contain' 
    }
});
