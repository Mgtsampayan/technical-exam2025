"use client"

import { useState } from "react"
import { TextField, IconButton, Box } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ImageIcon from "@mui/icons-material/Image"

interface TaskInputProps {
  addTask: (name: string, description: string) => void
}

const TaskInput = ({ addTask }: TaskInputProps) => {
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask(taskName, taskDescription)
      setTaskName("")
      setTaskDescription("")
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, bgcolor: "white", borderRadius: 30, p: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "tan.200",
          borderRadius: "50%",
          width: 48,
          height: 48,
          mr: 1,
        }}
      >
        <ImageIcon sx={{ color: "tan.700" }} />
      </Box>
      <TextField
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter new task here"
        variant="standard"
        fullWidth
        sx={{
          mr: 1,
          "& .MuiInput-underline:before": { borderBottom: "none" },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
        }}
        onKeyPress={(e) => {cm
          if (e.key === "Enter") {
            handleAddTask()
          }
        }}
      />
      <IconButton
        onClick={handleAddTask}
        sx={{ bgcolor: "navy.900", color: "white", "&:hover": { bgcolor: "navy.800" } }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}

export default TaskInput

