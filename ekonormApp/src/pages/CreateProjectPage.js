import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import {
  getProjects,
  addProject,
  deleteData,
  seeAll,
} from "../utils/dataStorage";
import { useNavigate } from "react-router-native";
import Confirm from "../components/Confirm";

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeigth } = Dimensions.get("window");
export default function CreateProjectPage() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [projectList, setProjectList] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmMessage, setconfirmMessage] = useState("");

  const closeConfirmDelete = () => {
    setConfirmDelete(false);
  };
  const newProject = async (data) => {
    if (data.length > 0) {
      const key = data.toUpperCase().replace(/\s+/g, "_");
      if (!projectList.some((project) => project.key === key)) {
        const projectInfo = { name: data, key: key };
        let projectListUpdate = [projectInfo, ...projectList];
        setProjectList(projectListUpdate);
        await addProject(projectListUpdate);
      }
      setNewProjectName("");
    }
  };
  const removeProject = async (id) => {
    let projectListUpdate = projectList.filter((project) => project.key !== id);
    setProjectList(projectListUpdate);
    await addProject(projectListUpdate);
    deleteData("WSHT_" + id);
  };

  const editProject = async (id, data) => {
    if (data.length > 0) {
      const key = data.toUpperCase().replace(/\s+/g, "_");
      if (!projectList.some((project) => project.key === key)) {
        const projectInfo = { name: data, key: key };
        const index = projectList.findIndex((obj) => obj.id === id);
        const updatedArray = [...projectList];
        updatedArray[index] = projectInfo;
        setProjectList(updatedArray);
        await addProject(projectListUpdate);
      }
    }

    deleteData("WSHT_" + id);
  };

  const selectProject = (data) => {
    context.setProjectKey(data.key);
    context.setProjectName(data.name);
    navigate("/MainPage");
  };

  const confirmDeleteButton = () => {
    setconfirmMessage(
      "Czy na pewno chcesz usunąć projekt?\nUsunie to tylko wewnętrzne dane aplikacji, nie wpływając na wyeksportowane pliki.\n"
    );
    setConfirmDelete(true);
  };

  useEffect(() => {
    getProjects().then((res) => {
      if (res && res !== "[]") {
        try {
          const parsedProjects = JSON.parse(res);
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            setProjectList(parsedProjects);
          }
        } catch (error) {
          console.error("Error parsing projects from AsyncStorage:", error);
        }
      }
    });
  }, []);

  renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => selectProject(item)}
          onLongPress={confirmDeleteButton}
          delayLongPress={2500}
        >
          <Text style={styles.flatListItemLabel}>{item.name}</Text>
        </TouchableOpacity>
        <Confirm
          visible={confirmDelete}
          onClose={closeConfirmDelete}
          displayText={confirmMessage}
          confirmFunction={() => removeProject(item.key)}
        />
      </View>
    );
  };

  return (
    // <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
    <View style={styles.container}>
      <View style={styles.topContainer}></View>
      <View>
        <TextInput
          value={newProjectName}
          onChangeText={(newValue) => setNewProjectName(newValue)}
          style={styles.inputWide}
        ></TextInput>
      </View>
      <SafeAreaView style={styles.listContainer}>
        {projectList.length === 0 && (
          <Text style={styles.textItalic}>Brak stworzonych projektów</Text>
        )}
        {projectList.length > 0 && (
          <FlatList
            data={projectList}
            nestedScrollEnabled
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
          />
        )}
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => newProject(newProjectName)}
        >
          <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
            Stwórz projekt
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 15 }} />
    </View>
    // {/* </KeyboardAvoidingView> */}
  );
}

const styles = StyleSheet.create({
  text: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 10,
  },
  textItalic: {
    color: "hsl(0, 0%, 96%)",
    textAlign: "center",
    marginLeft: 15,
    marginTop: 10,
    fontStyle: "italic",
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
  buttonContainer: {
    paddingTop: 10,
    paddingLeft: 15,
  },
  topContainer: {
    height: screenHeigth * 0.4,
  },
  listContainer: {
    width: screenWidth - 30,
    marginLeft: 15,
    marginTop: 10,
    //height: screenHeigth * 0.3,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
    border: "1px solid hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 12%, 23%)",
    marginBottom: 15,
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
    backgroundColor: "hsl(240, 16%, 18%)",
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
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flatListItemLabel: {
    marginLeft: 20,
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 12,
    color: "hsl(0, 0%, 96%)",
    justifyContent: "center",
    flex: 1,
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
});
