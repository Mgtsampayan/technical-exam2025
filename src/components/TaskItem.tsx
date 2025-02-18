import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import DeleteIcon from "@mui/icons-material/Delete"
import ImageIcon from "@mui/icons-material/Image"
import type { Task } from "../type"

interface TaskItemProps {
  task: Task
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
}

const TaskItem = ({ task, toggleTask, deleteTask }: TaskItemProps) => {
  return (
    <ListItem
      sx={{
        bgcolor: task.completed ? "navy.900" : "grey.100",
        borderRadius: 30,
        mb: 1,
        transition: "background-color 0.3s",
      }}
    >
      <IconButton sx={{ bgcolor: "tan.200", mr: 2 }}>
        <ImageIcon sx={{ color: "tan.700" }} />
      </IconButton>
      <ListItemText primary={task.name} sx={{ color: task.completed ? "white" : "inherit" }} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => toggleTask(task.id)}
          sx={{ color: task.completed ? "white" : "grey.500" }}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={() => deleteTask(task.id)}
          sx={{ color: task.completed ? "white" : "grey.500" }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
export default TaskItem

