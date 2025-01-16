import * as bcrypt from 'bcryptjs';

class HashData {
  async hash(data: object | any, saltRounds: number = 10) {
    try {
      return await bcrypt.hash(data, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  async verifyHashedData(rawData: string, hashed: string) {
    try {
      return await bcrypt.compare(rawData, hashed);
    } catch (error) {
      throw error;
    }
  }
}

export default HashData;
