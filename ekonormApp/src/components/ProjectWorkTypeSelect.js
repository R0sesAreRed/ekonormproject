import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { RadioButton, Provider as PaperProvider } from "react-native-paper";
import { useState } from "react";

const { width: screenWidth } = Dimensions.get("window");

const ProjectWorkTypeSelect = ({
  visible,
  onClose,
  onChangeTitle,
  initialTitle,
}) => {
  const [checked, setChecked] = useState(initialTitle);

  const handleSave = () => {
    onChangeTitle(checked);
    onClose();
  };

  function closeOnPressOut() {
    onClose();
  }

  return (
    <PaperProvider>
      <Modal transparent={true} visible={visible} onRequestClose={onClose}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={closeOnPressOut}
        >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <RadioButton.Group
                  onValueChange={(newValue) => setChecked(newValue)}
                  value={checked}
                >
                  <RadioButton.Item
                    value="Inwentaryzacja"
                    label="Inwentaryzacja"
                    style={styles.radioButtonContainer}
                    labelStyle={styles.radioButtonLabel}
                  />

                  <RadioButton.Item
                    value="Pomiar"
                    label="Pomiar"
                    style={styles.radioButtonContainer}
                    labelStyle={styles.radioButtonLabel}
                  />
                </RadioButton.Group>
                <View>
                  <Button title="Zapisz" onPress={handleSave}></Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "hsl(240, 16%, 35%)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: "left",
    alignItems: "left",
    paddingTop: 10,
    width: screenWidth - 100,
    height: 425,
  },

  radioButtonContainer: {
    width: screenWidth - 50,
    justifyContent: "center",
    flexDirection: "row-reverse",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingTop: 5,
    flex: 0,
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "hsl(0, 0%, 96%)",
    justifyContent: "center",
    flex: 1,
  },
});

export default ProjectWorkTypeSelect;
