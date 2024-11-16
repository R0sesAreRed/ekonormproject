import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { json, useNavigate } from "react-router-native";
import { loadWorksheet, persistWorksheet } from "../utils/dataStorage";
import { AppContext } from "../context/context";
import Icon from "react-native-vector-icons/FontAwesome6.js";
import { useContext } from "react";
import { useEffect, useState } from "react";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const { width: screenWidth } = Dimensions.get("window");

export default function DataPreview() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    loadWorksheet(context.projectKey).then((res) => {
      let parsedRes = res ? JSON.parse(res) : [];
      context.saveLoadedWorksheet(parsedRes);
      if (parsedRes.length > 0) {
        setData(parsedRes);
      }
    });
  }, []);

  const handleChange = (text, index, field) => {
    const newData = [...data];
    newData[index][field] = text;
    setData(newData);
  };
  //const obj = JSON.parse(JSON.stringify(data));
  const back = () => {
    context.saveLoadedWorksheet(data);
    persistWorksheet(context.projectKey, data);
    setTimeout(() => {
      navigate("/MainPage");
    }, 100); // Add a small delay before navigation
  };

  const handleReadAndWriteExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(context.worksheetJson);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Test");

    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri = `${FileSystem.cacheDirectory}output.xlsx`;

    try {
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await saveXLSXFile(uri);
      alert("Plik został zapisany");
    } catch (e) {
      alert("Błąd w zapisie pliku");
      console.error(e);
    }
  };

  saveXLSXFile = async (fileUri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync(
        `../Projekty/${context.projectName}`,
        asset,
        false
      );
    } else alert("We need you permission to save this file.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topLeftView}>
        <View style={styles.rowtTitle}>
          <TouchableOpacity onPress={back}>
            <Icon
              name={"angle-left"}
              size={25}
              color={"hsl(0, 0%, 0%)"}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          {context.projectName.length > 26 && (
            <Text style={styles.textTitle}>
              {context.projectName.substring(0, 24) + "..."}
            </Text>
          )}
          {context.projectName.length <= 26 && (
            <Text style={styles.textTitle}>{context.projectName}</Text>
          )}
        </View>
      </View>

      <View style={{ paddingTop: 10 }}>
        <ScrollView horizontal={true}>
          <View>
            {data.map((item, index) => (
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={{ fontSize: 15, width: 20 }}>
                    {item.takeNo}{" "}
                  </Text>
                </View>
                <TextInput
                  value={item.elementName}
                  style={[styles.inputNarr, { width: 300 }]}
                  placeholder="Symbol lub Nazwa"
                  onChangeText={(text) =>
                    handleChange(text, index, "elementName")
                  }
                />
                <TextInput
                  value={item.substance}
                  style={[styles.inputNarr, { width: 300 }]}
                  placeholder="Substancja"
                  onChangeText={(text) =>
                    handleChange(text, index, "substance")
                  }
                />
                <TextInput
                  value={item.buttonTitle}
                  style={[styles.inputNarr, { width: 300 }]}
                  placeholder="Element"
                  onChangeText={(text) =>
                    handleChange(text, index, "buttonTitle")
                  }
                />

                <TextInput
                  value={item.pid}
                  style={[styles.inputNarr, { width: 300 }]}
                  placeholder="Pid"
                  onChangeText={(text) => handleChange(text, index, "pid")}
                />

                <TextInput
                  value={item.fid}
                  style={[styles.inputNarr, { width: 300 }]}
                  placeholder="Fid"
                  onChangeText={(text) => handleChange(text, index, "fid")}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.bottomComponent}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleReadAndWriteExcel}
          >
            <Text style={{ color: "hsl(0, 0%, 96%)", textAlign: "center" }}>
              Zapisz Plik
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  topLeftView: {
    //position: "absolute",
    paddingTop: 10,
    left: 0,
    //width: screenWidth,
  },
  leftIcon: {
    marginTop: 40,
    marginLeft: 15,
  },
  rowtTitle: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textTitle: {
    textAlign: "left",
    marginLeft: 15,
    fontSize: 25,
  },
  inputNarr: {
    height: 50,
    //width: 300,
    borderWidth: 1,
    padding: 10,
    //color: "hsl(0, 0%, 96%)",
    border: "hsl(0, 0%, 96%)",
  },
  rowText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    paddingLeft: 7,
    paddingRight: 7,
    //color: "hsl(0, 0%, 96%)",
    border: "hsl(0, 0%, 96%)",
  },
  button: {
    width: screenWidth - 30,
    height: 40,
    backgroundColor: "hsla(272, 53%, 67%, 1)",
    border: "1px solid transparent",
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  bottomComponent: {
    paddingTop: 40,
    paddingLeft: 15,
    paddingBottom: 20,
  },
});
