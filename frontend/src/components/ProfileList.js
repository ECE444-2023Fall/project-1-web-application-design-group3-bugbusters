import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

const ProfileList = ({
  title,
  placeholder_text,
  data,
  RenderItem,
  keyExtractor,
  editer,
  deleter,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const EmptyItem = () => (
    <View style={styles.list_item_container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.list_item_text}>{placeholder_text}</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = ({ item_types }) => (
    <View style={styles.list_header_component_container}>
      <Text style={styles.list_header_component_text}>{item_types}</Text>
    </View>
  );

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <FlatList
        style={{ marginBottom: 80 }}
        data={data}
        renderItem={({ item }) => (
          <RenderItem item={item} editer={editer} deleter={deleter} />
        )}
        keyExtractor={keyExtractor}
        onRefresh={() => {
          // simulate fetching more events
          setRefreshing(true);
          setTimeout(() => {
            // call getEvent(event_id) here
            setRefreshing(false);
          }, 2000);
        }}
        refreshing={refreshing}
        ListHeaderComponent={<ListHeaderComponent item_types={title} />}
        ListEmptyComponent={<EmptyItem />}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list_header_component_container: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingVertical: 8,
    borderTopColor: "#1E3765",
    borderBottomColor: "#1E3765",
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  list_header_component_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list_item_container: {
    marginTop: 42,
    marginHorizontal: 32,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 24,
  },
  list_item_text: {
    fontSize: 24,
  },
});

export default ProfileList;
