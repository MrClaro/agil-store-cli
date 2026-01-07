import { text, isCancel, log } from "@clack/prompts";
import color from "picocolors";
import Table from "cli-table3";
import { productService } from "../services/productService.js";

export async function searchProduct() {
  const query = await text({
    message: "Buscar por ID ou Nome do produto:",
    placeholder: "Ex: smartphone ou a1b2c3d4",
  });

  if (isCancel(query)) return;

  const results = await productService.search(query);

  if (results.length === 0) {
    log.warn(color.yellow(`Nenhum produto encontrado para: "${query}"`));
    return;
  }

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const table = new Table({
    head: [
      color.cyan("ID"),
      color.cyan("Nome"),
      color.cyan("Categoria"),
      color.cyan("Qtd"),
      color.cyan("Preço"),
      color.cyan("Criado em"),
    ],
  });

  results.forEach((p) => {
    table.push([
      p.id,
      p.name,
      p.category,
      p.quantity,
      formatter.format(p.price / 100),
      new Date(p.createdAt).toLocaleDateString("pt-BR"),
    ]);
  });

  log.info(color.green(`Encontramos ${results.length} resultado(s):`));
  console.log(table.toString());
}
