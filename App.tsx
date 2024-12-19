import React, {useEffect, useState} from 'react';
import {View, Button, Text, Alert} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: string;
}

const App = () => {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // Configuración inicial de BackgroundGeolocation
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      notification: {
        title: 'Rastreo activo',
        text: 'Rastreando ubicación en segundo plano',
      },
    });

    // Listener para obtener ubicaciones
    const locationListener = BackgroundGeolocation.onLocation(
      position => {
        console.log('📍 Ubicación:', position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
      },
      error => {
        console.error('Error al obtener ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
      },
    );

    return () => {
      locationListener.remove(); // Elimina listener al desmontar el componente
      BackgroundGeolocation.removeAllListeners();
    };
  }, []);

  const startTracking = () => {
    setTracking(true);
    BackgroundGeolocation.start();
  };

  const stopTracking = () => {
    setTracking(false);
    BackgroundGeolocation.stop();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Button
        title={tracking ? 'Detener Tracking' : 'Iniciar Tracking'}
        onPress={tracking ? stopTracking : startTracking}
      />
      {location && (
        <Text style={{marginTop: 20}}>
          Última ubicación:{'\n'}
          Lat: {location.latitude}
          {'\n'}
          Lon: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default App;
