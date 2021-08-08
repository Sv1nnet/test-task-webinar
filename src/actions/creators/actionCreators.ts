import { Dispatch } from 'react';
import { Notify } from '@context/Notifier';
import { TodoItem, TodoItemsAction, TodoItemsState } from '@src/context/TodoItemsContext';
import { ADD, REMOVE, TOGGLE_DONE, LOAD_STATE } from '@actions/types/actionTypes';
import { generateId } from '@utils/index';

export const addItem = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  	const dateNow = new Date();
  	const itemDate = data.hours && data.minutes
    	? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), +data.hours, +data.minutes )
    	: 0;

  	const action: TodoItemsAction = { type: ADD, data: { ...data, id: generateId(), done: false, date: itemDate.valueOf() } };
  	return notify(state, dispatch)(action);
}

export const deleteItem = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  	const action: TodoItemsAction = { type: REMOVE, data };
  	return notify(state, dispatch)(action);
}

export const toggleDone = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: Partial<TodoItem>) => {
  	const action: TodoItemsAction = { type: TOGGLE_DONE, data };
  	return notify(state, dispatch)(action);
}

export const loadState = (state: TodoItemsState, dispatch: Dispatch<TodoItemsAction>, notify: Notify) => (data: TodoItemsState) => {
	const action: TodoItemsAction = { type: LOAD_STATE, data };
	return notify(state, dispatch)(action);
}
