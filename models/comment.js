const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull : false,
            },
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            twitId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "posts",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Comment.belongsTo(db.Post, {
            foreignKey: "twitId",
            onDelete: 'CASCADE'
        });
        db.Comment.belongsTo(db.User, {
            foreignKey: "userId",
            onDelete: 'CASCADE'
        });
    }
};