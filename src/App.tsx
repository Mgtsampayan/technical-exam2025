import { useState, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, Container, List, Button, Box, AppBar, Toolbar, Typography, Snackbar, Alert } from "@mui/material"
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
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 3000)
  }

  const addTask = (name: string, description: string) => {
    try {
      if (!name.trim()) {
        handleError('Task name cannot be empty')
        return
      }
      setTasks([...tasks, { 
        id: Date.now(), 
        name: name.trim(), 
        description: description.trim(), 
        completed: false,
        userId: user?.id 
      }])
    } catch (error) {
      handleError('Failed to add task')
    }
  }

  const toggleTask = async (id: number) => {
    try {
      setIsLoading(true)
      setTasks(tasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ))
    } catch (error) {
      handleError('Failed to toggle task')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setIsLoading(true)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      handleError('Failed to delete task')
    } finally {
      setIsLoading(false)
    }
  }

  const editTask = async (id: number, name: string, description: string) => {
    try {
      setIsLoading(true)
      if (!name.trim()) {
        handleError('Task name cannot be empty')
        return
      }
      setTasks(tasks.map((task) => 
        task.id === id ? { ...task, name: name.trim(), description: description.trim() } : task
      ))
    } catch (error) {
      handleError('Failed to edit task')
    } finally {
      setIsLoading(false)
    }
  }

  const removeCompletedTasks = () => {
    try {
      setTasks(tasks.filter((task) => !task.completed))
    } catch (error) {
      handleError('Failed to remove completed tasks')
    }
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const userTasks = tasks.filter(task => task.userId === user?.id)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="sm"
        sx={{
          py: 4,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 3, boxShadow: 3 }}>
          <Header />
          <TaskInput addTask={addTask} />
          <List sx={{ maxHeight: "50vh", overflowY: "auto" }}>
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button 
                onClick={removeCompletedTasks} 
                variant="outlined" 
                sx={{ borderRadius: 30, mr: 1 }}
                disabled={isLoading}
              >
                Remove All Done Tasks
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TodoApp />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

