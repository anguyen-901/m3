import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined,
  );
  const params = useLocalSearchParams();

  const markerLatitude = params.latitude
    ? parseFloat(params.latitude as string)
    : undefined;
  const markerLongitude = params.longitude
    ? parseFloat(params.longitude as string)
    : undefined;

  useEffect(() => {
    (async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {markerLatitude !== undefined && markerLongitude !== undefined && (
            <Marker
              coordinate={{
                latitude: markerLatitude,
                longitude: markerLongitude,
              }}
            />
          )}
        </MapView>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
