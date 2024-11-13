import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false, completedAt: null }]);
      setTask('');
    }
  };

  const toggleCompleteTask = (taskId) => {
    setTasks(tasks.map((item) =>
      item.id === taskId
        ? {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date().toLocaleString() : null, 
          }
        : item
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((item) => item.id !== taskId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleCompleteTask(item.id)}>
            <View style={[styles.taskContainer, item.completed && styles.completedTask]}>
              <Text style={[styles.taskText, item.completed && styles.completedText]}>
                {item.text}
              </Text>
              {item.completed && item.completedAt && (
                <Text style={styles.completedAtText}>Completed at: {item.completedAt}</Text>
              )}
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d3557',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  addButton: {
    backgroundColor: '#457b9d',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#dee2e6',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 18,
    color: '#343a40',
  },
  completedTask: {
    backgroundColor: '#d4edda', // Light green background for completed tasks
  },
  completedText: {
    color: '#28a745', // Darker green for the text
  },
  completedAtText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  deleteButton: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
