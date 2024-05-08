import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Chip, Button } from '@mui/material';
import fileDownload from 'js-file-download';

export default function TodoItem({ todo, completeTodo, editTodo, removeTodo }) {

  const downloadFile = (file) => {
    fileDownload(file, file.split('/').pop());
  }

  return (
    <>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-label="main mailbox folders"
      >
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <IconButton edge="start" onClick={() => completeTodo(todo._id)}>
                {todo?.isCompleted ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              </IconButton>
            </ListItemIcon>

            <span style={{ marginRight: "5px" }}>
              {todo?.image ? <img src={todo?.image} alt="thumbnail" width={32} height={32} className="rounded-full"  /> : ""}
            </span>

            <ListItemText>
              <span className={`${todo?.isCompleted ? "line-through" : ""}`}>
                {todo?.text}
              </span>
              <br />
              {todo?.tags?.length > 0 ? 
                todo.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" />
                ))
                : ""
              } 


                {todo?.file &&
                  typeof todo.file === 'string' &&  
                  todo.file.split('/').pop() && 
                  <Button onClick={() => downloadFile(todo?.file)}>
                    <ArrowCircleDownIcon />
                    {todo?.file?.split('/').pop()}
                  </Button>
                }
            </ListItemText>

            <IconButton edge="end" aria-label="delete" color="error" onClick={() => removeTodo(todo._id)}>
              <DeleteIcon />
            </IconButton>

            <IconButton edge="end" aria-label="edit" color="primary" onClick={() => editTodo(todo)}>
              <EditIcon />
            </IconButton>
          </ListItemButton>
        </ListItem>
      </List>
    </>
  )
}
