import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";
import Area from "./areas.js";

const Goal = sequelize.define("sb_goals", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true
    },
    area_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_areas",
            key: "id"
        }
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
    sequelize,
    modelName: "Goal",
    tableName: "sb_goals",
    timestamps: false
});

Goal.belongsTo(Area, { foreignKey: "area_id" });

export default Goal;