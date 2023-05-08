import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');

const Task = sequelize.define('sb_task', {
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
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: true,
    },
    recurrence: {
        type: DataTypes.ENUM(
            'daily',
            'monthly',
            'yearly',
            'weekly',
            'monthly last day',
            'monthly first day of week',
            'monthly last day of week',
        ),
        allowNull: true,
    },
    recurrence_unit: {
        type: DataTypes.ENUM(
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ),
        allowNull: true,
    },
    belongsTo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'sb_tasks',
    timestamps: false,
});


Task.belongsTo(Project, {
    foreignKey: {
        allowNull: true,
        name: 'project_id'
    }
});