import { Dispatch } from 'react'
import { Notify } from './Notifier'
import { TodoItem, TodoItemsAction, TodoItemsState } from './TodoItemsContext'
import { generateId } from './utils'


export const addItem = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  const dateNow = new Date()
  const itemDate = data.hours && data.minutes
    ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), +data.hours, +data.minutes )
    : 0

  const action: TodoItemsAction = { type: 'add', data: { ...data, id: generateId(), done: false, date: itemDate.valueOf() } }
  return notify(state, dispatch)(action)
}

export const deleteItem = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  const action: TodoItemsAction = { type: 'delete', data }
  return notify(state, dispatch)(action)
}

export const toggleDone = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  const action: TodoItemsAction = { type: 'toggleDone', data }
  return notify(state, dispatch)(action)
}

export const loadState = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: TodoItemsState) => {
  const action: TodoItemsAction = { type: 'loadState', data }
  return notify(state, dispatch)(action)
}
