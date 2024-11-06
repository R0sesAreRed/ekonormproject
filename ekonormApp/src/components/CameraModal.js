import * as React from "react";
import { TouchableOpacity, Modal, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6.js";
import { Camera, CameraView } from "expo-camera";
import { useState, useEffect, useRef } from "react";

export default CameraModal = ({
  visible,
  onClose,
  openPreview,
  photos,
  setPhotos,
  setPhotoNo,
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync();
      let updatedPhotos = [...photos, photo.uri];
      setPhotos(updatedPhotos);
      onClose();
      openPreview();
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
          //flashMode={Camera.Constants.FlashMode.on}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => takePicture()}
            >
              <Icon name={"circle"} size={80} color="white"></Icon>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 0.1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
