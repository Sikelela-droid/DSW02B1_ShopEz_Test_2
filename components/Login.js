import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../Firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill email & password');
      return;
    }
    try {
      await auth.signInWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShopEZ - Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }}>
        <Text style={{ color: 'blue' }}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:22, marginBottom:12, textAlign:'center' },
  input: { borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:6 },
  error: { color:'red', marginBottom:10 }
});
