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
  const [rotation, setRotation] = useState(0);

  removePhoto = async () => {
    try {
      //console.debug("delete", photos[photoNo].uri);
      await FileSystem.deleteAsync(photos[photoNo].uri.toString());
      setPhotos((photos) => {
        return photos.filter((_, i) => i !== photoNo);
      });
      if (photos.length > 0) {
        if (photoNo == photos.length - 1) {
          //console.debug("deleting last photo");
          setPhotoNo(photoNo - 1);
        }
        if (photos.length == 1) {
          //console.debug("deleting first photo");
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

  // useEffect(() => {
  //   //console.debug("photoNo changed");
  //   if (photos.length > 0) {
  //     //console.debug("photos.length > 0");
  //     const photo = photos[photoNo];
  //     setIsLandscape(photo?.exif?.width > photo?.exif?.height);
  //     // console.debug(
  //     //   "isLandscape",
  //     //   photo.exif?.width > photo.exif?.height,
  //     //   photo.exif?.PixelXDimension,
  //     //   photo.exif
  //     // );
  //   }
  // }, [photoNo]);

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      {visible && photos.length > 0 && (
        <View style={styles.modalContent}>
          <ImageBackground
            source={{ uri: photos[photoNo]?.uri }}
            style={[
              styles.photo,
              //isLandscape ? styles.horizontalPhoto : styles.verticalPhoto,
            ]}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.buttonContainerTop}>
              <TouchableOpacity
                style={styles.button.left}
                onPress={() => onClose()}
              >
                <Icon name={"check"} size={30} color="red"></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button.right}
                onPress={() => removePhoto()}
              >
                <Icon name={"trash"} size={30} color="red"></Icon>
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
                  <Icon name={"angle-left"} size={30} color="red"></Icon>
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
                  <Icon name={"angle-right"} size={30} color="red"></Icon>
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
    resizeMode: "contain",
    backgroundColor: "black",
    //transform: [{ rotate: "-90deg" }],
  },
  rotatedImage: {
    transform: [{ rotate: "-90deg" }],
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
  horizontalPhoto: {
    width: "100%",
    height: "50%", // Adjust the height to display as a strip in the middle
    alignSelf: "center",
  },
  verticalPhoto: {
    width: "100%",
    height: "100%",
  },
});
