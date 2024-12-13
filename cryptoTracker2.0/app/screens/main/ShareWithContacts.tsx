import React, { useState } from "react";
import * as SMS from 'expo-sms';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";

const ShareWithContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Access to contacts is required to share details."
      );
      return false;
    }
    return true;
  };

  const loadContacts = async () => {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) return;

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      setContacts(data);
    } else {
      Alert.alert("No Contacts Found", "Your contacts list is empty.");
    }
  };

  const shareWithContact = (contact: any) => {
    setSelectedContact(contact);

    const message = `
      Hey ${contact.name}, check out this cryptocurrency!
      - Name: Bitcoin
      - Symbol: BTC
      - Current Price: $28,433
    `;

    Alert.alert("Message Sent", `Message sent to ${contact.name}:\n\n${message}`);
    
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={loadContacts}>
        <Text style={styles.buttonText}>Load Contacts</Text>
      </TouchableOpacity>

      {contacts.length > 0 && (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => shareWithContact(item)}
            >
              <Text style={styles.contactName}>{item.name}</Text>
              {item.phoneNumbers && (
                <Text style={styles.contactInfo}>
                  {item.phoneNumbers[0].number}
                </Text>
              )}
              
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginBottom: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 14,
    color: "#555",
  },
});

export default ShareWithContacts;
