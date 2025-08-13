import { Box, TextField, Button, Typography, Paper, Checkbox, Divider, IconButton, Badge } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useMemo, useState, useCallback } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const FILTER_TYPES = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;

type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

const useTaskStats = (tasks: Task[], filter: FilterType) => {
  return useMemo(() => {
    const filteredTasks = filter === FILTER_TYPES.COMPLETED 
      ? tasks.filter(task => task.completed)
      : filter === FILTER_TYPES.ACTIVE 
      ? tasks.filter(task => !task.completed)
      : tasks;
    
    const totalCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.filter(task => task.completed).length;
    
    return { filteredTasks, totalCount, completedCount };
  }, [tasks, filter]);
};

export const EnhancedTodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<FilterType>(FILTER_TYPES.ALL);
  
  const { filteredTasks, totalCount, completedCount } = useTaskStats(tasks, filter);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  }, []);

  const handleAddTask = useCallback(() => {
    if (newTask.trim() !== "") {
      setTasks(prevTasks => [
        ...prevTasks,
        { id: Date.now(), text: newTask.trim(), completed: false }
      ]);
      setNewTask("");
    }
  }, [newTask]);

  const handleToggleComplete = useCallback((id: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  }, [handleAddTask]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const handleTaskClick = useCallback((taskId: number) => {
    handleToggleComplete(taskId);
  }, [handleToggleComplete]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    handleDeleteTask(taskId);
  }, [handleDeleteTask]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        padding: "40px 200px",
      }}
    >
      <Paper sx={{ padding: 4, borderRadius: 4 }} elevation={3}>
        <Typography variant="h1" align="center">TODO List</Typography>
        <Divider sx={{ margin: '20px 0' }} />
        <Box sx={{ display: "flex", gap: 2, flexDirection: "row", justifyContent: 'center' }}>
          <Typography variant="body1">Company: <strong>OpenSolar</strong></Typography>
          <Typography variant="body1">Submitted by: <strong>Jhon Aaron Casipit</strong></Typography>
          <Typography variant="body1">Role: <strong>Software Engineer</strong></Typography>
        </Box>

        <Divider sx={{ margin: '20px 0' }} />
      </Paper>
      <Paper sx={{ padding: 2, borderRadius: 4 }} elevation={3}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Add new task"
            value={newTask}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            sx={{ flex: 1, maxWidth: "500px" }}
          />
          <Button variant="contained" onClick={handleAddTask} sx={{ flex: 1, maxWidth: "100px" }}>Add</Button>
          <Box border={1} marginX={"auto"}/>

          <Badge badgeContent={tasks.length} color="primary" showZero>
            <Button variant="outlined" color="primary" disabled={filter === FILTER_TYPES.ALL} onClick={() => handleFilterChange(FILTER_TYPES.ALL)} sx={{ width: "150px" }}>All</Button>
          </Badge>
          <Badge badgeContent={totalCount} color="secondary" showZero>
            <Button variant="outlined" color="secondary" disabled={filter === FILTER_TYPES.ACTIVE} onClick={() => handleFilterChange(FILTER_TYPES.ACTIVE)} sx={{ width: "150px" }}>Active</Button>
          </Badge>
          <Badge badgeContent={completedCount} color="success" showZero>
            <Button variant="outlined" color="success" disabled={filter === FILTER_TYPES.COMPLETED} onClick={() => handleFilterChange(FILTER_TYPES.COMPLETED)} sx={{ width: "150px" }}>Completed</Button>
          </Badge>
        </Box>
      </Paper>
      <Paper sx={{ padding: 2, borderRadius: 4, minHeight: "300px" }} elevation={3}>
        {filteredTasks.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredTasks.map((task) => (
              <Paper
                key={task.id}
                elevation={1}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: task.completed ? "success.light" : "grey.200",
                  backgroundColor: task.completed ? "success.50" : "background.paper",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    elevation: 2,
                    transform: "translateY(-1px)",
                    boxShadow: 2,
                  },
                }}
                onClick={() => handleTaskClick(task.id)}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": {
                        color: "success.main",
                      },
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "text.secondary" : "text.primary",
                      flex: 1,
                      fontWeight: task.completed ? 400 : 500,
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {task.text}
                  </Typography>
                  {task.completed && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "success.main",
                        marginLeft: "auto",
                      }}
                    />
                  )}
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, task.id)}
                    size="small"
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No {filter === FILTER_TYPES.ALL ? "" : filter} tasks found
            </Typography>
            <Typography variant="body2">
              {filter === FILTER_TYPES.ALL 
                ? "Add some tasks to get started!" 
                : filter === FILTER_TYPES.ACTIVE 
                ? "All tasks are completed!" 
                : "No completed tasks yet."
              }
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
