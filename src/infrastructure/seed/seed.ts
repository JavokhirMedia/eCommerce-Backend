import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { UserEntity } from 'src/core/entity/user.entity';
import { CategoryEntity } from 'src/core/entity/category.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { Roles } from 'src/common/database/Enums';
import * as bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(UserEntity);
    const categoryRepository = AppDataSource.getRepository(CategoryEntity);
    const productRepository = AppDataSource.getRepository(ProductEntity);

    // ------------------- Super Admin Seed -------------------
    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const admin = userRepository.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: Roles.SUPER_ADMIN,
      });
      await userRepository.save(admin);
      console.log('✅ Super Admin created successfully');
    }

    // ------------------- Category Seed -------------------
    const categories = ['Books', 'Electronics', 'Clothing'];
    for (const name of categories) {
      const exists = await categoryRepository.findOne({ where: { name } });
      if (!exists) {
        const category = categoryRepository.create({ name });
        await categoryRepository.save(category);
        console.log(`✅ Category "${name}" created successfully`);
      }
    }

    // ------------------- Product Seed -------------------
    const admin = await userRepository.findOne({ where: { role: Roles.ADMIN } });
    const category = await categoryRepository.findOne({ where: { name: 'Books' } });

    if (admin && category) {
      const products = [
        { name: 'Book 1', description: 'A great book', price: 10, stock: 100, user: admin, category },
        { name: 'Book 2', description: 'Another great book', price: 15, stock: 50, user: admin, category },
      ];

      for (const productData of products) {
        const exists = await productRepository.findOne({ where: { name: productData.name } });
        if (!exists) {
          const product = productRepository.create(productData);
          await productRepository.save(product);
          console.log(`✅ Product "${productData.name}" created successfully`);
        }
      }
    }

    console.log('🎉 All seeds executed successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};

// Seedlarni ishga tushirish
seedDatabase();
