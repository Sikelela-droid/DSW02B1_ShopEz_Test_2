import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { auth, database } from '../Firebase';
import CartIcon from '../components/CartIcon';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <CartIcon navigation={navigation} count={0} /> // count naive - beginner
    });
  }, [navigation]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setErr('');
    try {
      const resp = await fetch('https://fakestoreapi.com/products');
      const json = await resp.json();
      setProducts(json);
      setDisplayed(json);
    } catch (e) {
      setErr('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await fetch('https://fakestoreapi.com/products/categories');
      const json = await resp.json();
      setCategories(['all', ...json]);
    } catch (e) {
      // ignore
    }
  };

  const filterByCategory = (cat) => {
    if (cat === 'all') {
      setDisplayed(products);
    } else {
      setDisplayed(products.filter(p => p.category === cat));
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <View style={{flex:1,justifyContent:'center'}}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <View style={{padding:8, flexDirection:'row', flexWrap:'wrap'}}>
        {categories.map(c => (
          <TouchableOpacity key={c} onPress={() => filterByCategory(c)} style={{padding:8, backgroundColor:'#ddd', marginRight:8, marginBottom:8, borderRadius:6}}>
            <Text>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {err ? <Text style={{color:'red', textAlign:'center'}}>{err}</Text> : null}

      <FlatList
        data={displayed}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <Text numberOfLines={1} style={{ fontWeight:'bold' }}>{item.title}</Text>
              <Text>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={{padding:12}}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection:'row', padding:10, borderBottomWidth:1, borderColor:'#eee', alignItems:'center' },
  image: { width:60, height:60, resizeMode:'contain' }
});
