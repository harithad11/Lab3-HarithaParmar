import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function App() {
  const [task, setTask] = useState(''); // State for task input
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [editingTaskId, setEditingTaskId] = useState(null); // Task ID for the task being edited

  // Add task with animation states
  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        completedAt: null,
        slideAnim: new Animated.Value(300), // New slide animation for this task
        rotateAnim: new Animated.Value(0),  // New rotation animation for this task
      };

      Animated.spring(newTask.slideAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();

      setTasks([...tasks, newTask]);
      setTask(''); // Clear the input after adding task
    }
  };

  // Toggle completion state of a task
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

  // Delete task with animation
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);
    const taskToDelete = tasks.find((item) => item.id === taskId);

    Animated.timing(taskToDelete.slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTasks(updatedTasks); // Update the state after the animation completes
    });
  };

  // Start editing task
  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTaskId(taskId); // Mark the task as being edited
    setTask(taskToEdit.text); // Set the input field to the task's current text
  };

  // Update task after editing
  const updateTask = () => {
    if (task.trim()) {
      const taskToUpdate = tasks.find((item) => item.id === editingTaskId);

      Animated.timing(taskToUpdate.rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        taskToUpdate.rotateAnim.setValue(0); // Reset after rotation
      });

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
            <Animated.View
              style={[
                styles.taskContainer,
                item.completed && styles.completedTask,
                {
                  transform: [
                    {
                      translateX: item.slideAnim, // Use individual slideAnim
                    },
                    {
                      rotate: item.rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
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
            </Animated.View>
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
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C3E50',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#2980B9',
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
    backgroundColor: '#D5F5E3',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#27AE60',
  },
  completedAtText: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 5,
  },
  deleteButton: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: '#F39C12',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});
