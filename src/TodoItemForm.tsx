import { TodoItem, useTodoItems } from './TodoItemsContext';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useInputStyles = makeStyles(() => ({
    root: {
        marginBottom: 24,
    },
    time: {
        maxWidth: '50px',
    },
    hours: {
        '& label': {
            '&.MuiInputLabel-shrink': {
                transform: 'translate(7px, 1.5px) scale(0.75)',
            },
            transformOrigin: 'top right',
        },
        '& input': {
            textAlign: 'right',
        },
    },
    button: {
        display: 'flex',
    },
    timeInput: {
        marginBottom: 24,
    },
    timeSeparator: {
        margin: '10px 5px 0 5px',
    },
}));

export default function TodoItemForm() {
    const classes = useInputStyles();
    const { dispatch } = useTodoItems();
    const { control, handleSubmit, reset, watch } = useForm();
    const validateTimeInput = (time: string, { target: { value }}: { target: { value: string } }) => {
        if (value === '') return true
        if (/^\d+$/.test(value)) {
            return time === 'minutes'
                ? +value < 60
                : +value < 24
        } else return false
    }

    return (
        <form
            onSubmit={handleSubmit((formData: TodoItem) => {
                dispatch({ type: 'add', data: formData });
                reset({ title: '', details: '', hours: '', minutes: '' });
            })}
        >
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="TODO"
                        fullWidth={true}
                        className={classes.root}
                    />
                )}
            />
            <Controller
                name="details"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Details"
                        fullWidth={true}
                        multiline={true}
                        className={classes.root}
                    />
                )}
            />
            <Box display="flex" alignItems="center" className={classes.timeInput}>
                <Controller
                    name="hours"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            onChange={(e) => { if (validateTimeInput('hours', e)) field.onChange(e) }}
                            inputProps={{
                                maxLength: 2,
                            }}
                            label="Hours"
                            className={classNames( classes.time, classes.hours)}
                        />
                    )}
                />
                <Box display="flex" className={classes.timeSeparator}>:</Box>
                <Controller
                    name="minutes"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            onChange={(e) => { if (validateTimeInput('minutes', e)) field.onChange(e) }}
                            inputProps={{
                                maxLength: 2,
                            }}
                            label="Minutes"
                            className={classes.time}
                        />
                    )}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!watch('title')}
                className={classes.button}
            >
                Add
            </Button>
        </form>
    );
}
