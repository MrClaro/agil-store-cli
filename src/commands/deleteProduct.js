import { text, isCancel, confirm, spinner, log, note } from "@clack/prompts";
import color from "picocolors";
import { productService } from "../services/productService.js";

export async function deleteProduct() {
  const id = await text({
    message: "Informe o ID do produto que deseja excluir:",
    placeholder: "Ex: a1b2c3d4",
  });

  if (isCancel(id)) return;

  const products = await productService.listAll();
  const product = products.find((p) => p.id === id);

  if (!product) {
    log.error(color.red("Produto não encontrado com o ID informado."));
    return;
  }

  note(
    `Nome: ${product.name}\n` +
      `Categoria: ${product.category}\n` +
      `Estoque: ${product.quantity}`,
    "Produto Selecionado",
  );

  const shouldDelete = await confirm({
    message: color.red(
      `Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`,
    ),
    initialValue: false,
  });

  if (isCancel(shouldDelete) || !shouldDelete) {
    log.info(color.blue("Operação cancelada. O produto foi mantido."));
    return;
  }

  const s = spinner();

  try {
    s.start("Removendo produto do inventário...");

    await productService.delete(id);

    s.stop(color.green("Produto removido com sucesso!"));
  } catch (error) {
    s.stop(color.red("Erro ao excluir produto"));
    log.error(error.message);
  }
}
