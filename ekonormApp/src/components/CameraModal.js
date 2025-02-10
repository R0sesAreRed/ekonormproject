import * as React from "react";
import { TouchableOpacity, Modal, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6.js";
import { Camera, CameraView } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { manipulateAsync } from "expo-image-manipulator";

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
      let photo = await cameraRef.current.takePictureAsync({ exif: true });
      //let fixedPhoto = await manipulateAsync(photo.uri, [{ rotate: -90 }]);
      let updatedPhotos = [...photos, { uri: photo.uri, exif: photo.exif }];
      setPhotos(updatedPhotos);
      onClose();
      openPreview();
      //alert(photo.exif?.Orientation);
      //console.debug(photo.exif?.Orientation);
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
