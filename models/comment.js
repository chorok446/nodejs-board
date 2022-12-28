const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static initiate(sequelize) {
        Comment.init({
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
        db.Comment.belongsTo(db.User);
    }
}

module.exports = Comment;