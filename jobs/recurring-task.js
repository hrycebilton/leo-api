import { Sequelize, Op } from "sequelize";
import Task from "../models/tasks.js";

function calculateNextDueDate(recurringTask) {
    const { recurrence, start_date, recurrence_unit } = recurringTask;
    const currentDate = new Date();

    // Calculate the time difference between the current date and start_date
    const timeDifference = currentDate - start_date;

    // Calculate next due date based on recurrence pattern and start_date
    switch (recurrence) {
        case "daily":
            const nextDay = new Date(start_date.getTime() + 24 * 60 * 60 * 1000);
            return nextDay;

        case "weekly":
            return new Date(start_date.getTime() + timeDifference + 7 * 24 * 60 * 60 * 1000);

        case "monthly":
            const nextMonth = new Date(start_date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return new Date(nextMonth);

        case "monthly last day":
            const nextMonthLastDay = new Date(start_date.getFullYear(), start_date.getMonth() + 2, 0);
            return new Date(nextMonthLastDay);

        case "monthly first day of week":
            const nextMonthFirstDayOfWeek = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 1);
            return nextDayOfWeek(nextMonthFirstDayOfWeek, recurrence_unit);

        case "monthly last day of week":
            const nextMonthLastDayOfMonth = new Date(start_date.getFullYear(), start_date.getMonth() + 2, 0);
            return nextDayOfWeek(nextMonthLastDayOfMonth, recurrence_unit);

        case "yearly":
            const nextYear = new Date(start_date);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            return new Date(nextYear);

        default:
            throw new Error("Invalid recurrence pattern");
    }
}

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
            [Sequelize.fn('MAX', Sequelize.col('start_date')), 'maxStart']
        ],
        where: {
            original_task_id: { [Op.not]: null } // Only tasks with original task IDs
        },
        group: ['original_task_id']
    });

    // Fetch the complete rows for the most recent instances
    const mostRecentInstances = [];
    for (const task of recentRecurringTasks) {
        const { original_task_id, maxStart } = task.dataValues;
        const mostRecentInstance = await Task.findOne({
            where: {
                original_task_id: original_task_id,
                start_date: maxStart
            }
        });
        mostRecentInstances.push(mostRecentInstance);
    }

    //Create task instances
    if (mostRecentInstances) {
        for (const item of mostRecentInstances) {
            const nextDueDate = calculateNextDueDate(item);
            const dayBeforeNextDueDate = getDayBeforeDate(nextDueDate);
            const currentDate = new Date();

            // Check if the next due date is today
            if (currentDate.toDateString() == dayBeforeNextDueDate.toDateString()) {
                // Create a new instance with the calculated due date
                await Task.create({
                    id: null,
                    name: item.name,
                    description: item.description,
                    start_date: nextDueDate,
                    creation_date: new Date().toISOString(),
                    priority: item.priority,
                    recurrence: item.recurrence,
                    recurrence_unit: item.recurrence_unit,
                    project_id: item.project_id,
                    goal_id: item.goal_id,
                    original_task_id: item.original_task_id,
                    belongs_to: item.belongs_to
                });

                console.log('Recurring task created');
            }
        };
    }
} catch (error) {
    console.error('Error creating recurring task:', error);
}