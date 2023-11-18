import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Area from "./areas.js";


const Resource = sequelize.define("sb_resources", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    area_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Area,
            key: "id",
        },
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
    tableName: "sb_resources",
    timestamps: false,
});

export default Resource;