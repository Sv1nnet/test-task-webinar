import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TodoItemsList } from '@src/components/todo_items/TodoItems';
import { TodoItemsContextProvider } from '@context/TodoItemsContext';
import { TodoItemForm } from '@components/index';
import Notifier from '@context/Notifier';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#9012fe',
        },
        secondary: {
            main: '#b2aabf',
        },
    },
});

function App() {
    return (
        <Notifier>
            <TodoItemsContextProvider>
                <ThemeProvider theme={theme}>
                    <Content />
                </ThemeProvider>
            </TodoItemsContextProvider>
        </Notifier>
    );
}

function Content() {
    return (
        <Container maxWidth="sm">
            <header>
                <Typography variant="h2" component="h1">
                    Todo List
                </Typography>
            </header>
            <main>
                <TodoItemForm />
                <TodoItemsList />
            </main>
        </Container>
    );
}

export default App;
