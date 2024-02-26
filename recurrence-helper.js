import Task from "./models/tasks.js";

const dayOfWeekMapping = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

/**
 * @param {string} iso_due_date - The original due date for the task.
* @param {string} recurrence - The type of recurrence pattern ("daily", "monthly", "monthly last day", "monthly first day of week", "monthly last day of week", "weekly", "yearly").
* @param {string} recurrence_unit - The units of recurrence ("sunday", "monday", "tuesday", "wednesday,thursday", etc).
* @returns {Array} - An inclusive array of dates generated based on the given recurrence pattern and units.
*/
function generateRecurrenceDates(iso_due_date, recurrence, recurrence_unit) {
    const dates = [];

    const dueDate = new Date(iso_due_date);
    const time = dueDate.getHours();
    const recurrenceUnitsArray = recurrence_unit ? recurrence_unit.split(",").map((unit) => unit.trim().toLowerCase()) : ["sunday"];

    switch(recurrence)
    {
        case "daily": {
            for(let i= 1; i <= 365; i++) {
                const instanceDate = dueDate;
                instanceDate.setDate(instanceDate.getDate() + i);
                instanceDate.setHours(time);

                dates.push(instanceDate);
            }
            break;
        }
        case "weekly": {
            // Loop through each recurrence unit (e.g., "monday", "tuesday")
            recurrenceUnitsArray.forEach(recurrenceUnit => {
                const dayOfWeek = dayOfWeekMapping[recurrenceUnit];
                const dueDayOfWeek = dueDate.getDay();
                let instanceDate = dueDate;

                // Find the next occurrence of the specified day of the week
                if (dayOfWeek !== dueDayOfWeek) {
                    // Calculate the difference in days between the due date and the target day of the week
                    let diff = dayOfWeek - dueDayOfWeek;
                    // If the target day is before the due day, add 7 days to get the next occurrence
                    if (diff < 0) diff += 7;
                    // Set the instanceDate to the next occurrence of the target day of the week
                    instanceDate.setDate(instanceDate.getDate() + diff);
                }

                instanceDate.setHours(time);

                for (let i = 0; i < 52; i++) {
                    dates.push(new Date(instanceDate));
                    // Add 1 week to the instanceDate to find the next occurrence
                    instanceDate.setDate(instanceDate.getDate() + 7); // Add 1 week
                }
            });
            
            break;
        }
        case "monthly": {
            for (let i = 1; i <= 12; i++) {
                const instanceDate = new Date(
                    dueDate.getFullYear(),
                    dueDate.getMonth() + i,
                    dueDate.getDate(),
                );
                
                instanceDate.setHours(time);

                if (dates.indexOf(instanceDate) == -1) dates.push(instanceDate);
                else console.log("duplicated date");
            }
            break;
        }
        case "monthly last day": {
            for (let i = 0; i < 12; i++) {
                const nextMonth = new Date(
                    dueDate.getFullYear(),
                    dueDate.getMonth() + i + 1,
                    1,
                );
                
                const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
                
                dates.push(lastDay);
            }

            break;
        }
        case "monthly first day of week": {
            recurrenceUnitsArray.forEach((recurrence_unit) => {
                const dayOfWeek = dayOfWeekMapping[recurrence_unit];

                let instanceDate = new Date(dueDate);
                instanceDate.setHours(time);

                // Find the first occurrence of the specified day of the week in or after the due date month
                while (instanceDate.getDay() !== dayOfWeek || instanceDate < dueDate) {
                    instanceDate.setDate(instanceDate.getDate() + 1);
                }

                // If the instance date is after the due date, move to the next month
                if (instanceDate > dueDate) {
                    instanceDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 1);
                    while (instanceDate.getDay() !== dayOfWeek) {
                        instanceDate.setDate(instanceDate.getDate() + 1);
                    }
                }

                // Add the instance date to the result array
                dates.push(new Date(instanceDate));

                for (let i = 1; i <= 11; i++) {
                    // Set instanceDate to the first occurrence of the specified day of the week in each subsequent month
                    instanceDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + i + 1, 1);
                    while (instanceDate.getDay() !== dayOfWeek) {
                        instanceDate.setDate(instanceDate.getDate() + 1);
                    }
                    instanceDate.setHours(time);
                    dates.push(instanceDate);
                }
            });

            break;
        }
        case "monthly last day of week": {
            recurrenceUnitsArray.forEach((recurrence_unit) => {
                const dayOfWeek = dayOfWeekMapping[recurrence_unit];

                for (let i = 0; i < 12; i++) {
                    // Set lastDayOfMonth to the last day of each subsequent month
                    const lastDayOfMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + i + 1, 0);

                    // Find the nearest occurrence of the specified day of the week before or on the due date
                    while (lastDayOfMonth.getDay() !== dayOfWeek && lastDayOfMonth >= dueDate) {
                        lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
                    }

                    // Add the instance date to the result array
                    if (lastDayOfMonth >= dueDate) {
                        dates.push(new Date(lastDayOfMonth));
                    }
                }
            });

            break;
        }
        case "yearly": {
            for (let i = 1; i <= 5; i++) {
                const instanceDate = new Date(dueDate.getFullYear() + i, dueDate.getMonth(), dueDate.getDate());
                instanceDate.setHours(time);

                dates.push(instanceDate);
            }

            break;
        }
        default:
            console.error("Something went wrong, recurrence", recurrence);
            break;
    }
    
    return dates;
}
/**
 * @param {Object} recurrenceTask - The original task.
 * @param {boolean} alt - Used for the recurrence task scheduler, prevents the first generated task from being created to stop a duplicate task from being made.
 * @returns {Object} - The original task
 */
export async function handleRecurrenceTask(recurrenceTask, alt) {
    const { due_date, recurrence, recurrence_unit } = recurrenceTask;

    let task;

    if (due_date && isValidRecurrenceDate(due_date, recurrence, recurrence_unit)) {
        const recurrenceDates = generateRecurrenceDates(due_date, recurrence, recurrence_unit);

        // Remove first item in the array since it includes the passed date
        recurrenceDates.splice(0,1);

        if (alt !== true) {
            task = await Task.create(recurrenceTask);
            generateTasks(task, recurrenceDates, false);
        } else {
            generateTasks(recurrenceTask, recurrenceDates, true);
        }

    } else {
        // Due date is not valid or is null
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const recurrenceDates = generateRecurrenceDates(currentDate.toISOString(), recurrence, recurrence_unit);

        const originalTask = {
            ...recurrenceTask,
            due_date: recurrenceDates.shift(), // use the first element
            original_task_id: null,
        };
        
        task = await Task.create(originalTask);

        generateTasks(task, recurrenceDates, false);
    }

    return task;
}

function isValidRecurrenceDate (iso_due_date, recurrence, recurrence_unit) {
    const dueDate = new Date(iso_due_date);
    const dayOfWeek = dueDate.getDay();
    const dayOfMonth = dueDate.getDate();
    const month = dueDate.getMonth();
    const year = dueDate.getFullYear();

    switch (recurrence) {
        case "daily":
        case "yearly":
        case "monthly":
            return true; // Any date is valid for daily, yearly, or monthly recurrence
        case "weekly":
            if (!recurrence_unit) return false; // If no recurrence unit is specified, return false
            const recurrenceUnitsForWeekly = recurrence_unit.split(",");
            const recurrenceDaysOfWeek = recurrenceUnitsForWeekly.map(unit => dayOfWeekMapping[unit.trim()]);
            return recurrenceDaysOfWeek.includes(dayOfWeek);
        case "monthly last day":
            // Check if the day of month is the last day of the month
            return dayOfMonth === new Date(year, month + 1, 0).getDate();
        case "monthly first day of week":
            // Check if the day of month is the first occurrence of any specified day of the week in the month
            const recurrenceUnitsForFirstDay = recurrence_unit ? recurrence_unit.split(",").map(unit => unit.trim().toLowerCase()) : ["sunday"];
            for (const unit of recurrenceUnitsForFirstDay) {
                const dayOfWeekToFind = dayOfWeekMapping[unit];
                let firstDayOfWeekDate = new Date(year, month, 1); // Start from the first day of the month
                while (firstDayOfWeekDate.getDay() !== dayOfWeekToFind) {
                    firstDayOfWeekDate.setDate(firstDayOfWeekDate.getDate() + 1); // Move to the next day
                }
                // If the specified day of the week is not found in the first week, move to the next week
                if (firstDayOfWeekDate.getMonth() !== month) {
                    firstDayOfWeekDate.setDate(firstDayOfWeekDate.getDate() + 7);
                }
                // Check if the day of month matches the due date
                if (dayOfMonth === firstDayOfWeekDate.getDate()) {
                    return true;
                }
            }
            return false;
        case "monthly last day of week":
            // Check if the day of month is the last occurrence of any specified day of the week in the month
            const recurrenceUnitsForLastDay = recurrence_unit ? recurrence_unit.split(",").map(unit => unit.trim().toLowerCase()) : ["sunday"];
            for (const unit of recurrenceUnitsForLastDay) {
                const dayOfWeekToFind = dayOfWeekMapping[unit];
                let lastDayOfWeekDate = new Date(year, month + 1, 0); // Start from the last day of the month
                let lastDayOfMonth = lastDayOfWeekDate.getDate();
                while (lastDayOfWeekDate.getDay() !== dayOfWeekToFind) {
                    lastDayOfMonth--; // Move to the previous day
                    lastDayOfWeekDate = new Date(year, month, lastDayOfMonth); // Update the date
                }
                // Check if the day of month matches the due date
                if (dayOfMonth === lastDayOfMonth) {
                    return true;
                }
            }
            return false;
        default:
            return false; // Default to false if recurrence pattern is unknown
    }
}

function generateTasks(task, dates, recurrenceScheduler) {
    if (!dates || !task) return;

    dates.forEach(async date => {
        const recurringTask = {
            ...task.dataValues ? task.dataValues : task,
            id: null,
            creation_date: new Date(),
            due_date: date,
            original_task_id: recurrenceScheduler ? task.original_task_id :task.id
        }
        await Task.create(recurringTask);
    });
}