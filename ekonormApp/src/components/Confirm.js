import * as React from "react";
import {
  TouchableOpacity,
  Modal,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function Confirm({
  visible,
  onClose,
  displayText,
  confirmFunction,
}) {
  const confirmAction = () => {
    confirmFunction();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.wrapView}>
        <View style={styles.view}>
          <View>
            <Text style={styles.text}>{displayText}</Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={() => onClose()}>
              <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                Anuluj
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => confirmAction()}
            >
              <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                Potwierdź
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
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  button: {
    width: (screenWidth - 80) / 2,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, .5)",
    border: "1px solid transparent",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
  },
  text: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 10,
  },
});
