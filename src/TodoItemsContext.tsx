import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    Reducer,
} from 'react';

export interface TodoItem {
    id: string;
    title: string;
    details?: string;
    hours?: string;
    minutes?: string;
    date?: number
    done: boolean;
}

export interface TodoItemsState {
    todoItems: TodoItem[];
}

export interface TodoItemsAction {
    type: 'loadState' | 'add' | 'delete' | 'toggleDone';
    data: TodoItemsState | Partial<TodoItem>
}

const TodoItemsContext = createContext<
    (TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null
>(null);

const defaultState: TodoItemsState = { todoItems: [] };
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer<Reducer<TodoItemsState, TodoItemsAction>>(todoItemsReducer, defaultState);
    
    useEffect(() => {
        const savedState = localStorage.getItem(localStorageKey);

        if (savedState) {
            try {
                dispatch({ type: 'loadState', data: JSON.parse(savedState) });
            } catch {}
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TodoItemsContext.Provider>
    );
};

export const useTodoItems = () => {
    const todoItemsContext = useContext(TodoItemsContext);

    if (!todoItemsContext) {
        throw new Error(
            'useTodoItems hook should only be used inside TodoItemsContextProvider',
        );
    }

    return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction): TodoItemsState {
    switch (action.type) {
        case 'loadState': {
            return action.data as TodoItemsState;
        }
        case 'add': {
            let item = action.data as TodoItem
            const dateNow = new Date()
            const itemDate = item.hours && item.minutes
                ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), +item.hours, +item.minutes )
                : 0

            item = { ...item, id: generateId(), done: false, date: itemDate.valueOf() }
            return {
                ...state,
                todoItems: [
                    { ...item },
                    ...state.todoItems,
                ],
            };
        }
        case 'delete':
            return {
                ...state,
                todoItems: state.todoItems.filter(
                    ({ id }) => id !== (action.data as TodoItem).id,
                ),
            };
        case 'toggleDone':
            const itemIndex = state.todoItems.findIndex(
                ({ id }) => id === (action.data as TodoItem).id,
            );
            const item = state.todoItems[itemIndex];

            return {
                ...state,
                todoItems: [
                    ...state.todoItems.slice(0, itemIndex),
                    { ...item, done: !item.done },
                    ...state.todoItems.slice(itemIndex + 1),
                ],
            };
        default:
            throw new Error();
    }
}

function generateId() {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16,
    ).toString(36)}`;
  }
