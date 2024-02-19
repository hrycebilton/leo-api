import Task from "./models/tasks.js";

/**
 * Generates a list of dates based on the given recurrence pattern and units.
 * @param {Date} due_date - The original due date for the task.
 * @param {string} recurrence - The type of recurrence pattern ("daily", "monthly", "monthly last day", "monthly first day of week", "monthly last day of week", "weekly", "yearly").
 * @param {string} recurrence_unit - The units of recurrence ("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday").
 * @param {number} iterations - The number of iterations to generate dates for.
 * @returns {Array} - An array of dates generated based on the given recurrence pattern and units.
 */
export const getDatesBasedOnRecurrence = (due_date, recurrence, recurrence_unit, iterations) => {
    const dates = [];
    const currentDate = new Date(); // Get the current date
    currentDate.setHours(0, 0, 0, 0);
    const time = due_date ? new Date(due_date).getHours() : currentDate.getHours();
    const dueDate = due_date ? new Date(due_date) : null;
    const dayOfWeekMapping = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    // Split the recurrence units into an array
    const recurrenceUnitsArray = recurrence_unit ? recurrence_unit.split(",").map((unit) => unit.trim().toLowerCase()) : ["sunday"];
    switch (recurrence) {
        case "daily": {
            for (let i = 1; i <= iterations; i++) {
                const instanceDate = new Date(currentDate);
                instanceDate.setDate(instanceDate.getDate() + i);
                instanceDate.setHours(time);

                dates.push(instanceDate);
            }

            break;
        }
        case "monthly": {
            for (let i = 1; i <= iterations; i++) {
                const instanceDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + i,
                    dueDate.getDate(),
                );
                instanceDate.setHours(time);

                if (dates.indexOf(instanceDate) == -1) dates.push(instanceDate);
                else console.log("duplicated date");
            }

            break;
        }
        case "monthly last day": {
            for (let i = 0; i < iterations; i++) {
                const nextMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + i + 1,
                    1,
                );
                const lastDay = new Date(nextMonth - 1);
                lastDay.setHours(time);
                dates.push(lastDay);
            }

            break;
        }
        case "monthly first day of week": {
            recurrenceUnitsArray.forEach((recurrence_unit) => {
                const dayOfWeek = dayOfWeekMapping[recurrence_unit];

                for (let i = 1; i <= iterations; i++) {
                    const instanceDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);

                    // Find the first occurrence of the specified day of the week in the month
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

                for (let i = 1; i <= iterations; i++) {
                    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 0);

                    // Find the last occurrence of the specified day of the week in the month
                    while (lastDayOfMonth.getDay() !== dayOfWeek) {
                        lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
                    }

                    lastDayOfMonth.setHours(time);

                    dates.push(lastDayOfMonth);
                }
            });

            break;
        }
        case "weekly": {
            recurrenceUnitsArray.forEach((recurrence_unit) => {
                const dayOfWeek = dayOfWeekMapping[recurrence_unit];
                const dueDayOfWeek = dueDate.getDay();
                let instanceDate = new Date(dueDate);

                // Find the next occurrence of the specified day of the week
                if (dayOfWeek !== dueDayOfWeek) {
                    let diff = dayOfWeek - dueDayOfWeek;
                    if (diff < 0) diff += 7;
                    instanceDate.setDate(instanceDate.getDate() + diff);
                }

                instanceDate.setHours(time);

                for (let i = 0; i < iterations; i++) {
                    
                    dates.push(new Date(instanceDate));
                    instanceDate.setDate(instanceDate.getDate() + 7); // Add 1 week
                }
            });
            break;
        }
        case "yearly": {
            for (let i = 1; i <= iterations; i++) {
                const instanceDate = new Date(currentDate.getFullYear() + i, dueDate.getMonth(), dueDate.getDate());
                instanceDate.setHours(time);

                dates.push(instanceDate);
            }

            break;
        }
        default:
            console.error("Shouldn't be possible.");
            break;
    }

    return dates;
};

/**
 * Creates recurring instances of a task based on its recurrence pattern.
 * @param {Object} originalTask - The original task object.
 */
export const createRecurringInstances = async (originalTask) => {
  const { recurrence, recurrence_unit, due_date } = originalTask;

  let dates = [];
  
  // Get a list of dates based on the recurrence unit and pattern
  switch (recurrence) {
    case "daily":
      const dailyDates = getDatesBasedOnRecurrence(due_date, recurrence, recurrence_unit, 365);
      dates.push(...dailyDates);
      break;
    case "monthly":
    case "monthly last day":
    case "monthly first day of week":
    case "monthly last day of week":
      const monthlyDates = getDatesBasedOnRecurrence(due_date, recurrence, recurrence_unit, 12);
      dates.push(...monthlyDates);
      break;
    case "weekly":
      const weeklyDates = getDatesBasedOnRecurrence(due_date, recurrence, recurrence_unit, 52);
      dates.push(...weeklyDates);
      break;
    case "yearly":
      const yearlyDates = getDatesBasedOnRecurrence(due_date, recurrence, recurrence_unit, 5);
      dates.push(...yearlyDates);
      break;
    default:
      console.log("Something went wrong.");
      break;
  }

  // Create tasks with the original task id and the list of due dates
  if (dates.length > 0) {
    for (const item of dates) {
      const newInstance = {
        ...originalTask,
        id: null,
        start_date: null,
        due_date: item,
        original_task_id: originalTask.id
      };

      await Task.create(newInstance);
    }
  }
};