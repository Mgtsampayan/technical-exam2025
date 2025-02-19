import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, TextField, Box } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CloseIcon from "@mui/icons-material/Close"
import ImageIcon from "@mui/icons-material/Image"
import { useState } from "react"
import type { Task } from "../type"

interface TaskItemProps {
  task: Task
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
  editTask: (id: number, name: string, description: string) => void
}

const TaskItem = ({ task, toggleTask, deleteTask, editTask }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(task.name)
  const [editedDescription, setEditedDescription] = useState(task.description)

  const handleSave = () => {
    editTask(task.id, editedName, editedDescription)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(task.name)
    setEditedDescription(task.description)
    setIsEditing(false)
  }

  return (
    <ListItem
      sx={{
        bgcolor: task.completed ? "navy.900" : "grey.100",
        borderRadius: 30,
        mb: 1,
        transition: "background-color 0.3s",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <IconButton sx={{ bgcolor: "tan.200", mr: 2 }}>
          <ImageIcon sx={{ color: "tan.700" }} />
        </IconButton>
        {isEditing ? (
          <Box sx={{ flex: 1, mr: 2 }}>
            <TextField
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              size="small"
              multiline
              rows={2}
            />
          </Box>
        ) : (
          <ListItemText 
            primary={task.name}
            secondary={task.description} 
            sx={{ color: task.completed ? "white" : "inherit" }}
          />
        )}
        <ListItemSecondaryAction>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave} sx={{ color: "success.main" }}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} sx={{ color: "error.main" }}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                edge="end"
                onClick={() => toggleTask(task.id)}
                sx={{ color: task.completed ? "white" : "grey.500" }}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => setIsEditing(true)}
                sx={{ color: task.completed ? "white" : "grey.500" }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => deleteTask(task.id)}
                sx={{ color: task.completed ? "white" : "grey.500" }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItemSecondaryAction>
      </Box>
    </ListItem>
  )
}
export default TaskItem

