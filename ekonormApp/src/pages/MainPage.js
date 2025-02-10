import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6.js";
import React from "react";
import { AppContext } from "../context/context";
import { useContext, useState, useEffect } from "react";
import ReadioButtons from "../components/RadioButtons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { loadWorksheet, persistWorksheet } from "../utils/dataStorage";
import SubstanceSelect from "../components/SubstanceSelect";
import { useNavigate } from "react-router-native";
import CameraModal from "../components/CameraModal";
import PhotoPreview from "../components/PhotoPreview";
import Confirm from "../components/Confirm";

const { width: screenWidth } = Dimensions.get("window");

export default function MainPage() {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [subListVisible, setsubListVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [prewievVisible, setPrewievVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Wybierz typ elementu");
  const [takeNo, setTakeNo] = useState("1");
  const [elementName, setElementName] = useState("");
  const [substance, setSubstance] = useState("");
  const [pid, setpid] = useState("");
  const [fid, setfid] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoNo, setPhotoNo] = useState(0);

  const [confirmNotFullAdd, setconfirmNotFullAdd] = useState(false);
  const [confirmBack, setconfirmBack] = useState(false);
  const [confirmMessage, setconfirmMessage] = useState("");
  const [currProjectWorkType, setCurrProjectWorkType] = useState("");

  const [inputHeight, setInputHeight] = useState(40);
  const [index, setIndex] = useState(0);
  const [worksheetLength, setWorksheetLength] = useState(0);
  const [editedPrev, setEditedPrev] = useState(false);

  const [maxTitleLength, setMaxTitleLength] = useState(0);

  const maxHeight = 200;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const changeButtonTitle = (newTitle) => setButtonTitle(newTitle);
  const subListOpen = () => setsubListVisible(true);
  const subListClose = () => setsubListVisible(false);
  const cameraOpen = () => setCameraVisible(true);
  const cameraClose = () => {
    setCameraVisible(false);
  };
  const prewievOpen = () => {
    setPhotoNo(photos.length);
    setPrewievVisible(true);
  };
  const galleryOpen = () => {
    setPhotoNo(0);
    setPrewievVisible(true);
  };
  const prewievClose = () => setPrewievVisible(false);
  const selectSub = (sub) => {
    setSubstance(sub);
    subListClose();
  };

  const closeNotFullAdd = () => {
    setconfirmNotFullAdd(false);
  };
  const closeConfirmBack = () => {
    setconfirmBack(false);
  };

  useEffect(() => {
    loadWorksheet(context.projectKey).then((res) => {
      let parsedRes = res ? JSON.parse(res) : [];
      context.saveLoadedWorksheet(parsedRes);
      if (parsedRes.length > 0) {
        setTakeNo(
          (
            parseInt(parsedRes[parsedRes.length - 1]["Numer punktu"]) + 1
          ).toString()
        );
        setSubstance(parsedRes[parsedRes.length - 1].Substancja);
        setIndex(parsedRes.length);
        setWorksheetLength(parsedRes.length);
      }
    });
    setMaxTitleLength(screenWidth / 25);
    setCurrProjectWorkType(context.projectWorkType);
  }, [context.projectKey]);

  useEffect(() => {
    if (index <= worksheetLength) setEditedPrev(true);
  }, [takeNo, elementName, pid, fid, buttonTitle, photos, substance]);

  function clearFields() {
    setTakeNo((parseInt(takeNo) + 1).toString());
    setElementName("");
    setpid("");
    setfid("");
    changeButtonTitle("Wybierz element");
    setPhotos([]);
  }

  function dismissKeyboard() {
    if (Platform.OS != "web") {
      Keyboard.dismiss();
    }
    subListClose();
    closeModal();
  }

  // function openKeyboard(referenceRef) {
  //   if (inputRef.current && inputRef.current.isFocused()) {
  //     // Force blur and refocus to open the keyboard
  //     inputRef.current.blur();
  //     setTimeout(() => inputRef.current.focus(), 0);
  //   } else {
  //     inputRef.current.focus();
  //   }
  // }

  const checkFields = () => {
    if (
      takeNo != "" &&
      elementName != "" &&
      (pid != "" || fid != "" || !currProjectWorkType) &&
      buttonTitle != "Wybierz element" &&
      photos.length > 0 &&
      substance != ""
    ) {
      addToJson();
    } else {
      setconfirmMessage(
        "Czy chcesz dodać element z brakującymi wartościami? \n" +
          (photos.length == 0 ? "Zdjęcie\n" : "") +
          (takeNo == "" ? "Numer Ujęcia\n" : "") +
          (elementName == "" ? "Symbol lub nazwa elementu instalacji\n" : "") +
          (pid == "" && fid == "" && currProjectWorkType
            ? "PID lub FID\n"
            : "") +
          (buttonTitle == "Wybierz element" ? "Element\n" : "") +
          (substance == "" ? "Substancja\n" : "")
      );
      setconfirmNotFullAdd(true);
    }
  };

  const confirmBackButton = () => {
    setconfirmMessage(
      "Czy na pewno chcesz wrócić do wyboru projektu?\nNiedodane dane oraz zdjęcia zostaną utracone.\n"
    );
    setconfirmBack(true);
  };

  const confirmBackTrue = () => {
    navigate("/");
  };

  const viewDataPreview = () => {
    navigate("/DataPreview");
  };

  loadSavedPoint = (ind) => {
    const prevRow = context.worksheetJson[ind];
    setTakeNo(prevRow.takeNo.toString());
    setElementName(prevRow.elementName);
    setSubstance(prevRow.substance);
    setpid(prevRow.pid);
    setfid(prevRow.fid);
    changeButtonTitle(prevRow.buttonTitle);
    setPhotos([]);
    setTimeout(() => {
      setEditedPrev(false);
    }, 100);
  };

  saveEditedPoint = async () => {
    if (editedPrev) {
      const newRow = !currProjectWorkType
        ? {
            "Numer punktu": takeNo,
            "Symbol lub nazwa elementu instalacji": elementName,
            Data: dateString,
            "Typ elementu": buttonTitle,
            Substancja: substance,
          }
        : {
            "Numer punktu": takeNo,
            "Symbol lub nazwa elementu instalacji": elementName,
            Data: dateString,
            "Typ elementu": buttonTitle,
            Substancja: substance,
            PID: pid,
            FID: fid,
          };
      const newData = [...context.worksheetJson];
      newData[index] = newRow;
      context.saveLoadedWorksheet(newData);
      persistWorksheet(context.projectKey, newData);

      try {
        if (photos.length == 1) {
          await savePhoto(photos[0].uri, "");
        } else {
          let i = 0;
          photos.forEach(async (photo) => {
            i += 1;
            await savePhoto(photo.uri, "_" + i.toString());
          });
        }
      } catch (e) {
        alert("Błąd w zapisie zdjęcia " + e);
        console.error(e);
      }
    }
  };

  const changePoint = async (ind) => {
    if (index == worksheetLength && ind < worksheetLength) {
      loadSavedPoint(ind);
    }
    if (index < worksheetLength && ind < worksheetLength) {
      loadSavedPoint(ind);
      await saveEditedPoint();
    }
    if (ind == worksheetLength && index < worksheetLength) {
      clearFields();
      await saveEditedPoint();
    }
    setIndex(ind);
  };

  const addToJson = async () => {
    pid != "" ? pid : 0;
    fid != "" ? fid : 0;
    dateString =
      context.date.day +
      "-" +
      (context.date.month + 1) +
      "-" +
      context.date.year +
      " " +
      context.date.hour +
      ":" +
      (context.date.minute < 10
        ? "0" + context.date.minute
        : context.date.minute);
    const newRow = !currProjectWorkType
      ? {
          "Numer punktu": takeNo,
          "Symbol lub nazwa elementu instalacji": elementName,
          Data: dateString,
          "Typ elementu": buttonTitle,
          Substancja: substance,
        }
      : {
          "Numer punktu": takeNo,
          "Symbol lub nazwa elementu instalacji": elementName,
          Data: dateString,
          "Typ elementu": buttonTitle,
          Substancja: substance,
          PID: pid,
          FID: fid,
        };
    context.addRecord(newRow);
    try {
      if (photos.length == 1) {
        await savePhoto(photos[0].uri, "");
      } else {
        let i = 0;
        photos.forEach(async (photo) => {
          i += 1;
          await savePhoto(photo.uri, "_" + i.toString());
        });
      }
    } catch (e) {
      alert("Błąd w zapisie zdjęcia " + e);
      console.error(e);
    }
    setWorksheetLength(worksheetLength + 1);
    clearFields();
    setIndex(index + 1);
  };

  const savePhoto = async (fileUri, fileNo) => {
    console.debug("fileUri", fileUri);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      try {
        const dcimDir = `${FileSystem.documentDirectory}DCIM/`;
        const projectDir = `${dcimDir}${context.projectName}/`;
        const takeNoWith0 =
          takeNo.length == 1
            ? "00" + takeNo
            : takeNo.length == 2
            ? "0" + takeNo
            : takeNo;
        console.debug("takeNoWith0", takeNoWith0);
        const newUri = `${projectDir}${takeNoWith0}${fileNo}_${
          context.date.year
        }_${context.date.month.length == 1 ? "0" : ""}${context.date.month + 1}
        _${context.date.day.length == 1 ? "0" : ""}${context.date.day}_${
          context.date.hour
        }_${context.date.minute}.jpg`;

        // Check if the DCIM directory exists
        const dcimDirInfo = await FileSystem.getInfoAsync(dcimDir);
        if (!dcimDirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dcimDir, { intermediates: true });
        }

        // Check if the project directory exists
        const projectDirInfo = await FileSystem.getInfoAsync(projectDir);
        if (!projectDirInfo.exists) {
          await FileSystem.makeDirectoryAsync(projectDir, {
            intermediates: true,
          });
        }

        // Move the file to the new URI
        await FileSystem.moveAsync({
          from: fileUri,
          to: newUri,
        });

        // Create an asset and add it to the media library
        const asset = await MediaLibrary.createAssetAsync(newUri);
        let album = await MediaLibrary.getAlbumAsync(context.projectName);
        if (album == null) {
          await MediaLibrary.createAlbumAsync(context.projectName, asset, true);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync(asset, album, true);
        }
      } catch (error) {
        console.error("Error saving photo:", error);
      }
    } else {
      alert("We need your permission to save this file.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={
        index >= worksheetLength ? styles.container : styles.containerEdit
      }
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View>
          <View style={styles.topLeftView}>
            <View style={styles.title.view}>
              <View style={styles.title.row}>
                <TouchableOpacity
                  style={
                    index >= worksheetLength
                      ? { width: 50, backgroundColor: "hsl(240, 16%, 18%)" }
                      : { width: 50, backgroundColor: "hsl(240, 30%, 18%)" }
                  }
                  onPress={confirmBackButton}
                >
                  <View>
                    <Icon
                      name={"angle-left"}
                      size={25}
                      color={"hsl(0, 0%, 96%)"}
                      style={styles.title.leftIcon}
                    />
                  </View>
                </TouchableOpacity>
                <Confirm
                  visible={confirmBack}
                  onClose={closeConfirmBack}
                  displayText={confirmMessage}
                  confirmFunction={confirmBackTrue}
                />
                {context.projectName.length > maxTitleLength && (
                  <Text style={styles.title.text}>
                    {context.projectName.substring(0, maxTitleLength - 5) +
                      "..."}
                  </Text>
                )}
                {context.projectName.length <= 21 && (
                  <Text style={styles.title.text}>{context.projectName}</Text>
                )}
              </View>

              <View style={styles.title.row}>
                {photos.length > 0 && (
                  <TouchableOpacity
                    style={{ marginLeft: "auto", marginRight: 20 }}
                    onPress={() => {
                      galleryOpen();
                    }}
                  >
                    <Icon
                      name={"images"}
                      size={25}
                      color={"hsl(0, 0%, 96%)"}
                      style={styles.title.rightIcon}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{ marginLeft: "auto", marginRight: 20 }}
                  onPress={() => {
                    cameraOpen();
                  }}
                >
                  <Icon
                    name={"camera"}
                    size={25}
                    color={"hsl(0, 0%, 96%)"}
                    style={styles.title.rightIcon}
                  />
                </TouchableOpacity>
              </View>

              <CameraModal
                visible={cameraVisible}
                onClose={cameraClose}
                setPhotos={setPhotos}
                photos={photos}
                openPreview={prewievOpen}
                setPhotoNo={setPhotoNo}
              />
              <PhotoPreview
                visible={prewievVisible}
                onClose={prewievClose}
                setPhotos={setPhotos}
                photos={photos}
                photoNo={photoNo}
                setPhotoNo={setPhotoNo}
              />
            </View>
            <View>
              <Text style={styles.text}>Numer punktu</Text>
              <TextInput
                style={styles.inputNarrower}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"decimal"}
                value={takeNo}
                onChangeText={(newValue) => setTakeNo(newValue)}
              />
            </View>
            <View>
              <Text style={styles.text}>
                Symbol lub nazwa elementu instalacji
              </Text>
              <TextInput
                style={[styles.inputWide, { height: inputHeight }]}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"default"}
                onContentSizeChange={(event) => {
                  // Dynamically adjust height up to maxHeight
                  const newHeight =
                    event.nativeEvent.contentSize.height < 50
                      ? 50
                      : Math.min(
                          event.nativeEvent.contentSize.height,
                          maxHeight
                        );
                  setInputHeight(newHeight);
                }}
                multiline
                value={elementName}
                numberOfLines={5}
                onChangeText={(newValue) => setElementName(newValue)}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Dzień:</Text>
              <Text style={styles.text}>
                {context.date.day +
                  "-" +
                  (context.date.month + 1) +
                  "-" +
                  context.date.year}
              </Text>
              <Text style={styles.text}>Godz:</Text>
              <Text style={styles.text}>
                {context.date.hour +
                  ":" +
                  (context.date.minute < 10
                    ? "0" + context.date.minute
                    : context.date.minute)}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>Substancja:</Text>
              {subListVisible && (
                <SubstanceSelect
                  selectSub={selectSub}
                  searchedSub={substance}
                />
              )}
              <TextInput
                style={styles.inputWide}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"default"}
                value={substance}
                onFocus={() => {
                  if (substance.length >= 3) {
                    subListOpen();
                  }
                }}
                onChangeText={(newValue) => {
                  if (newValue.length >= 3) {
                    subListOpen();
                  } else {
                    subListClose();
                  }
                  setSubstance(newValue);
                }}
              />
            </View>
            <View>
              <Text style={styles.text}>Typ elementu:</Text>
              <TouchableOpacity
                onPress={openModal}
                style={styles.elementSelect}
              ></TouchableOpacity>
              <TextInput
                style={styles.inputWide}
                value={buttonTitle}
              ></TextInput>
              <ReadioButtons
                visible={modalVisible}
                onClose={closeModal}
                onChangeTitle={changeButtonTitle}
                initialTitle={buttonTitle}
              />
            </View>

            {currProjectWorkType && (
              <View>
                <Text style={styles.text}>Stężenie</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.textCentered}>PID</Text>
                  <TextInput
                    style={styles.inputNarr}
                    autoCorrect={false}
                    enterKeyHint={"next"}
                    inputMode={"decimal"}
                    value={pid}
                    onChangeText={(newValue) => setpid(newValue)}
                  />
                  <Text style={styles.textCentered}>ppm</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.textCentered}>FID</Text>
                  <TextInput
                    style={styles.inputNarr}
                    autoCorrect={false}
                    enterKeyHint={"next"}
                    inputMode={"decimal"}
                    value={fid}
                    onChangeText={(newValue) => setfid(newValue)}
                  />
                  <Text style={styles.textCentered}>ppm</Text>
                </View>
              </View>
            )}

            <View style={styles.doubleButtonContainer}>
              <TouchableOpacity
                style={
                  index == 0 ? styles.shortButtonDisabled : styles.shortButton
                }
                onPress={() => changePoint(index - 1)}
                disabled={index == 0 ? true : false}
              >
                <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                  Poprzedni punkt
                </Text>
              </TouchableOpacity>
              {index < worksheetLength && (
                <TouchableOpacity
                  style={styles.shortButton}
                  onPress={() => changePoint(index + 1)}
                >
                  <Text
                    style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}
                  >
                    Następny punkt
                  </Text>
                </TouchableOpacity>
              )}
              {index >= worksheetLength && (
                <TouchableOpacity
                  style={styles.shortButton}
                  onPress={checkFields}
                >
                  <Text
                    style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}
                  >
                    Dodaj punkt
                  </Text>
                </TouchableOpacity>
              )}
              <Confirm
                visible={confirmNotFullAdd}
                onClose={closeNotFullAdd}
                displayText={confirmMessage}
                confirmFunction={addToJson}
              />
            </View>
            <View style={styles.bottomComponent}>
              <TouchableOpacity style={styles.button} onPress={viewDataPreview}>
                <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                  Przeglądaj dane
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 10,
  },
  title: {
    row: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    leftIcon: {
      marginLeft: 15,
    },
    view: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    text: {
      color: "hsl(0, 0%, 96%)",
      textAlign: "left",
      fontSize: 30,
    },
  },

  buttonContainer: {
    paddingTop: 10,
    paddingLeft: 15,
  },
  doubleButtonContainer: {
    paddingTop: 10,
    paddingLeft: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  elementSelect: {
    zIndex: 10,
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: "100%",
  },
  button: {
    width: screenWidth - 30,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, .5)",
    border: "1px solid transparent",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  shortButton: {
    width: (screenWidth - 50) / 2,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, .5)",
    border: "1px solid transparent",
    borderRadius: 8,
    marginRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  shortButtonDisabled: {
    width: (screenWidth - 50) / 2,
    height: 40,
    backgroundColor: "hsla(272, 15%, 67%, .5)",
    border: "1px solid transparent",
    borderRadius: 8,
    marginRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  textCentered: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 25,
  },
  inputNarr: {
    height: 50,
    width: 150,
    marginLeft: 15,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
  },
  inputNarrower: {
    height: 50,
    width: 100,
    marginLeft: 15,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
  },
  inputWide: {
    height: 50,
    width: screenWidth - 30,
    marginLeft: 15,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "hsl(240, 16%, 18%)",
  },
  containerEdit: {
    flexGrow: 1,
    backgroundColor: "hsl(240, 30%, 18%)",
  },
  topLeftView: {
    //position: "absolute",
    paddingTop: 10,
    left: 0,
    width: screenWidth,
  },
  bottomComponent: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 20,
  },
});
