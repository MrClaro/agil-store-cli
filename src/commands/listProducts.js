import Table from "cli-table3";
import color from "picocolors";
import { log, isCancel, select } from "@clack/prompts";
import { productService } from "../services/productService.js";
import { storage } from "../database/storage.js";

export async function listProducts() {
  let products = await productService.listAll();

  if (products.length === 0) {
    log.warn(color.yellow("O inventário está vazio."));
    return;
  }

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const option = await select({
    message: "Deseja filtrar ou ordenar a lista?",
    options: [
      { value: "none", label: "Não, exibir tudo" },
      { value: "filter", label: "Filtrar por Categoria" },
      { value: "sort_name", label: "Ordenar por Nome" },
      { value: "sort_price", label: "Ordenar por Preço" },
      { value: "sort_qty", label: "Ordenar por Quantidade" },
    ],
  });

  if (isCancel(option)) return;

  if (option === "filter") {
    const categories = await storage.getCategories();
    const selectedCat = await select({
      message: "Escolha a categoria para filtrar:",
      options: categories.map((c) => ({ value: c, label: c })),
    });

    products = products.filter((p) => p.category === selectedCat);
  }

  if (!products.length) {
    log.warn(
      color.yellow("Nenhum produto encontrado com o filtro selecionado."),
    );
    return;
  }

  if (option === "sort_name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (option === "sort_price") {
    products.sort((a, b) => a.price - b.price);
  } else if (option === "sort_qty") {
    products.sort((a, b) => a.quantity - b.quantity);
  }

  const table = new Table({
    head: [
      color.cyan("ID"),
      color.cyan("Nome"),
      color.cyan("Categoria"),
      color.cyan("Qtd"),
      color.cyan("Preço"),
    ],
    colWidths: [10, 25, 20, 10, 15],
  });

  products.forEach((p) => {
    table.push([
      p.id,
      p.name,
      p.category,
      p.quantity,
      formatter.format(p.price / 100),
    ]);
  });

  console.log("\n" + table.toString());

  const back = await select({
    message: "Deseja fazer algo mais?",
    options: [
      { value: "back", label: "Voltar ao menu principal" },
      { value: "filter", label: "Filtrar/Ordenar novamente" },
    ],
  });

  if (isCancel(back)) return;
  if (back === "filter") {
    await listProducts();
  }
}
