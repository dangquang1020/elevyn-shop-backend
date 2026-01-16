import { Module } from '@nestjs/common';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService],
  exports: [ProductsService, CategoriesService],
})
export class CatalogModule {}
