module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'task_app_db'
      },
      migrations: {
        directory: './migrations'
      }
    }
  };