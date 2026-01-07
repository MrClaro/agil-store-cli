import { storage } from "../database/storage.js";
import { productSchema } from "../schemas/product.js";
import { randomUUID } from "crypto";

export const productService = {
  async create(dados) {
    const validatedData = productSchema.parse(dados);

    const products = await storage.getAll();

    const newProduct = {
      id: randomUUID().split("-")[0],
      ...validatedData,
      price: Math.round(validatedData.price * 100),
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    await storage.save(products);

    return newProduct;
  },

  async listAll() {
    return await storage.getAll();
  },

  async search(query) {
    const products = await storage.getAll();
    const searchTerm = query.toLowerCase();

    return products.filter(
      (p) =>
        p.id.toLowerCase() === searchTerm ||
        p.name.toLowerCase().includes(searchTerm),
    );
  },

  async update(id, updateData) {
    const products = await storage.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado.");

    const partialSchema = productSchema.partial();
    const validated = partialSchema.parse(updateData);

    if (validated.price !== undefined) {
      validated.price = Math.round(validated.price * 100);
    }

    products[index] = {
      ...products[index],
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    await storage.save(products);
    return products[index];
  },

  async delete(id) {
    const products = await storage.getAll();
    const filtered = products.filter((p) => p.id !== id);

    if (products.length === filtered.length)
      throw new Error("Produto não encontrado.");

    await storage.save(filtered);
    return true;
  },
};
