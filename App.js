import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import fetchPolyfill from 'react-native-fetch-polyfill';

const App = () => {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCepChange = (text) => {
    setCep(text.replace(/\D/g, '')); // Remove caracteres não numéricos
  };

  const buscarEndereco = async () => {
    if (cep.length !== 8) {
      setErrorMessage('CEP inválido. Digite 8 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchPolyfill(`https://viacep.com.br/ws/${cep}/json/`);
      const responseJson = await response.json();

      if (responseJson.erro) {
        setErrorMessage('CEP não encontrado.');
      } else {
        setEndereco(responseJson);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErrorMessage('Erro ao buscar CEP. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de CEP</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        onChangeText={handleCepChange}
        value={cep}
      />

      <Button title="Buscar" onPress={buscarEndereco} />

      {isLoading && <Text style={styles.loading}>Carregando...</Text>}

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {endereco && (
        <View style={styles.endereco}>
          <Text>CEP: {endereco.cep}</Text>
          <Text>Logradouro: {endereco.logradouro}</Text>
          <Text>Complemento: {endereco.complemento}</Text>
          <Text>Bairro: {endereco.bairro}</Text>
          <Text>Cidade: {endereco.localidade}</Text>
          <Text>Estado: {endereco.uf}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3', // Azul primary
  },
  input: {
    height: 40,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2196F3', // Azul primary
    borderRadius: 5,
  },
  button: {
    height: 40,
    margin: 10,
    padding: 10,
    backgroundColor: '#2196F3', // Azul primary
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    marginTop: 10,
    color: '#2196F3', // Azul primary
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
  },
  endereco: {
    marginTop: 20,
  },
});

export default App;
