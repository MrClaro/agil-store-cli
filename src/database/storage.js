import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATEGORIES_PATH = path.resolve(__dirname, "../../data/categories.json");
const DATA_PATH = path.resolve(__dirname, "../../data/products.json");

export const storage = {
  async getCategories() {
    try {
      if (!(await fs.pathExists(CATEGORIES_PATH))) {
        const defaults = ["Smartphones", "Laptops", "Acessórios", "Outros"];
        await fs.writeJson(CATEGORIES_PATH, defaults);
        return defaults;
      }
      return await fs.readJson(CATEGORIES_PATH);
    } catch {
      return [];
    }
  },

  async init() {
    try {
      const dir = path.dirname(DATA_PATH);
      await fs.ensureDir(dir);

      const exists = await fs.pathExists(DATA_PATH);
      if (!exists) {
        await fs.writeJson(DATA_PATH, []);
      }
    } catch (error) {
      throw new Error(`Erro na inicialização: ${error.message}`);
    }
  },

  async getAll() {
    try {
      return await fs.readJson(DATA_PATH);
    } catch (error) {
      return [];
    }
  },

  async save(produtos) {
    try {
      await fs.writeJson(DATA_PATH, produtos, { spaces: 2 });
    } catch (error) {
      throw new Error(`Erro ao salvar: ${error.message}`);
    }
  },
};
