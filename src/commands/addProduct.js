import { text, isCancel, spinner, note, log, select } from "@clack/prompts";
import color from "picocolors";
import { productService } from "../services/productService.js";
import { storage } from "../database/storage.js";

export async function addProduct() {
  const s = spinner();

  const name = await text({ message: "Nome do produto:" });
  if (isCancel(name)) return;

  const categories = await storage.getCategories();
  const category = await select({
    message: "Selecione a categoria:",
    options: categories.map((c) => ({ value: c, label: c })),
  });
  if (isCancel(category)) return;

  const quantityStr = await text({ message: "Quantidade em estoque:" });
  if (isCancel(quantityStr)) return;

  const priceStr = await text({ message: "Preço unitário:" });
  if (isCancel(priceStr)) return;

  try {
    s.start("Validando e salvando produto...");

    const produto = await productService.create({
      name,
      category,
      quantity: Number(quantityStr),
      price: Number(priceStr),
    });

    s.stop(color.green("Produto adicionado com sucesso!"));

    note(
      `ID: ${color.yellow(produto.id)}\n` +
        `Nome: ${produto.name}\n` +
        `Categoria: ${produto.category}`,
      "Detalhes do Produto",
    );
  } catch (error) {
    log.error(color.red("Erro ao adicionar produto"));

    if (error.issues) {
      error.issues.forEach((issue) => {
        console.log(color.red(`- ${issue.message}`));
      });
    } else {
      console.error(error.message);
    }
  }
}
