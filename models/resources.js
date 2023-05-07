import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');

const Resource = sequelize.define('sb_resources', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
            key: 'id',
        },
    },
}, {
    tableName: 'sb_resources',
    timestamps: false,
});