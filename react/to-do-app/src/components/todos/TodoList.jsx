import { useState } from 'react';
import TodoItem from './TodoItem';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SearchIcon from '@mui/icons-material/Search';
import AdjustIcon from '@mui/icons-material/Adjust';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material/styles';
import { List, Divider, Dialog, Card, CardContent, CardActions, Button, TextField, InputAdornment, Chip, Autocomplete } from '@mui/material';
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useEffect } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const TodoList = () => {
  const [dialog, setDialog] = useState(false);
  const [dialogCreate, setDialogCreate] = useState(false);
  const [tags, setTags] = useState([]);
  const [editedTodo, setEditedTodo] = useState(null);
  const [newTodo, setNewTodo] = useState('')
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const auth = useAuth();
  const axios = useAxios();

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get('/todo', { params: { search, searchTags } });
      setTodos(data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [search, searchTags]);

  const createTodo = async () => {    
    try {
      let data = {
        text: newTodo,
        isCompleted: false,
        tags: tags
      }

      await axios.post('/todo', data).then(() => {
        setTodos([data, ...todos]);
        setNewTodo('');
        setTags([]);
        setDialogCreate(false);
        fetchTodos();
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  const removeTodo = async (id) => {
    await axios.delete(`/todo/${id}`).then(() => {
      setTodos(todos.filter(todo => todo._id !== id));
    });
  }

  const completeTodo = async (id) => {
    await axios.put(`/todo/${id}`, {
      isCompleted: !todos.find(todo => todo._id === id).isCompleted
    }).then(() => {
      const updatedTodos = todos.map(todo => {
        if (todo._id === id) {
          todo.isCompleted = !todo.isCompleted;
        }
        return todo;
      });
      setTodos(updatedTodos);
    })
  }

  const editTodo = async () => {
    let currentTodo = todos.find(todo => todo._id === editedTodo._id);
    let todo = { 
      ...currentTodo, 
      ...editedTodo,
      tags: editedTodo.tags,
      file: file,
      image: image
     };
    
    const formData = new FormData();
    for (let key in todo) {
      formData.append(key, todo[key]);
    }
    
    await axios.put(`/todo/${todo._id}`, formData, {
      headers: {"Content-Type": "multipart/form-data"}
    }).then(() => {
      setDialog(false);
      setEditedTodo(
        {
          text: '',
          tags: [],
          file: null,
          image: null
        }
      );
      fetchTodos();
    });

  }

  const openEditDialog = (todo) => {
    setEditedTodo({ ...todo });
    setDialog(true);
  };

  const completedTodos = todos.filter(todo => todo?.isCompleted);
  const pendingTodos = todos.filter(todo => !todo?.isCompleted);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="nav" aria-label="main mailbox folders">

  
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField 
          label="Serch Todo" 
          style={{ width: '50%'}}
          variant="outlined" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ marginTop: '10px', marginRight: '10px'}}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <TextField 
          label="Serch Tags" 
          style={{ width: '50%'}}
          variant="outlined" 
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
          sx={{ marginTop: '10px', marginRight: '10px'}}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </div>

     
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="my-4">Tasks</h3>
        <Button variant="contained" onClick={() => setDialogCreate(true)}style={{ marginBottom: '10px'}} startIcon={<AddCircleOutlineIcon />}>
          Add Todo
        </Button>
      </div>

      <Divider />

      {pendingTodos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          removeTodo={removeTodo}
          completeTodo={completeTodo}
          editTodo={openEditDialog}
        />
      ))}

      {completedTodos.length > 0 && (
        <div>
          <h3 className="my-4">Completed</h3>
          <Divider />

          {completedTodos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              removeTodo={removeTodo}
              completeTodo={completeTodo}
              editTodo={openEditDialog}
            />
          ))}
        </div>
      )}

      {/*  Create New Task Dialog */}
      <Dialog open={dialogCreate} onClose={() => setDialogCreate(false)}>
        <Card variant="flat" style={{ width: '500px'}}>
          <h3 style={{ marginLeft: '15px'}}> Add Todo </h3>
          <CardContent>
            <TextField 
              label="New Todo" 
              variant="outlined"  
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" onClick={createTodo}>
                    <RadioButtonUncheckedIcon />
                  </InputAdornment>
                )
              }}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  createTodo()
                }
              }}        
            />

          <Autocomplete
            multiple
            style={{ width: '50%'}}
            value={tags}
            options={[]}
            onChange={(event, newValue) => {
              setTags(newValue);
            }}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                sx={{ marginTop: '10px', width: '470px'}}
                placeholder="Add Tag"
                variant="outlined" 
                fullWidth
              />
            )}
          />
          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setDialogCreate(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={createTodo}>
              Save
            </Button>
          </CardActions>
        </Card>
      </Dialog>

      {/*  Edit Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <Card variant="flat" style={{ width: '500px'}}>
          <h3 style={{ marginLeft: '15px'}}> Edit Todo </h3>
          <CardContent>
            <TextField
              value={editedTodo?.text}
              onChange={(e) => setEditedTodo({ ...editedTodo, text: e.target.value })}
              label="Edit Task"
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <AdjustIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />

        <Autocomplete
            multiple
            value={editedTodo?.tags || []}
            options={[]}
            onChange={(event, newValue) => {
              setEditedTodo({ ...editedTodo, tags: newValue });
            }}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                sx={{ marginTop: '10px', width: '470px'}}
                placeholder="Add Tag"
                variant="outlined" 
                fullWidth
              />
            )}
          />

            <p> Optional </p>
            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                component="label"
                variant="outlined"
                role={undefined}
                fullWidth
                style={{ marginTop: '10px'}}
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if(selectedFile.type.includes('application/')) {
                    setFile(selectedFile);
                  }else {
                    alert('Please select a file');
                  }
                }} />
              </Button>
              {file ? <Chip label={file?.name} style={{ marginTop: '10px' }} /> : null}

              
              <Button
                component="label"
                variant="outlined"
                fullWidth
                role={undefined}
                style={{ marginTop: '10px'}}
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Image Thumbnail
                <VisuallyHiddenInput type="file" onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if(selectedFile.type.includes('image/')) {
                    setImage(selectedFile);
                  }else {
                    alert('Please select an image file');
                  }
                }} />
              </Button>
              {image ? <Chip label={image?.name} style={{ marginTop: '10px' }} /> : null}
            </div>

          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={editTodo}>
              Save
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    </List>
  );
};

export default TodoList;
