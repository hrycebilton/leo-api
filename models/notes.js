import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";

const Note = sequelize.define("sb_notes", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM("recipe", "video", "audio", "other", "article", "image", "text"),
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT("medium"),
        allowNull: false
    },
    source: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_projects",
            key: "id"
        }
    },
    area_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_areas",
            key: "id"
        }
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "sb_resources",
            key: "id"
        }
    },
    belongs_to: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Note",
    tableName: "sb_notes",
    timestamps: false
});

Note.belongsTo(Project, { foreignKey: "project_id" });
Note.belongsTo(Area, { foreignKey: "area_id" });
Note.belongsTo(Resource, { foreignKey: "resource_id" });

export default Note;