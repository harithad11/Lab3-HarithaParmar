import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState(''); // State for task input
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [editingTaskId, setEditingTaskId] = useState(null); // Task ID for the task being edited

  // Load tasks from AsyncStorage when the app loads
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          const tasksWithAnimations = parsedTasks.map(task => ({
            ...task,
            slideAnim: new Animated.Value(0),
            rotateAnim: new Animated.Value(task.rotateAnim || 0),
          }));
          setTasks(tasksWithAnimations);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever the tasks list changes
  useEffect(() => {
    const saveTasks = async () => {
      try {

        const tasksToSave = tasks.map(task => {
          const { slideAnim, rotateAnim, ...taskWithoutAnimations } = task;
          return taskWithoutAnimations;
        });
        await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };
    saveTasks();
  }, [tasks]);

  // Add task with animation states
  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        completedAt: null,
        slideAnim: new Animated.Value(300),
        rotateAnim: new Animated.Value(0),
      };

      Animated.spring(newTask.slideAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();

      setTasks([...tasks, newTask]);
      setTask('');
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
      setTasks(updatedTasks);
    });
  };

  // Start editing task
  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTaskId(taskId);
    setTask(taskToEdit.text);
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
        taskToUpdate.rotateAnim.setValue(0);
      });

      setTasks(tasks.map((item) =>
        item.id === editingTaskId
          ? { ...item, text: task }
          : item
      ));
      setTask('');
      setEditingTaskId(null);
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
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editingTaskId ? updateTask : addTask}
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
                      translateX: item.slideAnim,
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
              {/* Edit button for Task */}
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
    backgroundColor: '#E5E8E8', // Light grey background
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C3E50', // Classic dark blue-grey color
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#BDC3C7', // Light grey border under title
    paddingBottom: 10,
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
    borderWidth: 1,
    borderColor: '#BDC3C7', // Light grey border around input container
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#34495E', // Dark grey color for text
    backgroundColor: '#F4F6F6', // Very light grey background for input
  },
  addButton: {
    backgroundColor: '#2980B9', // Classic blue
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
    borderWidth: 1,
    borderColor: '#2980B9', // Border around the button
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
    borderTopWidth: 1,
    borderTopColor: '#BDC3C7', // Light grey border on top
  },
  taskText: {
    fontSize: 18,
    color: '#2C3E50', // Classic dark blue-grey for task text
  },
  completedTask: {
    backgroundColor: '#D5F5E3', // Light green background for completed task
    borderLeftWidth: 5,
    borderLeftColor: '#27AE60', // Green border to indicate completion
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#27AE60', // Green for completed text
  },
  completedAtText: {
    fontSize: 12,
    color: '#95A5A6', // Light grey color for date text
    marginTop: 5,
  },
  deleteButton: {
    color: '#E74C3C', // Classic red for delete button
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: '#F39C12', // Classic yellow for edit button
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});
