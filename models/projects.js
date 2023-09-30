import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";

const Project = sequelize.define("sb_projects", {
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
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("not started", "on hold", "in progress", "completed"),
        allowNull: false,
        defaultValue: "not started"
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false
    },
    area_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "sb_areas",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    goal_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_goals",
            key: "id"
        }
    },
    belongs_to: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    tableName: "sb_projects"
});

export default Project;