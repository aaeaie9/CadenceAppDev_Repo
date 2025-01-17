import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';

const PianoRoll = () => {
  const { activeTranscription } = useGlobalContext();
  const notes = activeTranscription?.notes || [];

  const midiMapping = {
    "C6": 84, "B5": 83, "A#5": 82, "A5": 81, "G#5": 80, "G5": 79, 
    "F#5": 78, "F5": 77, "E5": 76, "D#5": 75, "D5": 74, "C#5": 73, 
    "C5": 72, "B4": 71, "A#4": 70, "A4": 69, "G#4": 68, "G4": 67,
    "F#4": 66, "F4": 65, "E4": 64, "D#4": 63, "D4": 62, "C#4": 61,
    "C4": 60, "B3": 59, "A#3": 58, "A3": 57, "G#3": 56, "G3": 55,
    "F#3": 54, "F3": 53, "E3": 52, "D#3": 51, "D3": 50, "C#3": 49,
    "C3": 48, "B2": 47, "A#2": 46, "A2": 45
  };

  const totalColumns = useMemo(() => {
    if (notes.length === 0) return 110;

    const lastNoteEnd = Math.max(...notes.map(note => {
      const endTime = note.time + note.duration;
      return endTime;
    }));

    const paddingColumns = 20;
    const requiredColumns = Math.ceil(lastNoteEnd / 0.1) + paddingColumns;
    
    return Math.max(110, requiredColumns);
  }, [notes]);

  const pianoKeys = Object.keys(midiMapping).sort((a, b) => midiMapping[b] - midiMapping[a]);

  const isSharpNote = (note) => note.includes('#');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Fixed Labels Column */}
            <View style={styles.labelsColumn}>
              {/* Empty cell to match timestamp row height */}
              <View style={[styles.emptyCell, styles.timestampRowHeight]}>
                <Text style={styles.keyText}></Text>
              </View>
              {pianoKeys.map((key, rowIndex) => (
                <View 
                  key={rowIndex} 
                  style={[
                    styles.noteCell,
                    isSharpNote(key) && styles.sharpNoteCell
                  ]}
                >
                  <Text style={[
                    styles.keyText,
                    isSharpNote(key) && styles.sharpKeyText
                  ]}>
                    {key}
                  </Text>
                </View>
              ))}
            </View>

            {/* Scrollable Grid */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Timestamp Row */}
                <View style={styles.timestampRow}>
                  {Array(totalColumns).fill(0).map((_, colIndex) => (
                    <View key={colIndex} style={styles.timestampCell}>
                      <Text style={styles.timestampText}>{(colIndex * 0.1).toFixed(1)}</Text>
                    </View>
                  ))}
                </View>

                {/* Grid */}
                <View style={styles.gridContainer}>
                  {pianoKeys.map((key, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                      {Array(totalColumns).fill(0).map((_, colIndex) => {
                        const isActive = notes.some(note => {
                          const noteRow = pianoKeys.findIndex(k => midiMapping[k] === note.midi);
                          const startColumn = Math.round(note.time / 0.1);
                          const durationCells = Math.round(note.duration / 0.1);
                          const endColumn = startColumn + durationCells;

                          return (
                            rowIndex === noteRow &&
                            colIndex >= startColumn &&
                            colIndex < endColumn
                          );
                        });

                        return (
                          <View
                            key={colIndex}
                            style={[
                              styles.gridCell,
                              isSharpNote(key) && styles.sharpGridCell,
                              isActive ? styles.activeCell : null
                            ]}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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
  content: {
    flexDirection: 'row',
  },
  labelsColumn: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    backgroundColor: '#fff',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f7f7f7',
    marginLeft: 20,
    height: 20, // Explicitly set height
  },
  timestampRowHeight: {
    height: 25, // Match the timestamp row height + marginBottom
  },
  emptyCell: {
    width: 30,
    height: 20,
  },
  timestampCell: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCell: {
    width: 40,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    borderColor: '#c4c4c4',
    borderBottomColor: '#c4c4c4',
    borderRightColor: '#c4c4c4',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  sharpNoteCell: {
    backgroundColor: '#000',
  },
  keyText: {
    fontSize: 6,
    color: '#000',
  },
  sharpKeyText: {
    color: '#fff',
  },
  gridCell: {
    width: 30,
    height: 20,
    backgroundColor: '#f1f2f4',
    borderColor: '#c4c4c4',
    borderWidth: 0.3
  },
  sharpGridCell: {
    backgroundColor: '#e0e0e0',
  },
  activeCell: {
    backgroundColor: '#773adb',
  },
});

export default PianoRoll;
