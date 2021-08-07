import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useCallback,
    Reducer,
} from 'react';
import { addItem, deleteItem, loadState, toggleDone } from '@src/actions/creators/actionCreators';
import { NotifierContext } from '@src/context/Notifier';
import { ADD, REMOVE, TOGGLE_DONE, LOAD_STATE } from '@actions/types/actionTypes'

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
    type: typeof LOAD_STATE | typeof ADD | typeof REMOVE | typeof TOGGLE_DONE;
    data: TodoItemsState | Partial<TodoItem>;
}

const TodoItemsContext = createContext<
    (
        TodoItemsState
        & { dispatch: (action: TodoItemsAction) => void }
        & {
            add: (data: Partial<TodoItem>) => void,
            remove: (data: Partial<TodoItem>) => void,
            toggle: (data: Partial<TodoItem>) => void,
            load: (data: TodoItemsState) => void,
        }
    ) | null
>(null);

const defaultState: TodoItemsState = { todoItems: [] };
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer<Reducer<TodoItemsState, TodoItemsAction>>(todoItemsReducer, defaultState);
    const { notify } = useContext(NotifierContext)!

    const add = addItem(state, dispatch, notify)
    const remove = deleteItem(state, dispatch, notify)
    const toggle = toggleDone(state, dispatch, notify)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const load = useCallback(loadState(state, dispatch, notify), [])
    
    useEffect(() => {
        const savedState = localStorage.getItem(localStorageKey);

        if (savedState) {
            try {
                const data = JSON.parse(savedState) as TodoItemsState
                load(data);
            } catch {}
        }
    }, [ load ]);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{ ...state, dispatch, add, remove, load, toggle }}>
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
        case LOAD_STATE: {
            return action.data as TodoItemsState;
        }
        case ADD:
            return {
                ...state,
                todoItems: [
                    { ...(action.data as TodoItem) },
                    ...state.todoItems,
                ],
            };
        case REMOVE:
            return {
                ...state,
                todoItems: state.todoItems.filter(
                    ({ id }) => id !== (action.data as TodoItem).id,
                ),
            };
        case TOGGLE_DONE:
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
