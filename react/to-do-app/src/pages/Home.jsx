import TodoList from '../components/todos/TodoList'
import Navbar from '../components/layouts/Navbar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function App() {  
  return (
    <>
      <Navbar />
        <Card variant="flat" style={{ width: '800px', margin: '0 auto'}}>
          <CardContent>
            <h3>Todo App</h3>
            <TodoList />
          </CardContent>
        </Card>
    </>
  )
}

export default App
