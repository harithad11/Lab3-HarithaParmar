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
  const [task, setTask] = useState(''); // State for task input
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [editingTaskId, setEditingTaskId] = useState(null); // Task ID for the task being edited

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false, completedAt: null }]);
      setTask(''); // Clear the input after adding task
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

  // Start editing task - This is Task C: Edit Tasks
  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTaskId(taskId); // Mark the task as being edited
    setTask(taskToEdit.text); // Set the input field to the task's current text
  };

  // Update task after editing - This is Task C: Edit Tasks
  const updateTask = () => {
    if (task.trim()) {
      setTasks(tasks.map((item) =>
        item.id === editingTaskId
          ? { ...item, text: task } // Update task text
          : item
      ));
      setTask(''); // Clear the input field
      setEditingTaskId(null); // Reset editing state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add or Edit a task"
          value={task}
          onChangeText={(text) => setTask(text)} // Update task state with input text
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editingTaskId ? updateTask : addTask} // If editing, update task; else add new task
        >
          <Text style={styles.addButtonText}>{editingTaskId ? 'Ok' : '+'}</Text>
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
              {/* Edit button for Task C */}
              <TouchableOpacity onPress={() => startEditing(item.id)}>
                <Text style={styles.editButton}>Edit</Text>
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
    backgroundColor: '#F5F5F5', // Light background for a professional feel
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C3E50', // Deep professional blue
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', // Clean background for input
    shadowColor: '#BDC3C7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#34495E',
    backgroundColor: '#ecf0f1',
  },
  addButton: {
    backgroundColor: '#2980B9', // Professional blue
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
    shadowColor: '#2980B9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#BDC3C7',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 18,
    color: '#2C3E50',
  },
  completedTask: {
    backgroundColor: '#D5F5E3', // Light green for completed tasks
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#27AE60', // Dark green for completed task text
  },
  completedAtText: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 5,
  },
  deleteButton: {
    color: '#E74C3C', // Classic red for delete
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: '#F39C12', // Bright yellow for edit
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});
