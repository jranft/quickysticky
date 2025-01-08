import React, { useState, useEffect, useRef } from 'react';
import { 
 View, 
 TextInput, 
 StyleSheet, 
 TouchableOpacity,
 SafeAreaView,
 FlatList,
 Text,
 Dimensions,
 Alert,
 Keyboard,
 TouchableWithoutFeedback,
 Linking
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { X } from 'lucide-react-native';

// Constants
const windowWidth = Dimensions.get('window').width;
const mainNoteSize = windowWidth - 20;
const smallNoteSize = (windowWidth - 40) / 3;
const NOTE_COLORS = ['#FEF48B', '#A0F2FF', '#A6FF90', '#FDB9BB', '#A8BCFF', '#FFC14A'];
const STORAGE_KEY = '@sticky_notes';
const NEXT_COLOR_KEY = '@next_note_color';

// Types
interface Note {
 id: string;
 text: string;
 color: string;
 createdAt: string;
 updatedAt: string;
}

const formatDate = (dateString: string): string => {
 const date = new Date(dateString);
 const now = new Date();
 const yesterday = new Date(now);
 yesterday.setDate(now.getDate() - 1);
 const oneWeekAgo = new Date(now);
 oneWeekAgo.setDate(now.getDate() - 7);
 
 const isSameDay = (d1: Date, d2: Date): boolean => {
   return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
 }
 
 if (isSameDay(date, now)) {
   return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
 }
 
 if (date >= oneWeekAgo) {
   return date.toLocaleDateString('en-US', { weekday: 'long' });
 }
 
 if (now.getFullYear() > date.getFullYear()) {
   return date.toLocaleDateString('en-US', { 
     month: 'short', 
     day: 'numeric',
     year: 'numeric'
   });
 }
 
 return date.toLocaleDateString('en-US', { 
   month: 'short', 
   day: 'numeric'
 });
};

function App(): React.JSX.Element {
 const [notes, setNotes] = useState<Note[]>([]);
 const [currentNote, setCurrentNote] = useState<string>('');
 const [isEditing, setIsEditing] = useState<boolean>(false);
 const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
 const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
 const [nextNoteColor, setNextNoteColor] = useState<string>(NOTE_COLORS[0]);
 const flatListRef = useRef<FlatList>(null);
 const textInputRef = useRef<TextInput>(null);

 // Track app open and device info
 useEffect(() => {
   const logAppOpen = async () => {
     try {
       await analytics().logEvent('app_opened', {
         device_id: await DeviceInfo.getUniqueId(),
         device_model: await DeviceInfo.getModel(),
         device_brand: await DeviceInfo.getBrand(),
         device_os: await DeviceInfo.getSystemName(),
         device_os_version: await DeviceInfo.getSystemVersion(),
         app_version: await DeviceInfo.getVersion(),
         app_build: await DeviceInfo.getBuildNumber(),
       });
     } catch (error) {
       console.error('Analytics error:', error);
     }
   };

   logAppOpen();
 }, []);

 // Load notes on mount
 useEffect(() => {
   loadNotes();
 }, []);

 // Save notes when they change
 useEffect(() => {
   if (notes.length > 0) {
     saveNotes();
   }
 }, [notes]);

 // Keyboard listeners
 useEffect(() => {
   const keyboardDidShowListener = Keyboard.addListener(
     'keyboardDidShow',
     () => {
       setKeyboardVisible(true);
     }
   );
   const keyboardDidHideListener = Keyboard.addListener(
     'keyboardDidHide',
     () => {
       setKeyboardVisible(false);
     }
   );
   return () => {
     keyboardDidShowListener.remove();
     keyboardDidHideListener.remove();
   };
 }, []);

 const loadNotes = async () => {
   try {
     const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
     if (savedNotes !== null) {
       setNotes(JSON.parse(savedNotes));
     }
   } catch (error) {
     console.error('Error loading notes:', error);
     Alert.alert('Error', 'Failed to load saved notes');
   }
 };

 const saveNotes = async () => {
   try {
     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
   } catch (error) {
     console.error('Error saving notes:', error);
     Alert.alert('Error', 'Failed to save notes');
   }
 };

 const saveNote = async () => {
   if (currentNote.trim().length > 0) {
     const timestamp = new Date().toISOString();
     
     if (editingNoteId) {
       setNotes(notes.map(note => 
         note.id === editingNoteId 
           ? { ...note, text: currentNote, updatedAt: timestamp }
           : note
       ));
       await analytics().logEvent('note_updated');
     } else {
       const newNoteId = Date.now().toString();
       setNotes([
         ...notes,
         {
           id: newNoteId,
           text: currentNote,
           color: nextNoteColor,
           updatedAt: timestamp,
           createdAt: timestamp
         }
       ]);
       await analytics().logEvent('note_created');
       
       // Update next color
       const currentColorIndex = NOTE_COLORS.indexOf(nextNoteColor);
       const nextColorIndex = (currentColorIndex + 1) % NOTE_COLORS.length;
       setNextNoteColor(NOTE_COLORS[nextColorIndex]);
     }

     setCurrentNote('');
     setIsEditing(false);
     setEditingNoteId(null);
     Keyboard.dismiss();
   }
 };

 const editNote = (note: Note) => {
   setCurrentNote(note.text);
   setEditingNoteId(note.id);
   setIsEditing(true);
   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
 };

 const deleteNote = () => {
   Alert.alert(
     "Delete Note",
     "Are you sure you want to delete this note?",
     [
       {
         text: "Cancel",
         style: "cancel"
       },
       {
         text: "Delete",
         onPress: async () => {
           setNotes(notes.filter(note => note.id !== editingNoteId));
           setCurrentNote('');
           setIsEditing(false);
           setEditingNoteId(null);
           Keyboard.dismiss();
           await analytics().logEvent('note_deleted');
         },
         style: "destructive"
       }
     ]
   );
 };

const toggleKeyboard = async () => {
  if (isKeyboardVisible) {
    Keyboard.dismiss();
    await analytics().logEvent('keyboard_hidden', {
      action: 'hide',
      timestamp: new Date().toISOString()
    });
  } else {
    textInputRef.current?.focus();
    await analytics().logEvent('keyboard_shown', {
      action: 'show',
      timestamp: new Date().toISOString()
    });
  }
};

 const renderNote = ({ item }: { item: Note }) => (
   <TouchableOpacity 
     style={[
       styles.note, 
       { backgroundColor: item.color },
       editingNoteId === item.id && styles.editingNote
     ]}
     onPress={() => editNote(item)}
   >
     <View style={styles.noteContent}>
       <Text style={styles.noteText} numberOfLines={4}>{item.text}</Text>
       <Text style={styles.timestamp}>{formatDate(item.updatedAt)}</Text>
     </View>
   </TouchableOpacity>
 );

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.newNoteContainer}>
       <TouchableOpacity 
         style={[
           styles.newNote,
           { backgroundColor: editingNoteId 
             ? notes.find(note => note.id === editingNoteId)?.color 
             : nextNoteColor 
           }
         ]} 
         onPress={() => setIsEditing(true)}
       >
		<TextInput
		  ref={textInputRef}
		  style={styles.input}
		  placeholder="Start your note..."
		  placeholderTextColor="#666"
		  value={currentNote}
		  onChangeText={(text) => {
			setCurrentNote(text);
			if (!isEditing) setIsEditing(true);
		  }}
		  multiline
		  blurOnSubmit={false}
		  keyboardDismissMode="on-drag"
		  autoCorrect={false}
		/>
			<TouchableOpacity 
			  style={[styles.keyboardToggle, {
				backgroundColor: '#f0f0f0',
				borderRadius: 8,
			  }]}
			  onPress={toggleKeyboard}
			>
			  <Text style={{ color: '#999', fontWeight: 'bold', fontSize: 12 }}>
				{isKeyboardVisible ? 'hide keyboard' : 'show keyboard'}
			  </Text>
			</TouchableOpacity>
		</TouchableOpacity>
		
       
       {isEditing && currentNote.trim().length > 0 && (
         <View style={styles.buttonContainer}>
           <TouchableOpacity 
             style={styles.saveButton} 
             onPress={saveNote}
           >
             <Text style={styles.saveButtonText}>
               {editingNoteId ? 'Update' : 'Save'}
             </Text>
           </TouchableOpacity>
           
           {editingNoteId && (
             <>
               <TouchableOpacity 
                 style={styles.deleteButton} 
                 onPress={deleteNote}
               >
                 <Text style={styles.buttonText}>Delete</Text>
               </TouchableOpacity>
               
               <TouchableOpacity 
                 style={styles.cancelButton} 
                 onPress={() => {
                   setCurrentNote('');
                   setIsEditing(false);
                   setEditingNoteId(null);
                   Keyboard.dismiss();
                 }}
               >
                 <Text style={styles.buttonText}>Cancel</Text>
               </TouchableOpacity>
             </>
           )}
         </View>
       )}
     </View>

     <FlatList
       ref={flatListRef}
       data={[...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())}
       renderItem={renderNote}
       keyExtractor={item => item.id}
       numColumns={3}
       contentContainerStyle={styles.notesList}
     />

     <TouchableOpacity 
       style={styles.feedbackButton}
       onPress={() => Linking.openURL('https://forms.gle/UoQtnVqSHomYx3gC8')}
     >
       <Text style={styles.feedbackButtonText}>Suggest Improvements</Text>
     </TouchableOpacity>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
 },
 newNoteContainer: {
   alignItems: 'center',
   padding: 10,
 },
 newNote: {
   width: mainNoteSize,
   height: mainNoteSize,
   padding: 15,
   borderRadius: 8,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
input: {
  fontSize: 20,
  flex: 1,
  fontFamily: 'Rounded Mplus 1c Bold',
},
 buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   width: mainNoteSize,
   marginTop: 10,
   gap: 5,
 },
 saveButton: {
   backgroundColor: '#4CAF50',
   padding: 12,
   borderRadius: 8,
   flex: 1,
   alignItems: 'center',
 },
 deleteButton: {
   backgroundColor: '#f44336',
   padding: 12,
   borderRadius: 8,
   flex: 1,
   alignItems: 'center',
 },
 cancelButton: {
   backgroundColor: '#9e9e9e',
   padding: 12,
   borderRadius: 8,
   flex: 1,
   alignItems: 'center',
 },
 saveButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 note: {
   width: smallNoteSize,
   height: smallNoteSize,
   margin: 5,
   padding: 10,
   borderRadius: 8,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
 noteContent: {
   flex: 1,
   justifyContent: 'space-between',
 },
noteText: {
  fontSize: 10,
  fontFamily: 'Rounded Mplus 1c Bold',
},
 timestamp: {
   fontSize: 10,
   color: '#666',
   marginTop: 5,
 },
 editingNote: {
   opacity: 0.7,
 },
 notesList: {
   padding: 10,
 },
 feedbackButton: {
   position: 'absolute',
   bottom: 40,
   right: 20,
   backgroundColor: 'blue',
   padding: 10,
   borderRadius: 6,
 },
 feedbackButtonText: {
   color: 'white',
   fontSize: 12,
 },
keyboardToggle: {
  position: 'absolute',
  bottom: 15,
  right: 15,
  padding: 8,
  zIndex: 1,
}
});

export default App;