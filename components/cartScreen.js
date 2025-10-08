import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { auth, database } from '../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  const [cart, setCart] = useState({ items: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ref;
    const loadLocalFallback = async () => {
      try {
        const raw = await AsyncStorage.getItem(`@shopez_cart_${uid}`);
        if (raw) {
          setCart(JSON.parse(raw));
        }
      } catch (e) {}
      setLoading(false);
    };

    if (!uid) return;

    ref = database.ref(`carts/${uid}`);
    ref.on('value', snapshot => {
      const val = snapshot.val();
      if (val) {
        setCart(val);
        AsyncStorage.setItem(`@shopez_cart_${uid}`, JSON.stringify(val));
      } else {
        // if DB empty, try local
        loadLocalFallback();
      }
      setLoading(false);
    }, err => {
      // on error use local fallback
      loadLocalFallback();
    });

    return () => {
      if (ref) ref.off();
    };
  }, []);

  const changeQty = async (productId, newQty) => {
    if (!uid) return;
    const cartRef = database.ref(`carts/${uid}`);
    const copy = { ...(cart || { items: {} }) };
    if (!copy.items) copy.items = {};
    if (!copy.items[productId]) return;
    const qty = parseInt(newQty) || 0;
    if (qty <= 0) {
      delete copy.items[productId];
    } else {
      copy.items[productId].qty = qty;
    }
    setCart(copy);
    await cartRef.set(copy);
    await AsyncStorage.setItem(`@shopez_cart_${uid}`, JSON.stringify(copy));
  };

  const removeItem = async (productId) => {
    if (!uid) return;
    const copy = { ...(cart || { items: {} }) };
    if (copy.items && copy.items[productId]) {
      delete copy.items[productId];
    }
    setCart(copy);
    await database.ref(`carts/${uid}`).set(copy);
    await AsyncStorage.setItem(`@shopez_cart_${uid}`, JSON.stringify(copy));
  };

  const calculateTotal = () => {
    const items = cart.items || {};
    let total = 0;
    Object.keys(items).forEach(k => {
      total += (items[k].product.price * items[k].qty);
    });
    return total.toFixed(2);
  };

  if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading...</Text></View>;

  const itemArray = Object.keys(cart.items || {}).map(k => ({ id: k, ...cart.items[k] }));

  return (
    <View style={{flex:1, padding:12}}>
      {itemArray.length === 0 ? <Text>Your cart is empty</Text> : (
        <FlatList
          data={itemArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection:'row', marginBottom:12, borderBottomWidth:1, borderColor:'#eee', paddingBottom:8 }}>
              <Image source={{ uri: item.product.image }} style={{ width:60, height:60, resizeMode:'contain' }} />
              <View style={{ flex:1, paddingLeft:8 }}>
                <Text numberOfLines={1}>{item.product.title}</Text>
                <Text>${item.product.price} x {item.qty} = ${(item.product.price * item.qty).toFixed(2)}</Text>
                <View style={{ flexDirection:'row', alignItems:'center', marginTop:8 }}>
                  <Text>Qty:</Text>
                  <TextInput value={String(item.qty)} onChangeText={(text) => changeQty(item.product.id, text)} keyboardType="numeric" style={{ borderWidth:1, marginLeft:8, padding:6, width:80 }} />
                  <TouchableOpacity onPress={() => removeItem(item.product.id)} style={{ marginLeft:12 }}>
                    <Text style={{ color:'red' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <View style={{ marginTop:12 }}>
        <Text style={{ fontSize:18 }}>Total: ${calculateTotal()}</Text>
      </View>

      <View style={{ marginTop:12 }}>
        <Button title="Checkout (dummy)" onPress={() => Alert.alert('Not implemented')} />
      </View>
    </View>
  );
}
