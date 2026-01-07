import { intro, outro, select, isCancel, log } from "@clack/prompts";
import color from "picocolors";
import { storage } from "./database/storage.js";

async function main() {
  await storage.init();
  console.clear();

  intro(color.bgCyan(color.black(" AgilStore CLI - Sistema de Inventário ")));

  while (true) {
    const action = await select({
      message: "Selecione uma operação:",
      options: [
        { value: "add", label: "Adicionar Produto" },
        { value: "list", label: "Listar Produtos" },
        { value: "update", label: "Atualizar Produto" },
        { value: "delete", label: "Excluir Produto" },
        { value: "search", label: "Buscar Produto" },
        { value: "exit", label: "Sair" },
      ],
    });

    if (isCancel(action) || action === "exit") {
      outro("Saindo do sistema... Até logo!");
      break;
    }

    try {
      switch (action) {
        case "add":
          const { addProduct } = await import("./commands/addProduct.js");
          await addProduct();
          break;
        case "list":
          const { listProducts } = await import("./commands/listProducts.js");
          await listProducts();
          break;
        case "update":
          const { updateProduct } = await import("./commands/updateProduct.js");
          await updateProduct();
          break;
        case "delete":
          const { deleteProduct } = await import("./commands/deleteProduct.js");
          await deleteProduct();
          break;
        case "search":
          const { searchProduct } = await import("./commands/searchProduct.js");
          await searchProduct();
          break;
      }
    } catch (error) {
      log.error(color.red("\nOcorreu um erro inesperado:"), error.message);
    }

    console.log("\n");
  }
}

main();
