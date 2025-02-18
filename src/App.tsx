import { useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, Container, List, Button, Box, AppBar, Toolbar, Typography } from "@mui/material"
import Header from "./components/Header"
import TaskInput from "./components/TaskInput"
import TaskItem from "./components/TaskItem"
import Login from "./components/Login"
import type { Task } from "./type"
import { AuthProvider, useAuth } from "./AuthContext/AuthContext"

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d1757", // navy.900
    },
    secondary: {
      main: "#e7d5c9", // tan.200
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
  const [tasks, setTasks] = useState<Task[]>([])
  const { isAuthenticated, logout } = useAuth()

  const addTask = (name: string, description: string) => {
    setTasks([...tasks, { id: Date.now(), name, description, completed: false }])
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const removeCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed))
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
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
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
            ))}
          </List>
          {tasks.some((task) => task.completed) && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button onClick={removeCompletedTasks} variant="outlined" sx={{ borderRadius: 30, mr: 1 }}>
                Remove All Done Tasks
              </Button>
            </Box>
          )}
        </Box>
      </Container>
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

