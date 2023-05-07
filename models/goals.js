import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database.js";

const Goal = sequelize.define('sb_goals', {
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
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: true
    },
    areaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sb_areas',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Goal',
    tableName: 'sb_goals',
    timestamps: false
});

Goal.belongsTo(Area, { foreignKey: 'area_id' });

export default Goal;