import {
  text,
  isCancel,
  spinner,
  log,
  note,
  multiselect,
  select,
} from "@clack/prompts";
import color from "picocolors";
import { productService } from "../services/productService.js";
import { storage } from "../database/storage.js";

export async function updateProduct() {
  const id = await text({ message: "Informe o ID do produto para atualizar:" });
  if (isCancel(id)) return;

  const products = await productService.listAll();
  const product = products.find((p) => p.id === id);

  if (!product) {
    log.error(color.red("Produto não encontrado."));
    return;
  }

  const fields = await multiselect({
    message: "Quais campos você deseja atualizar?",
    options: [
      { value: "name", label: "Nome" },
      { value: "category", label: "Categoria" },
      { value: "quantity", label: "Quantidade" },
      { value: "price", label: "Preço" },
    ],
    required: true,
  });

  if (isCancel(fields)) return;

  const newData = {};

  if (fields.includes("name")) {
    const name = await text({ message: `Novo nome (Atual: ${product.name}):` });
    if (isCancel(name)) return;
    newData.name = name;
  }

  if (fields.includes("category")) {
    const categories = await storage.getCategories();
    const category = await select({
      message: `Nova categoria (Atual: ${product.category}):`,
      options: categories.map((c) => ({ value: c, label: c })),
    });
    if (isCancel(category)) return;
    newData.category = category;
  }

  if (fields.includes("quantity")) {
    const qty = await text({
      message: `Nova quantidade (Atual: ${product.quantity}):`,
    });
    if (isCancel(qty)) return;
    newData.quantity = Number(qty);
  }

  if (fields.includes("price")) {
    const price = await text({
      message: `Novo preço em R$ (Atual: ${(product.price / 100).toFixed(2)}):`,
    });
    if (isCancel(price)) return;
    newData.price = Number(price);
  }

  const s = spinner();
  try {
    s.start("Atualizando produto...");

    const updated = await productService.update(id, newData);

    s.stop(color.green("Produto atualizado com sucesso!"));

    note(
      `Nome: ${updated.name}\n` +
        `Preço: R$ ${(updated.price / 100).toFixed(2)}\n` +
        `Estoque: ${updated.quantity}`,
      "Dados Atualizados",
    );
  } catch (error) {
    s.stop(color.red("Falha na validação dos dados"));
    if (error.issues) {
      error.issues.forEach((i) => log.error(color.red(`- ${i.message}`)));
    } else {
      log.error(error.message);
    }
  }
}
