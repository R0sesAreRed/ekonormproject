import * as React from "react";
import {
  TouchableOpacity,
  Modal,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome6.js";
import * as FileSystem from "expo-file-system";

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeigth } = Dimensions.get("window");

export default PhotoPreview = ({
  visible,
  onClose,
  photos,
  setPhotos,
  photoNo,
  setPhotoNo,
}) => {
  const [isLandscape, setIsLandscape] = useState(false);

  removePhoto = async () => {
    try {
      await FileSystem.deleteAsync(photos[photoNo]);
      setPhotos((photos) => {
        return photos.filter((_, i) => i !== photoNo);
      });
      if (photos.length > 0) {
        if (photoNo == photos.length - 1) {
          setPhotoNo(photoNo - 1);
        }
        if (photos.length == 1) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  useEffect(() => {
    if (photos.length == 0) {
      onClose();
    }
  }, [photos]);

  useEffect(() => {
    if (photos.length > 0) {
      Image.getSize(photos[photoNo], (width, height) => {
        setIsLandscape(width > height); // Determine orientation
      });
    }
  }, [photoNo]);

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      {visible && photos.length > 0 && (
        <View style={styles.modalContent}>
          <ImageBackground
            source={{ uri: photos[photoNo] }}
            style={styles.photo}
            imageStyle={[styles.imageStyle, isLandscape && styles.rotatedImage]}
          >
            <View style={styles.buttonContainerTop}>
              <TouchableOpacity
                style={styles.button.left}
                onPress={() => onClose()}
              >
                <Icon name={"check"} size={30} color="white"></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button.right}
                onPress={() => removePhoto()}
              >
                <Icon name={"trash"} size={30} color="white"></Icon>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainerBottom}>
              <TouchableOpacity
                style={styles.button.center}
                onPress={() => {
                  setPhotoNo(photoNo > 0 ? photoNo - 1 : 0);
                }}
              >
                {photoNo > 0 && (
                  <Icon name={"angle-left"} size={30} color="white"></Icon>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button.center}
                onPress={() => {
                  setPhotoNo(
                    photoNo < photos.length - 1
                      ? photoNo + 1
                      : photos.length - 1
                  );
                }}
              >
                {photoNo < photos.length - 1 && (
                  <Icon name={"angle-right"} size={30} color="white"></Icon>
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: screenWidth,
    height: screenHeigth,
    marginBottom: 10,
  },
  buttonContainerBottom: {
    flex: 0.1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
  },
  buttonContainerTop: {
    flexDirection: "row",
    position: "absolute",
    top: 20,
  },
  imageStyle: {
    resizeMode: "cover",
  },
  rotatedImage: {
    transform: [{ rotate: "90deg" }],
  },
  button: {
    center: {
      flex: 1,
      alignItems: "center",
    },
    left: {
      flex: 1,
      alignItems: "flex-start",
      marginLeft: 10,
    },
    right: {
      flex: 1,
      alignItems: "flex-end",
      marginRight: 10,
    },
  },
});
