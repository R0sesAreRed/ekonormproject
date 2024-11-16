import * as React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";

import { useState, useEffect } from "react";
const { width: screenWidth } = Dimensions.get("window");

export default function RenameProjectAction({
  visible,
  onClose,
  curritem,
  renameFunction,
}) {
  const [newName, setnewName] = useState("");
  const renameAction = () => {
    renameFunction(curritem.key, newName, curritem.type, curritem.workType);
    onClose();
  };

  useEffect(() => {
    setnewName("");
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.wrapView}>
        <View style={styles.view}>
          <View style={styles.buttonContainer}>
            <TextInput
              style={styles.inputWide}
              placeholder={curritem.name}
              placeholderTextColor={"hsl(0, 0%, 50%)"}
              autoCorrect={false}
              value={newName}
              onChangeText={(newValue) => setnewName(newValue)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={renameAction}>
              <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                {newName.length < 1 ? "Anuluj" : "Potwierdź"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  view: {
    width: screenWidth - 30,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 16%, 35%)",
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
    paddingBottom: 10,
  },
  button: {
    width: screenWidth - 85,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, .5)",
    border: "1px solid transparent",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputWide: {
    height: 50,
    width: screenWidth - 85,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
  },
});
