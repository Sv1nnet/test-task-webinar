import { useCallback } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { TodoItem, useTodoItems } from '@context/TodoItemsContext';

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

export const TodoItemsList = function () {
    const { todoItems } = useTodoItems();

    const classes = useTodoItemListStyles();

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }

        if (!a.done && b.done) {
            return -1;
        }

        return 0;
    });

    return (
        <ul className={classes.root}>
            {sortedItems.map((item) => (
                <motion.li key={item.id} transition={spring} layout={true}>
                    <TodoItemCard item={item} />
                </motion.li>
            ))}
        </ul>
    );
};

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
    header: {
        paddingBottom: 0,
    },
    time: {
        paddingTop: 0
    }
});

export const TodoItemCard = function ({ item }: { item: TodoItem }) {
    const classes = useTodoItemCardStyles();
    const { remove, toggle } = useTodoItems();

    const handleDelete = useCallback(
        () => remove({ id: item.id }),
        [item.id, remove],
    );

    const handleToggleDone = useCallback(
        () =>
        toggle({ id: item.id }),
        [item.id, toggle],
    );

    const getCardTime = () => {
        if (!item.date) return null
    
        const taskDate = new Date(item.date)
        const [hours, minutes] = [taskDate.getHours(), taskDate.getMinutes()]
        const time = `${hours > 10 ? hours : `0${hours}`}:${minutes > 10 ? minutes : `0${minutes}`}`
        return time
    }

    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                className={classnames(!!item.date && classes.header)}
                action={
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.done}
                                onChange={handleToggleDone}
                                name={`checked-${item.id}`}
                                color="primary"
                            />
                        }
                        label={item.title}
                    />
                }
            />
            {item.date ? (
                <CardContent className={classes.time}>
                    <Typography variant="body2">
                        {getCardTime()}
                    </Typography>
                </CardContent>
            ) : null}
            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
    );
};
