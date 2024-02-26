import { Sequelize, Op } from "sequelize";
import Task from "../models/tasks.js";
import { handleRecurrenceTask } from "../recurrence-helper.js";

function getDayBeforeDate(date) {
    const dayBefore = new Date(date);
    dayBefore.setDate(dayBefore.getDate() - 1);

    // Handle the case where the date is 1
    if (dayBefore.getDate() === 1) {
        // If the date was 1, it means it's now the last day of the previous month
        // Move to the last day of the previous month
        dayBefore.setMonth(dayBefore.getMonth(), 0);
    }

    return dayBefore;
}

try {
    //Get the most recent instances of all recurring tasks
    const recentRecurringTasks = await Task.findAll({
        attributes: [
            "original_task_id",
            [Sequelize.fn('MAX', Sequelize.col('due_date')), 'maxDue']
        ],
        where: {
            original_task_id: { [Op.not]: null } // Only tasks with original task IDs
        },
        group: ['original_task_id']
    });
    
    // Fetch the complete rows for the most recent instances
    const mostRecentInstances = [];
    for (const task of recentRecurringTasks) {
        const { original_task_id, maxDue } = task.dataValues;
        const mostRecentInstance = await Task.findOne({
            where: {
                original_task_id: original_task_id,
                due_date: maxDue
            }
        });
        mostRecentInstances.push(mostRecentInstance);
    }

    //Create task instances
    if (mostRecentInstances.length > 0) {
        for (const instance of mostRecentInstances) {
            const dayBeforeNextDueDate = getDayBeforeDate(new Date(instance.due_date));
            const currentDate = new Date();
            // Check if the day before the next due date is today
            if (currentDate.toDateString() == dayBeforeNextDueDate.toDateString()) {
                // Create new instances with the next due dates
                await handleRecurrenceTask(instance.dataValues, true);
                console.log('Recurring tasks created');
            }
        };
    }
} catch (error) {
    console.error('Error creating recurring tasks:', error);
}