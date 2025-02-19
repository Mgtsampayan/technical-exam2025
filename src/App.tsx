import { useState, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, Container, List, Button, Box, AppBar, Toolbar, Typography, Snackbar, Alert, Avatar, CircularProgress } from "@mui/material"
import Header from "./components/Header"
import TaskInput from "./components/TaskInput"
import TaskItem from "./components/TaskItem"
import Login from "./components/Login"
import type { Task } from "./type"
import { AuthProvider, useAuth } from "./AuthContext/AuthContext"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d1757",
    },
    secondary: {
      main: "#e7d5c9",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to bottom, #fff5f5, #e6f0ff)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
  },
})

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user?.id) {
          const savedTasks = localStorage.getItem(`tasks_${user.id}`);
          if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
          }
        }
      } catch (err) {
        handleError('Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user?.id]);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const addTask = async (name: string, description: string) => {
    try {
      setIsLoading(true);
      if (!name.trim()) {
        handleError('Task name cannot be empty');
        return;
      }
      setTasks([...tasks, { 
        id: Date.now(), 
        name: name.trim(), 
        description: description.trim(), 
        completed: false,
        userId: user?.id 
      }]);
    } catch (err) {
      handleError('Error adding task');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      setIsLoading(true);
      setTasks(tasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      handleError('Error updating task');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setIsLoading(true);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      handleError('Error deleting task');
    } finally {
      setIsLoading(false);
    }
  };

  const editTask = async (id: number, name: string, description: string) => {
    try {
      setIsLoading(true);
      if (!name.trim()) {
        handleError('Task name cannot be empty');
        return;
      }
      setTasks(tasks.map((task) => 
        task.id === id ? { ...task, name: name.trim(), description: description.trim() } : task
      ));
    } catch (err) {
      handleError('Error editing task');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompletedTasks = async () => {
    try {
      setIsLoading(true);
      setTasks(tasks.filter((task) => !task.completed));
    } catch (err) {
      handleError('Error removing completed tasks');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const userTasks = tasks.filter(task => task.userId === user?.id);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="subtitle1">
              {user?.email || 'User'}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 3, boxShadow: 3 }}>
          <Header />
          <TaskInput addTask={addTask} disabled={isLoading} />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <List>
                {userTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    toggleTask={toggleTask} 
                    deleteTask={deleteTask} 
                    editTask={editTask}
                    disabled={isLoading}
                  />
                ))}
              </List>
              {userTasks.some((task) => task.completed) && (
                <Button 
                  onClick={removeCompletedTasks} 
                  variant="outlined" 
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isLoading}
                >
                  Remove Completed Tasks
                </Button>
              )}
            </>
          )}
        </Box>
      </Container>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TodoApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;