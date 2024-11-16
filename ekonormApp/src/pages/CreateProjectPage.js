import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
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
import ProjectTypeSelect from "../components/ProjectTypeSelect";
import RenameProjectAction from "../components/RenameProjectAction";
import SelectProjectAction from "../components/SelectProjectAction";
import ProjectWorkTypeSelect from "../components/ProjectWorkTypeSelect";

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeigth } = Dimensions.get("window");
export default function CreateProjectPage() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [projectList, setProjectList] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState("Przemysł chemiczny"); //chem - true, petrochem - false
  const [newProjectWorkType, setNewProjectWorkType] =
    useState("Inwentaryzacja"); //pomiar - true, inwentaryzacja - false

  const [confirmMessage, setConfirmMessage] = useState("");
  const [currItem, setCurrItem] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmDeleteButton = (name) => {
    setConfirmMessage(
      "Czy na pewno chcesz usunąć projekt " +
        name +
        "?\nUsunie to tylko wewnętrzne dane aplikacji, nie wpływając na wyeksportowane pliki.\n"
    );
    setConfirmDelete(true);
  };
  const closeConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const [selectModal, setSelectModal] = useState(false);
  const openSelectModal = (data) => {
    setCurrItem(data);
    setSelectModal(true);
  };
  const closeSelectModal = () => {
    setSelectModal(false);
  };

  const [renameModal, setRenameModal] = useState(false);
  const closeRenameModal = () => {
    setRenameModal(false);
  };
  const openRenameModal = () => {
    setRenameModal(true);
  };

  const [typeSelectModal, setTypeSelectModal] = useState(false);
  const closeTypeSelectModal = () => {
    setTypeSelectModal(false);
  };
  const openTypeSelectModal = () => {
    setTypeSelectModal(true);
  };

  const [workTypeSelectModal, setWorkTypeSelectModal] = useState(false);
  const closeWorkTypeSelectModal = () => {
    setWorkTypeSelectModal(false);
  };
  const openWorkTypeSelectModal = () => {
    setWorkTypeSelectModal(true);
  };

  const [createProjectModal, setCreateProjectModal] = useState(false);
  const closeCreateProjectModal = () => {
    setCreateProjectModal(false);
  };
  const openCreateProjectModal = () => {
    setCreateProjectModal(true);
  };

  const newProject = async () => {
    if (newProjectName.length > 0) {
      const key = newProjectName.toUpperCase().replace(/\s+/g, "_");
      if (!projectList.some((project) => project.key === key)) {
        const projectInfo = {
          name: newProjectName,
          key: key,
          type: newProjectType == "Przemysł chemiczny",
          workType: newProjectWorkType == "Pomiar",
        };
        let projectListUpdate = [projectInfo, ...projectList];
        setProjectList(projectListUpdate);
        await addProject(projectListUpdate);
      }
      setNewProjectName("");
    } else {
      alert("Błąd przy tworzeniu projektu");
    }
    closeCreateProjectModal();
  };
  const removeProject = async (id) => {
    let projectListUpdate = projectList.filter((project) => project.key !== id);
    setProjectList(projectListUpdate);
    await addProject(projectListUpdate);
    deleteData("WSHT_" + id);
  };

  const editProject = async (id, data, type, workType) => {
    console.debug("Edit project: ", id, data, type, workType);
    console.debug(currItem.key);
    if (data.length > 0) {
      if (projectList.some((project) => project.key === id)) {
        const projectInfo = {
          name: data,
          key: id,
          type: type,
          workType: workType,
        };
        const index = projectList.findIndex((obj) => obj.key === id);
        let updatedArray = [...projectList];
        updatedArray[index] = projectInfo;
        setProjectList(updatedArray);
        await addProject(updatedArray);
      }
    }
  };

  const selectProject = (data) => {
    context.setProjectData(data);
    navigate("/MainPage");
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
          onLongPress={() => openSelectModal(item)}
          delayLongPress={1500}
        >
          <Text style={styles.flatListItemLabel}>{item.name}</Text>
        </TouchableOpacity>
        <SelectProjectAction
          visible={selectModal}
          onClose={closeSelectModal}
          renameFunction={openRenameModal}
          id={currItem.key}
          deleteFunction={() => confirmDeleteButton(currItem.name)}
        />
        <RenameProjectAction
          visible={renameModal}
          onClose={closeRenameModal}
          curritem={currItem}
          renameFunction={editProject}
        />
        <Confirm
          visible={confirmDelete}
          onClose={closeConfirmDelete}
          displayText={confirmMessage}
          confirmFunction={() => removeProject(currItem.key)}
        />
      </View>
    );
  };

  return (
    // <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
    <View style={styles.container}>
      <View style={styles.topContainer}></View>

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
          onPress={openCreateProjectModal}
        >
          <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
            Stwórz projekt
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 15 }} />

      <Modal
        transparent={true}
        visible={createProjectModal}
        onRequestClose={closeCreateProjectModal}
      >
        <View style={styles.wrapView}>
          <View style={styles.view}>
            <View>
              <TextInput
                placeholder="Nazwa Projektu"
                placeholderTextColor={"hsl(0, 0%, 50%)"}
                value={newProjectName}
                autoCorrect={false}
                onChangeText={(newValue) => setNewProjectName(newValue)}
                style={styles.inputWide}
              ></TextInput>
            </View>
            <View>
              <TouchableOpacity
                onPress={openTypeSelectModal}
                style={styles.elementSelect}
              ></TouchableOpacity>
              <TextInput
                style={styles.inputWide}
                value={newProjectType}
              ></TextInput>
              <ProjectTypeSelect
                visible={typeSelectModal}
                onClose={closeTypeSelectModal}
                onChangeTitle={setNewProjectType}
                initialTitle={newProjectType}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={openWorkTypeSelectModal}
                style={styles.elementSelect}
              ></TouchableOpacity>
              <TextInput
                style={styles.inputWide}
                value={newProjectWorkType}
              ></TextInput>
              <ProjectWorkTypeSelect
                visible={workTypeSelectModal}
                onClose={closeWorkTypeSelectModal}
                onChangeTitle={setNewProjectWorkType}
                initialTitle={newProjectWorkType}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={newProject}>
                <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
                  Stwórz projekt
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  modalButton: {
    width: screenWidth - 85,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, .5)",
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
    width: screenWidth - 85,
    marginLeft: 15,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    color: "hsl(0, 0%, 96%)",
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
  elementSelect: {
    zIndex: 10,
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: "100%",
  },
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
    borderColor: "hsl(0, 0%, 96%)",
    borderRadius: 7.5,
    backgroundColor: "hsl(240, 16%, 35%)",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});
