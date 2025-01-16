import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export async function up(queryInterface: QueryInterface) {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await queryInterface.bulkInsert('Users', [
    {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('Users', {});
}
