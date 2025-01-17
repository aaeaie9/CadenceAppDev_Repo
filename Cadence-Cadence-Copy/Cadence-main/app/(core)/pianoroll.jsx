import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';

const PianoRoll = () => {
  const { activeTranscription } = useGlobalContext();

  // Ensure notes are always an array
  const notes = activeTranscription?.notes || [];

  // Define piano keys from A2 to C6 (A2 at the bottom, C6 at the top)
  const pianoKeys = [
    "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", 
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", 
    "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6"
  ];

  // Reverse pianoKeys to have A2 at the bottom and C6 at the top
  const reversedPianoKeys = pianoKeys.reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Vertical Scroll View for the whole grid */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Grid Container for Rows */}
          <View style={styles.gridContainer}>
            {/* Horizontal Scroll View for the entire grid */}
            <ScrollView
              horizontal
              style={styles.horizontalScrollView}
              showsHorizontalScrollIndicator={false}
            >
              {/* Render all rows together in one scrollable area */}
              <View style={styles.gridCellsContainer}>
                {reversedPianoKeys.map((key, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {/* Vertical Scroll View for the note label */}
                    <View style={styles.noteCell}>
                      <Text style={styles.keyText}>{key}</Text>
                    </View>
                    {/* Render Transcription Grid Cells */}
                    {Array(20).fill(0).map((_, colIndex) => (
                      <View
                        key={colIndex}
                        style={[
                          styles.gridCell,
                          notes.includes(rowIndex + 57) &&
                          colIndex < notes.filter(n => n === (rowIndex + 57)).length
                            ? styles.activeCell
                            : null
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PianoRoll;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  horizontalScrollView: {
    flexDirection: 'row',
  },
  gridCellsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCell: {
    width: 20,  // Further reduced width for note name cells
    height: 20, // Further reduced height for note name cells
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  keyText: {
    fontSize: 6,  // Further reduced font size for note names
  },
  gridCell: {
    width: 20,  // Further reduced size for grid cells
    height: 20, // Further reduced size for grid cells
    backgroundColor: '#f1f1f1',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  activeCell: {
    backgroundColor: '#FF5722',  // Highlight active cells
  },
});
