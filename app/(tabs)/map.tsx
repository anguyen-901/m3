import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import Header from "../../components/header";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <MapView style={styles.map} />
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
