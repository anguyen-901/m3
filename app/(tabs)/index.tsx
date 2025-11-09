import { CameraView, Camera, CameraType, CameraMode } from "expo-camera";
import type { CameraCapturedPicture } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../../components/header";

export default function CameraScreen() {
  const [cameraPermission, setCameraPermission] = useState<boolean | undefined>(
    undefined,
  ); //State variable for camera permission
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | undefined
  >(undefined); //State variable for media library permission
  const [micPermission, setMicPermission] = useState<boolean | undefined>(
    undefined,
  ); //// state variable for microphone permission
  const [cameraMode] = useState<CameraMode>("picture"); //State variable for picture or video. By default it will be for picture
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(); //After picture is taken this state will be updated with the picture
  const [zoom, setZoom] = useState(0); //State to control the digital zoom
  let cameraRef = useRef<CameraView>(null); //Creates a ref object and assigns it to the variable cameraRef.
  const router = useRouter();

  //When the screen is rendered initially the use effect hook will run and check if permission is granted to the app to access the Camera, Microphone and Media Library.
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: micStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setCameraPermission(cameraStatus === "granted");
      setMediaLibraryPermission(mediaStatus === "granted");
      setMicPermission(micStatus === "granted");
    })();
  }, []);

  //If permissions are not granted app will have to wait for permissions
  if (
    cameraPermission === undefined ||
    mediaLibraryPermission === undefined ||
    micPermission === undefined
  ) {
    return <Text>Request Permissions....</Text>;
  } else if (!cameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings
      </Text>
    );
  }

  //Function to toggle between back and front camera
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  //Function to capture picture
  let takePic = async () => {
    //Declares takePic as an asynchronous function using the async keyword.
    let options = {
      quality: 1, //Specifies the quality of the captured image. A value of 1 indicates maximum quality, whereas lower values reduce quality (and file size).
      base64: true, //Includes the image's Base64 representation in the returned object. This is useful for embedding the image directly in data URIs or for immediate upload to servers.
      exif: false, //Disables the inclusion of EXIF metadata in the image (e.g., location, device info). Setting this to true would include such metadata.
    };

    let newPhoto = await cameraRef.current?.takePictureAsync(options); //Refers to the camera instance (set using a ref in React). This is used to call methods on the camera.
    //Captures an image with the specified options and returns a promise that resolves to an object containing: URI and Base64 string and/or EXIF data, based on the provided options.
    setPhoto(newPhoto); //Update photo state with the new photo object
  };

  //After the picture is captured it will be displayed to the user and the user will also be provided the option to save or discard the image
  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.imageContainer}>
        <Header />
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <View style={styles.btnContainer}>
          {mediaLibraryPermission ? (
            <TouchableOpacity style={styles.btn} onPress={savePhoto}>
              <Ionicons name="save-outline" size={30} color="black" />
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setPhoto(undefined)}
          >
            <Ionicons name="trash-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  //We will design the camera UI first
  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        mode={cameraMode}
        zoom={zoom}
      >
        <Slider
          style={{
            width: "100%",
            height: 40,
            position: "absolute",
            top: "75%",
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="cyan"
          maximumTrackTintColor="white"
          value={zoom}
          onValueChange={(value) => setZoom(value)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {/*<View style={styles.mapContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/MapScreen")}
          >
            <Ionicons name="map-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>*/}
        <View style={styles.shutterContainer}>
          {cameraMode === "picture" ? (
            <TouchableOpacity style={styles.button} onPress={takePic}>
              <Ionicons name="aperture-outline" size={40} color="white" />
            </TouchableOpacity>
          ) : undefined}
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
  },
  shutterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  mapContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "center",
    margin: 10,
    elevation: 5,
  },
  imageContainer: {
    height: "95%",
    width: "100%",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: "auto",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
