import { createContext, useRef, FC, Dispatch } from 'react'
import { TodoItem, TodoItemsAction, TodoItemsState } from './TodoItemsContext'
import { createTimeCheckWorker } from '@utils/index'
import { ADD, REMOVE, TOGGLE_DONE, LOAD_STATE } from '@actions/types/actionTypes'

export type AddNotification = (todoItem: TodoItem) => void
export type RemoveNotification = (todoItem: Partial<TodoItem>) => void
export type InitializeNotifications = (todoItems: TodoItem[]) => void
export type Notify = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>) => (action: TodoItemsAction) => void

export const NotifierContext = createContext<{ notify: Notify } | null>(null)

const NotifierContextProvider: FC = ({ children }) => {
  	const timeCheckerWorkerRef = useRef<Worker | null>(null)
  
  	const initializeNotifications: InitializeNotifications = (items) => {
		const initWorker = () => {
	  		timeCheckerWorkerRef.current?.terminate()

	  		const worker = createTimeCheckWorker()
	  		timeCheckerWorkerRef.current = worker
	  		worker.postMessage(['init', items])
	  		worker.onmessage = ({ data }: { data: [string, TodoItem[]] }) => {
		  		const [type, items] = data
		  		if (type === 'notify') items.forEach((item) => {
					const taskDate = new Date(item.date as number)
					const [hours, minutes] = [taskDate.getHours(), taskDate.getMinutes()]
					const time = `${hours > 10 ? hours : `0${hours}`}:${minutes > 10 ? minutes : `0${minutes}`}`
			  	
					new Notification(item.title, {
				  		body: `${time}\n${item.details || ''}`,
					})
		  		})
	  		}
		}

	let permitted = Notification.permission === 'granted'

	if (permitted) {
	  	initWorker()
	  	return
	}

	if (Notification.permission !== 'denied') {
		Notification
	  		.requestPermission()
	  		.then((permission) => {
	  		  if (permission === 'granted') initWorker()
	  		})
	}
  }
  
  	const addNotification: AddNotification = (item) => {
		if (Notification.permission === 'granted') timeCheckerWorkerRef.current?.postMessage(['add', item])
  	}

    const removeNotification: RemoveNotification = (item) => {
  		if (Notification.permission === 'granted') timeCheckerWorkerRef.current?.postMessage(['remove', item])
    }

  	const notify: Notify = (state, dispatch) => ({ type, data }) => {
		switch (type) {
	  	  	case ADD:
			addNotification(data as TodoItem)  
			break;
	  	case REMOVE:
			removeNotification(data as TodoItem)
			break;
	  	case TOGGLE_DONE:
			const item = state.todoItems.find((item) => item.id === (data as TodoItem).id)
			if (item?.done) addNotification({ ...item, done: !item.done })
			else removeNotification({ ...item, done: !item?.done })
			break;
	  	case LOAD_STATE:
			initializeNotifications((data as TodoItemsState).todoItems)
			break;
	
	  	default:
			break;
		}
		return dispatch({ type, data })
  	}

  	return (
		<NotifierContext.Provider value={{ notify }}>
	  	{children}
		</NotifierContext.Provider>
  	)
}

export default NotifierContextProvider
