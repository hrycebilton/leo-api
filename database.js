import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('secondbrain_db', 'leo-api', '$sH!t6&*UA$u@jxKXjB2u5KhTdbHhwbdhBZi@tfdyUyZYrtCHh7tSGgmLK$3W7sJhnu^Q&PzkJV8*jqngyZjwKh@wpQKuNyapT&$%%2bGXnVhVk5QwhFMWQDk3WsM#9S', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
