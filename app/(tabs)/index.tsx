
  import {app} from "../../firebase"
  import ParallaxScrollView from '@/components/ParallaxScrollView';
  import React, { useState, useEffect } from "react";
  import { StyleSheet, Image, View, Text, Button, Alert } from "react-native";
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
  import Toast from "react-native-toast-message";



    type Votes = {
      optionA: number;
      optionB: number;
    };
    


  export default function HomeScreen() {
    const db = getFirestore(app);
    const [votes, setVotes] = useState<Votes>({ optionA: 0, optionB: 0 });

      useEffect(() => {
      fetchVotes();
    }, []);
    
        // Update votes in Firestore
        const vote = async (option: string) => {
          try {
            const docRef = doc(db, "votes", "results");
            const docSnap = await getDoc(docRef);
      const pollData = docSnap.data();
      if (pollData) {
        const updatedVotes = {
          optionA: option === "optionA" ? pollData.optionA + 1 : pollData.optionA,
          optionB: option === "optionB" ? pollData.optionB + 1 : pollData.optionB,
        };

        await updateDoc(docRef, updatedVotes);
        console.log(`${option} vote updated successfully`);
        fetchVotes()
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  }

    // Fetch current votes from Firestore
    const fetchVotes = async () => {
      try {
        const docRef = doc(db, "votes", "results");
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data())
        if (docSnap.exists()) {
        
          setVotes(docSnap.data() as Votes);
        } else {
          // Create the document if it doesn't exist
          await setDoc(docRef, { optionA: 0, optionB: 0 });
        }
      } catch (error) {
        console.error("Error fetching votes:", error);
        Alert.alert("Error", "Failed to fetch votes.");
      }
    };

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('../../assets/images/test_image.png')}
            style={styles.reactLogo}
          />
        }>
        <View style={styles.container}>
        <Text style={styles.heading}>Voting App</Text>
        <Text style={styles.results}>Option A: {votes.optionA}</Text>
        <Text style={styles.results}>Option B: {votes.optionB}</Text>

        <View style={styles.buttonContainer}>
          <Button title="Vote for Option A" onPress={() => vote("optionA")} />
          <Button title="Vote for Option B" onPress={() => vote("optionB")} />
        </View>

        <Toast />
      </View>
      </ParallaxScrollView>
    );
  }

  const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 300,
      width: 400,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    container: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    results: {
      fontSize: 18,
      marginVertical: 5,
    },
    buttonContainer: {
      marginTop: 20,
      width: "80%",
      justifyContent: "space-between",
    },
  });
