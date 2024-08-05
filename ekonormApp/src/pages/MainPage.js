import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  RadioGroup,
  TextInput,
  Dimensions,
  ScrollView,
  Pressable,
  Button,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import React from "react";
import { AppContext } from "../context/context";
import { useContext, useState, useEffect, useMemo } from "react";
import RadioButtons from "../components/RadioButtons";
//import { Button } from "react-native-paper";

const { width: screenWidth } = Dimensions.get("window");

export default function MainPage() {
  const context = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Wybierz element");

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const changeButtonTitle = (newTitle) => setButtonTitle(newTitle);

  // String formatDateTime = () => {
  //   return (

  //   );
  // };
  function addRecord() {}

  function dismissKeyboard() {
    if (Platform.OS != "web") {
      Keyboard.dismiss();
    }

    closeModal();
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topLeftView}>
          <View>
            <Text style={styles.text}>Numer Ujęcia</Text>
            <TextInput
              style={styles.inputNarr}
              autoCorrect={false}
              enterKeyHint={"next"}
              inputMode={"default"}
              //placeholder={`${context.currency}`}
              //onChangeText={(newValue) => setValue(newValue)}
            />
          </View>
          <View>
            <Text style={styles.text}>Symbol lub nazwa elmentu instalacji</Text>
            <TextInput
              style={styles.inputWide}
              autoCorrect={false}
              enterKeyHint={"next"}
              inputMode={"default"}
              //placeholder={`${context.currency}`}
              //onChangeText={(newValue) => setValue(newValue)}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>Dzień:</Text>
            <Text style={styles.text}>
              {context.date.year +
                "-" +
                context.date.month +
                "-" +
                context.date.day}
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
              //placeholder={`${context.currency}`}
              //onChangeText={(newValue) => setValue(newValue)}
            />
          </View>
          <View>
            <Text style={styles.text}>Element:</Text>
            <TouchableOpacity
              onPress={openModal}
              style={styles.elementSelect}
            ></TouchableOpacity>
            <TextInput style={styles.inputWide} value={buttonTitle}></TextInput>
            <RadioButtons
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
                //placeholder={`${context.currency}`}
                //onChangeText={(newValue) => setValue(newValue)}
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
                //placeholder={`${context.currency}`}
                //onChangeText={(newValue) => setValue(newValue)}
              />
              <Text style={styles.textCentered}>ppm</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={addRecord}>
              <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                Dodaj
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 500,
    marginBottom: 7.5,
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
    alignItems: "center",
    justifyContent: "center",
  },
  containerHor: {
    flex: 1,
    backgroundColor: "hsl(240, 16%, 18%)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  appHeader: {
    color: "hsl(0, 0%, 96%)",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 15,
  },
  monthValue: {
    color: "#ffa500",
    fontWeight: "bold",
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "hsla(88, 50%, 53%, .1)",
    border: "1px solid transparent",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: 150,
    height: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  topLeftView: {
    position: "absolute",
    top: 20,
    left: 0,
    width: screenWidth,
    height: 100,
    paddingTop: 30,
  },
});
