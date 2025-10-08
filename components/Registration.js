import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth, createUserWithEmailAndPassword  } from '../Firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error ? <Text style={{color:'red'}}>{error}</Text> : null}

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Create account" onPress={handleRegister} />

      <Text style={{marginTop:12}}>After registering you will be logged in automatically.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:22, marginBottom:12, textAlign:'center' },
  input: { borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:6 }
});
