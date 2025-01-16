import request from 'supertest';
import app from '../../app';
import { sequelize } from '../../config/db/db.config';
import { TaskStatus } from '../../constants/enums.constants';
import User from '../../models/user.model';
import Task from '../../models/task.model';
import { guard } from '../../dependencies/dependencies';
import AppConfig from '../../config/app.config';

describe('Task Management Integration Tests', () => {
  let authToken: string;
  let userId: number;
  let taskId: number;

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
    role: 'user'
  };

  const testTask = {
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(Date.now() + 86400000) // Tomorrow
  };

  beforeAll(async () => {
    // Connect to test database
    await sequelize.sync({ force: true });

    // Create test user
    const user = await User.create(testUser);
    userId = user.id;
    authToken = guard.SIGN_TOKEN(
      user,
      AppConfig.jwt.ACCESS_TOKEN_SECRET,
      AppConfig.jwt.ACCESS_TOKEN_EXPIRY
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTask);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(testTask.title);
      expect(response.body.data.status).toBe(TaskStatus.PENDING);
      expect(response.body.data.userId).toBe(userId);

      taskId = response.body.data.id;
    });

    it('should fail to create task without authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send(testTask);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('tasks');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('currentPage');
      expect(response.body.data).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.data.tasks)).toBeTruthy();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.currentPage).toBe(1);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get(`/api/tasks?status=${TaskStatus.PENDING}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(
        response.body.data.tasks.every(
          (task: any) => task.status === TaskStatus.PENDING
        )
      ).toBeTruthy();
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should not update task of another user', async () => {
      // Create another user and their task
      const anotherUser = await User.create({
        ...testUser,
        email: 'another@example.com'
      });
      const anotherTask = await Task.create({
        ...testTask,
        userId: anotherUser.id
      });

      const response = await request(app)
        .put(`/api/tasks/${anotherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Try to update' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify task is deleted
      const deletedTask = await Task.findByPk(taskId);
      expect(deletedTask).toBeNull();
    });

    it('should not delete non-existent task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${999999}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
