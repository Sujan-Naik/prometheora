import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import axios from 'axios';

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');

  const load = async () => {
    const res = await axios.get('http://localhost:3000/users');
    setUsers(res.data);
  };

  const add = async () => {
    await axios.post('http://localhost:3000/users', { email });
    setEmail('');
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ marginTop: 60, padding: 20 }}>
      <Text>Create user:</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Add" onPress={add} />
      <Text>Users:</Text>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id.toString()}
        renderItem={({ item }) => <Text>{item.email}</Text>}
      />
    </View>
  );
}