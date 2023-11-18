import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";
import Project from "./projects.js";

const Task = sequelize.define("sb_task", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
    },
    recurrence: {
        type: DataTypes.ENUM(
            "daily",
            "monthly",
            "yearly",
            "weekly",
            "monthly last day",
            "monthly first day of week",
            "monthly last day of week",
        ),
        allowNull: true,
    },
    recurrence_unit: {
        type: DataTypes.ENUM(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ),
        allowNull: true,
    },
    is_finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_projects",
            key: "id"
        }
    },
    goal_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_goals",
            key: "id"
        }
    },
    original_task_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_archived: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    belongs_to: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: "sb_tasks",
    timestamps: false,
});

Task.belongsTo(Project, {
    foreignKey: {
        allowNull: true,
        name: "project_id"
    }
});

export default Task;