import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  RadioGroup,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React from "react";
import { AppContext } from "../context/context";
import { useContext, useState, useEffect, useMemo } from "react";
import ReadioButtons from "../components/RadioButtons";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { loadWorkseet } from "../utils/dataStorage";

const { width: screenWidth } = Dimensions.get("window");

export default function MainPage() {
  const context = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Wybierz element");
  const [takeNo, setTakeNo] = useState("1");
  const [elementName, setElementName] = useState("");
  const [substance, setSubstance] = useState("");
  const [pid, setpid] = useState("");
  const [fid, setfid] = useState("");
  const [debug, setdebug] = useState("");

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const changeButtonTitle = (newTitle) => setButtonTitle(newTitle);

  function clearFields() {
    //handleReadAndWriteExcel();
    setTakeNo((parseInt(takeNo) + 1).toString());
    setElementName("");
    setSubstance("");
    setpid("");
    setfid("");
    changeButtonTitle("Wybierz element");
  }

  function dismissKeyboard() {
    if (Platform.OS != "web") {
      Keyboard.dismiss();
    }
    closeModal();
  }

  const addToJson = () => {
    const newRow = {
      take: takeNo,
      symOrEl: elementName,
      date:
        context.date.day +
        "-" +
        context.date.month +
        "-" +
        context.date.year +
        " " +
        context.date.hour +
        ":" +
        context.date.minute,
      element: buttonTitle,
      sub: substance,
      value: pid > 0 ? pid : fid,
    };
    context.addRecord(newRow);
    clearFields();
    console.debug("json " + JSON.stringify(context.worksheetJson));
  };

  const handleReadAndWriteExcel = async (uri) => {
    //const premissions = await
    //const ws = XLSX.utils.sheet_new();

    // Assuming we are working with the first sheet
    const sheetName = wb.SheetNames[0];
    worksheet = wb.Sheets[sheetName];

    const newRow = [
      takeNo,
      elementName,
      context.date,
      buttonTitle,
      substance,
      pid > 0 ? pid : fid,
    ];

    // If no empty row found, add a new row at the end
    if (emptyRowIndex === -1) {
      data.push(newRow);
    } else {
      data[emptyRowIndex] = newRow;
    }

    // Convert JSON back to worksheet
    const newWorksheet = XLSX.utils.aoa_to_sheet(data);

    // Replace the old sheet with the new one
    workbook.Sheets[sheetName] = newWorksheet;

    // Write the workbook to binary string
    const newBase64 = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "base64",
    });

    // Write the updated file to the device
    await FileSystem.writeAsStringAsync(context.filepath, newBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setdebug("File updated successfully!");
  };

  saveXLSXFile = async (fileUri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("../Download", asset, false);
    } else alert("We need you permission to download this file.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View>
          <View style={styles.topLeftView}>
            <View>
              <Text style={styles.text}>Numer Ujęcia</Text>
              <TextInput
                style={styles.inputNarr}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"decimal"}
                value={takeNo}
                //placeholder={`${context.currency}`}
                onChangeText={(newValue) => setTakeNo(newValue)}
              />
            </View>
            <View>
              <Text style={styles.text}>
                Symbol lub nazwa elmentu instalacji
              </Text>
              <TextInput
                style={styles.inputWide}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"default"}
                value={elementName}
                //placeholder={`${context.currency}`}
                onChangeText={(newValue) => setElementName(newValue)}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Dzień:</Text>
              <Text style={styles.text}>
                {context.date.day +
                  "-" +
                  context.date.month +
                  "-" +
                  context.date.year}
              </Text>
              <Text style={styles.text}>Godz:</Text>
              <Text style={styles.text}>
                {context.date.hour + ":" + context.date.minute}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>Substancja:</Text>
              <TextInput
                style={styles.inputWide}
                autoCorrect={false}
                enterKeyHint={"next"}
                inputMode={"default"}
                value={substance}
                //placeholder={`${context.currency}`}
                onChangeText={(newValue) => setSubstance(newValue)}
              />
            </View>
            <View>
              <Text style={styles.text}>Element:</Text>
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
                  //placeholder={`${context.currency}`}
                  onChangeText={(newValue) => setpid(newValue)}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.textCentered}>FID</Text>
                <TextInput
                  style={styles.inputNarr}
                  autoCorrect={false}
                  enterKeyHint={"next"}
                  inputMode={"decimal"}
                  value={fid}
                  //placeholder={`${context.currency}`}
                  onChangeText={(newValue) => setfid(newValue)}
                />
                <Text style={styles.textCentered}>ppm</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={addToJson}>
                <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                  Dodaj
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={addToJson}>
                <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                  Zapisz plik
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
  safeArea: {
    flex: 1,
  },
  text: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 10,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingLeft: 15,
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
    flex: 1,
    backgroundColor: "hsl(240, 16%, 18%)",
    // alignItems: "center",
    // justifyContent: "center",
  },
  topLeftView: {
    //position: "absolute",
    top: 20,
    left: 0,
    width: screenWidth,
    //height: 100,
  },
});
