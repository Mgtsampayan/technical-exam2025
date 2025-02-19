import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, TextField, Box } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CloseIcon from "@mui/icons-material/Close"
import ImageIcon from "@mui/icons-material/Image"
import { useState, useCallback } from "react"
import type { Task } from "../type"

interface TaskItemProps {
  task: Task
  toggleTask: (id: number) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  editTask: (id: number, name: string, description: string) => Promise<void>
}

const TaskItem = ({ task, toggleTask, deleteTask, editTask }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(task.name)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [isLoading, setIsLoading] = useState(false)
  const handleSave = useCallback(async () => {
    if (!editedName.trim()) return
    
    try {
      setIsLoading(true)
      await editTask(task.id, editedName.trim(), editedDescription.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setIsLoading(false)
    }
  }, [editTask, task.id, editedName, editedDescription])
  const handleCancel = useCallback(() => {
    setEditedName(task.name)
    setEditedDescription(task.description)
    setIsEditing(false)
  }, [task.name, task.description])
  const handleToggle = useCallback(async () => {
    try {
      setIsLoading(true)
      await toggleTask(task.id)
    } catch (error) {
      console.error('Failed to toggle task:', error)
    } finally {
      setIsLoading(false)
    }
  }, [toggleTask, task.id])
  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true)
      await deleteTask(task.id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setIsLoading(false)
    }
  }, [deleteTask, task.id])
  return (
    <ListItem
      sx={{
        bgcolor: task.completed ? "navy.900" : "grey.100",
        borderRadius: 30,
        mb: 1,
        transition: "background-color 0.3s",
        flexDirection: "column",
        alignItems: "stretch",
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <IconButton 
          sx={{ bgcolor: "tan.200", mr: 2 }}
          disabled={isLoading}
        >
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
              disabled={isLoading}
              placeholder="Task name"
              error={!editedName.trim()}
              helperText={!editedName.trim() ? "Name is required" : ""}
            />
            <TextField
              fullWidth
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              size="small"
              multiline
              rows={2}
              disabled={isLoading}
              placeholder="Task description (optional)"
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
              <IconButton 
                onClick={handleSave} 
                sx={{ color: "success.main" }}
                disabled={isLoading || !editedName.trim()}
                aria-label="Save changes"
              >
                <SaveIcon />
              </IconButton>
              <IconButton 
                onClick={handleCancel} 
                sx={{ color: "error.main" }}
                disabled={isLoading}
                aria-label="Cancel editing"
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                edge="end"
                onClick={handleToggle}
                sx={{ color: task.completed ? "white" : "grey.500" }}
                disabled={isLoading}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => setIsEditing(true)}
                sx={{ color: task.completed ? "white" : "grey.500" }}
                disabled={isLoading}
                aria-label="Edit task"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={handleDelete}
                sx={{ color: task.completed ? "white" : "grey.500" }}
                disabled={isLoading}
                aria-label="Delete task"
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

