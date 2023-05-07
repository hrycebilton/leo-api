import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');

const Project = sequelize.define('sb_projects', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('not started', 'on hold', 'in progress', 'completed'),
        allowNull: false,
        defaultValue: 'not started'
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false
    },
    areaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sb_areas',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    goalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sb_goals',
            key: 'id'
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'sb_projects'
});

export default Project;