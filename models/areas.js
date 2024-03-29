import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";

const Area = sequelize.define("sb_areas", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    is_favorited: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
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
    modelName: "Area",
    tableName: "sb_areas",
    timestamps: false
});

export default Area;